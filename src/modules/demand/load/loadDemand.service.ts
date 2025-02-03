import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { LaneDirection } from "@prisma/client";
import { UUID } from "crypto";
import { PrismaService } from "src/core/modules/prisma/prisma.service";
import { ISession } from "src/core/types/session.types";
import { GooglePlacesService } from "src/modules/googlePlaces/googleplaces.service";

interface DataEntry {
  weight: string;
  materialName: string;
  pickupPoint: string;
  dropPoint: string;
  expirationTime: string; // Use ISO 8601 date string
  fare: number;
}

type Data = DataEntry[];
interface UpdatedDataEntry extends DataEntry {
  bulkLogId: string;
  postedBy: string;
}

@Injectable()

export class LoadService {

  private readonly LoadServiceLogger = new Logger('LoadServiceLogger')
  constructor(
    private prisma: PrismaService,
    private placesService: GooglePlacesService,
  ) { }

  async getPlaceDistrictName(placeId: string) {
    try {
      console.log()
      const { result: placeData } = await this.placesService.getPlaceData(placeId);
      console.log(placeData.address_components)
      const level3 = placeData.address_components.find((component) =>
        component.types.includes("administrative_area_level_3")
      );
      const level2 = placeData.address_components.find((component) =>
        component.types.includes("administrative_area_level_2")
      );
      const locality = placeData.address_components.find((component) =>
        component.types.includes("locality")
      )
      return level3?.long_name || level2?.long_name || locality?.long_name;

    } catch (error) {
      throw new Error(`Failed to fetch the place data: ${error}`)
    }

  }

  async addSingleLoad(loadData: any, userId: string) {
    try {
      const pickupDistrict = await this.getPlaceDistrictName(loadData.pickupPlaceId)
      const dropDistrict = await this.getPlaceDistrictName(loadData.dropPlaceId)

      if (pickupDistrict === dropDistrict)
        throw new Error(`Lane cannot have same pick and drop districts:${pickupDistrict}`)

      const existingLane = await this.prisma.transportLanes.findFirst({
        where: {
          OR: [
            {
              AND: [{ districtA: pickupDistrict }, { districtB: dropDistrict }],
            },
            {
              AND: [{ districtA: dropDistrict }, { districtB: pickupDistrict }],
            },
          ],
        },
      });

      // let newLane: TransportLanes;
      if (!existingLane) {
        const createTxn = await this.prisma.$transaction(async (prismaTX) => {
          const newLane = await prismaTX.transportLanes.create({
            data: {
              districtA: pickupDistrict,
              districtB: dropDistrict,
              loadRequestAtoB: 1,
              loadRequestBtoA: 0,
              trucksCountAtoB: 0,
              trucksCountBtoA: 0,
              transportersCount: 0,
              createdBy: userId
            }
          })
          console.log("userId", userId)
          const newLoad = await prismaTX.loads.create({
            data: {
              ...loadData,
              postedBy: userId,
              laneId: newLane.id,
              laneDirection: existingLane && existingLane.districtB == pickupDistrict
                ? LaneDirection.B_to_A : LaneDirection.A_to_B
            }
          });
          return newLoad;
        })

        return createTxn;
      }
      else {
        const LaneData = existingLane.districtA == pickupDistrict ? {
          loadRequestAtoB: {
            increment: 1
          },
        } :
          {
            loadRequestBtoA: {
              increment: 1
            },
          }
        const udpateLaneCreateLoadTxn = await this.prisma.$transaction(async (prismaTX) => {
          const updatedLane = await prismaTX.transportLanes.update({
            where: {
              id: existingLane.id
            },
            data: {
              ...LaneData,
              updatedAt: new Date()
            }
          })
          const newTruck = await prismaTX.loads.create({
            data: {
              ...loadData,
              postedBy: userId,
              laneId: updatedLane.id,
              laneDirection: existingLane && existingLane.districtB == pickupDistrict
                ? LaneDirection.B_to_A : LaneDirection.A_to_B
            }
          });
          return newTruck;
        })

        return udpateLaneCreateLoadTxn;
      }
    } catch (error) {
      throw new Error(`Failed to add truck: ${error.message}`);
    }
  }

  async addBulkLoad(data: Array<JSON>, userId: string, fileName: string) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      try {
        // Step 1: Create bulkLogs entry
        const bulkLog = await tx.bulkLogs.create({
          data: {
            userId: userId,
            bulkType: 'LOAD',
            fileName: fileName,
            totalCount: data.length
          }
        });
        console.log(fileName)
        // Step 2: Update data with the bulkLogId
        const updatedData: any = data.map((entry) => ({
          ...entry,
          bulkLogId: bulkLog.id,
          postedBy: userId,
          loadLength: String(entry['loadLength']),
        }));

        // Step 3: Create entries in load table with bulkCreate
        await tx.loads.createMany({
          data: updatedData,
        });

        // If everything is successful, commit the transaction
        return {
          bulkLogId: bulkLog.id,
          message: "Bulk load added successfully",
        };
      } catch (error) {
        // If any error happens, Prisma will automatically rollback
        console.error("Error in transaction: ", error);
        throw error;
      }
    });

    return transaction;

  }

  async getLoad(loadId: string) {
    try {
      const loadData = await this.prisma.loads.findUnique({
        where: { id: loadId },
      });
      return loadData;
    } catch (error) {
      throw new Error(`Failed to fetch load: ${error.message}`);
    }
  }

  async updateLoad(loadId: string, loadData: any) {
    try {

      const currentload = await this.prisma.loads.findUnique({
        where: {
          id: loadId
        }
      })
      if (currentload.pickupPlaceId == loadData.pickupPlaceId && currentload.dropPlaceId == loadData.dropPlaceId) {
        const updatedload = await this.prisma.loads.update({
          where: { id: loadId },
          data: loadData
        });
        return updatedload;
      }
      else if (currentload.pickupPlaceId == loadData.dropPlaceId && currentload.dropPlaceId == loadData.pickupPlaceId) {
        const LaneData = currentload.laneDirection === LaneDirection.A_to_B ?
          {
            loadRequestAtoB: {
              decrement: 1
            },
            loadRequestBtoA: {
              increment: 1
            }
          } :
          {
            loadRequestAtoB: {
              decrement: 1
            },
            loadRequestBtoA: {
              increment: 1
            },
          }
        const updateTxn = await this.prisma.$transaction(async (prismaTX) => {

          await prismaTX.transportLanes.update({
            where: {
              id: currentload.laneId
            },
            data: {
              ...LaneData,
              updatedAt: new Date()
            }
          })
          const updatedload = await prismaTX.loads.update({
            where: { id: loadId },
            data: { ...loadData, laneDirection: currentload.laneDirection === LaneDirection.A_to_B ? LaneDirection.B_to_A : LaneDirection.A_to_B }
          });
          return updatedload;
        })

        return updateTxn;
      }
      else {
        const pickupDistrict = await this.getPlaceDistrictName(loadData.pickupPlaceId)
        const dropDistrict = await this.getPlaceDistrictName(loadData.dropPlaceId)

        if (pickupDistrict === dropDistrict)
          throw new Error(`Lane cannot have same pick and drop districts:${pickupDistrict}`)

        const updateTxn = await this.prisma.$transaction(async (prismaTX) => {
          const LaneData = currentload.laneDirection === LaneDirection.A_to_B ?
            {
              loadRequestAtoB: {
                decrement: 1
              }
            } :
            {
              loadRequestBtoA: {
                decrement: 1
              }
            }
          //decrement the load count of the existing lane
          await prismaTX.transportLanes.update({
            where: {
              id: currentload.laneId
            },
            data: {
              ...LaneData,
              updatedAt: new Date()
            }
          })
          //create new lane
          const newLane = await prismaTX.transportLanes.create({
            data: {
              districtA: pickupDistrict,
              districtB: dropDistrict,
              loadRequestAtoB: 1,
              loadRequestBtoA: 0,
              trucksCountAtoB: 0,
              trucksCountBtoA: 0,
              transportersCount: 0,
              createdBy: currentload.postedBy
            }
          })
          //update load with the new lane details
          const updatedload = await prismaTX.loads.update({
            where: { id: loadId },
            data: { ...loadData, laneId: newLane.id, laneDirection: LaneDirection.A_to_B }
          });

          return updatedload
        })
        return updateTxn
      }
      //If pickup and dropPoint are modified then modify the transportation lane info
    } catch (error) {
      throw new Error(`Failed to update load: ${error.message}`);
    }
  }

  async deleteLoad(loadId: string) {
    try {
      const deletedLoad = await this.prisma.loads.update({
        where: { id: loadId },
        data: { deletedAt: new Date() }
      });
      const LaneData = deletedLoad.laneDirection === LaneDirection.A_to_B ?
        {
          loadsCountAtoB: {
            decrement: 1
          }
        } :
        {
          loadsCountBtoA: {
            decrement: 1
          }
        }
      await this.prisma.transportLanes.update({
        where: {
          id: deletedLoad.laneId
        },
        data: {
          ...LaneData,
          updatedAt: new Date()
        }
      })
      return deletedLoad;
    } catch (error) {
      throw new Error(`Failed to delete load: ${error.message}`);
    }
  }

  async userAddedAllLoad(userId: string, query: { pageNo: number; pageSize: number }) {
    try {
      const { pageNo, pageSize } = query;
      const skip = (pageNo - 1) * pageSize;

      // Fetch user loads with pagination
      const userLoads = await this.prisma.loads.findMany({
        where: {
          postedBy: userId,
          deletedAt: null // Ensure we only get non-deleted records
        },
        skip: skip,
        take: Number(pageSize),
      });

      // Fetch the total count of records (for pagination metadata)
      const totalCount = await this.prisma.loads.count({
        where: {
          postedBy: userId,
          deletedAt: null // Only count non-deleted records
        },
      });

      // Return the data along with pagination metadata
      return {
        data: userLoads,
        meta: {
          totalCount,
          pageNo,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize), // Calculate total pages
        },
      };
    } catch (error) {
      throw new Error(`Failed to retrieve user loads: ${error.message}`);
    }
  }

  async getBulkLoad(bulkLogId: string, query: { pageNo: number; pageSize: number }, userId: string) {
    try {
      const { pageNo, pageSize } = query;
      const skip = (pageNo - 1) * pageSize;
      // Fetch the total count of records (for pagination metadata)
      const totalCount = await this.prisma.loads.count({
        where: {
          postedBy: userId,
          bulkLogId: bulkLogId,
          deletedAt: null // Only count non-deleted records
        },

      });

      const bulkLoad = await this.prisma.loads.findMany({
        where: { bulkLogId: bulkLogId, postedBy: userId, deletedAt: null },
        skip: skip,
        take: Number(pageSize)
      });
      return {
        data: bulkLoad,
        meta: {
          totalCount,
          pageNo,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize), // Calculate total pages
        },
      };
    } catch (error) {
      throw new Error(`Failed to retrieve bulk load: ${error.message}`);
    }
  }

  async getLoadConfig(toneage: number, unit: any) { // Use `string` type
    try {
      const loadConfig = await this.prisma.registry.findMany({
        where: {
          tonnage: { gte: toneage }, // Only Toneage greater than or equal to the provided value
          unit: unit, // Match the unit
        },
        orderBy: {
          tonnage: 'asc', // Ascend by Toneage to get the smallest match
        },
        take: 2, // Fetch only the optimal match
      });
      return loadConfig;
    } catch (error) {
      throw new Error(`Failed to retrieve load config: ${error.message}`);
    }
  }

  async getAllBulklog(userId: string, query: { pageNo: number; pageSize: number }) {
    try {
      const { pageNo, pageSize } = query;
      const skip = (pageNo - 1) * pageSize;
      // Fetch the total count of records (for pagination metadata)
      const totalCount = await this.prisma.bulkLogs.count({
        where: {
          userId: userId,
          bulkType: 'LOAD'
        },
      });

      const bulkLogs = await this.prisma.bulkLogs.findMany({
        where: { userId: userId, bulkType: 'LOAD' },
        skip: skip,
        take: Number(pageSize)
      });
      return {
        data: bulkLogs,
        meta: {
          totalCount,
          pageNo,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize), // Calculate total pages
        },
      };
    } catch (error) {
      throw new Error(`Failed to retrieve bulk load: ${error.message}`);
    }
  }

  async getContact(loadId: string, session: ISession) {
    try {
      let userViewsInfo = await this.prisma.servicesView.findUnique({
        where: {
          userId: session.userId
        }
      })

      console.log("info", userViewsInfo)
      if (!userViewsInfo) {
        userViewsInfo = await this.prisma.servicesView.create({
          data: {
            userId: session.userId,
          }
        })
      }
      if (userViewsInfo.loadViews < 5) {

        const getContactTxn = await this.prisma.$transaction(async (prismaTX) => {
          const contact = await prismaTX.loads.findUnique({
            where: {
              id: loadId,
            },
            select: {
              user: {
                select: {
                  id: true,
                  phone: true,
                },
              },
            },
          })

          if (contact.user.id !== session.userId) {
            await prismaTX.servicesView.update({
              where: {
                userId: session.userId
              },
              data: {
                loadViews: {
                  increment: 1
                }
              }
            })
          }

          return {
            data: {
              contact: contact?.user?.phone
            },
            message: 'success'
          }
        })

        return getContactTxn
      }
      else
        throw new ForbiddenException("User views Exhausted")
    } catch (error) {
      throw new Error(`Failed to get contact: ${error.message}`);
    }
  }
}