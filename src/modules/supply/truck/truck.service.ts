import { ForbiddenException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Prisma, TransportLanes, LaneDirection, Trucks } from "@prisma/client";
import { PrismaService } from "src/core/modules/prisma/prisma.service";
import { UNIT } from "src/core/types/enums.types";
import { GooglePlacesService } from "src/modules/googlePlaces/googleplaces.service";
import { CreateTransporterDto } from "./dto/create.transporter.dto";
import { ISession } from "src/core/types/session.types";

@Injectable()

export class TruckService {
  private readonly TruckServiceLogger = new Logger('TruckServiceLogger')
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
  async addSingleTruck(truckData: any, userId: string) {
    try {
      const pickupDistrict = await this.getPlaceDistrictName(truckData.pickupPlaceId)
      const dropDistrict = await this.getPlaceDistrictName(truckData.dropPlaceId)

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
              loadRequestAtoB: 0,
              loadRequestBtoA: 0,
              trucksCountAtoB: 1,
              trucksCountBtoA: 0,
              transportersCount: 0,
              createdBy: userId
            }
          })
          console.log("userId", userId)
          const newTruck = await prismaTX.trucks.create({
            data: {
              ...truckData,
              postedBy: userId,
              laneId: newLane.id,
              laneDirection: existingLane && existingLane.districtB == pickupDistrict
                ? LaneDirection.B_to_A : LaneDirection.A_to_B
            }
          });
          return newTruck;
        })

        return createTxn;
      }
      else {
        const LaneData = existingLane.districtA == pickupDistrict ? {
          trucksCountAtoB: {
            increment: 1
          },
        } :
          {
            trucksCountBtoA: {
              increment: 1
            },
          }
        const udpateLaneCreateTruckTxn = await this.prisma.$transaction(async (prismaTX) => {
          const updatedLane = await prismaTX.transportLanes.update({
            where: {
              id: existingLane.id
            },
            data: {
              ...LaneData,
              updatedAt: new Date()
            }
          })
          const newTruck = await prismaTX.trucks.create({
            data: {
              ...truckData,
              postedBy: userId,
              laneId: updatedLane.id,
              laneDirection: existingLane && existingLane.districtB == pickupDistrict
                ? LaneDirection.B_to_A : LaneDirection.A_to_B
            }
          });
          return newTruck;
        })

        return udpateLaneCreateTruckTxn;
      }
    } catch (error) {
      throw new Error(`Failed to add truck: ${error.message}`);
    }
  }

  async updateTruck(truckId: string, truckData: any) {
    try {

      const currentTruck = await this.prisma.trucks.findUnique({
        where: {
          id: truckId
        }
      })
      if (currentTruck.pickupPlaceId == truckData.pickupPlaceId && currentTruck.dropPlaceId == truckData.dropPlaceId) {
        const updatedTruck = await this.prisma.trucks.update({
          where: { id: truckId },
          data: truckData
        });
        return updatedTruck;
      }
      else if (currentTruck.pickupPlaceId == truckData.dropPlaceId && currentTruck.dropPlaceId == truckData.pickupPlaceId) {
        const LaneData = currentTruck.laneDirection === LaneDirection.A_to_B ?
          {
            trucksCountAtoB: {
              decrement: 1
            },
            trucksCountBtoA: {
              increment: 1
            }
          } :
          {
            trucksCountBtoA: {
              decrement: 1
            },
            trucksCountAtoB: {
              increment: 1
            },
          }
        const updateTxn = await this.prisma.$transaction(async (prismaTX) => {

          await prismaTX.transportLanes.update({
            where: {
              id: currentTruck.laneId
            },
            data: {
              ...LaneData,
              updatedAt: new Date()
            }
          })
          const updatedTruck = await prismaTX.trucks.update({
            where: { id: truckId },
            data: { ...truckData, laneDirection: currentTruck.laneDirection === LaneDirection.A_to_B ? LaneDirection.B_to_A : LaneDirection.A_to_B }
          });
          return updatedTruck;
        })

        return updateTxn;
      }
      else {
        const pickupDistrict = await this.getPlaceDistrictName(truckData.pickupPlaceId)
        const dropDistrict = await this.getPlaceDistrictName(truckData.dropPlaceId)

        if (pickupDistrict === dropDistrict)
          throw new Error(`Lane cannot have same pick and drop districts:${pickupDistrict}`)

        const updateTxn = await this.prisma.$transaction(async (prismaTX) => {
          const LaneData = currentTruck.laneDirection === LaneDirection.A_to_B ?
            {
              trucksCountAtoB: {
                decrement: 1
              }
            } :
            {
              trucksCountBtoA: {
                decrement: 1
              }
            }
          //decrement the truck count of the existing lane
          await prismaTX.transportLanes.update({
            where: {
              id: currentTruck.laneId
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
              loadRequestAtoB: 0,
              loadRequestBtoA: 0,
              trucksCountAtoB: 1,
              trucksCountBtoA: 0,
              transportersCount: 0,
              createdBy: currentTruck.postedBy
            }
          })
          //update truck with the new lane details
          const updatedTruck = await prismaTX.trucks.update({
            where: { id: truckId },
            data: { ...truckData, laneId: newLane.id, laneDirection: LaneDirection.A_to_B }
          });

          return updatedTruck
        })
        return updateTxn
      }
      //If pickup and dropPoint are modified then modify the transportation lane info
    } catch (error) {
      throw new Error(`Failed to update truck: ${error.message}`);
    }
  }

  async deleteTruck(loadId: string) {
    try {
      const deletedTruck = await this.prisma.trucks.update({
        where: { id: loadId },
        data: { deletedAt: new Date() }
      });
      const LaneData = deletedTruck.laneDirection === LaneDirection.A_to_B ?
        {
          trucksCountAtoB: {
            decrement: 1
          }
        } :
        {
          trucksCountBtoA: {
            decrement: 1
          }
        }

      if (!deletedTruck.bulkLogId)
        await this.prisma.transportLanes.update({
          where: {
            id: deletedTruck.laneId
          },
          data: {
            ...LaneData,
            updatedAt: new Date()
          }
        })
      return deletedTruck;
    } catch (error) {
      this.TruckServiceLogger.debug(`Error: ${error.message}`)
      throw new Error(`Failed to delete truck.`);
    }
  }

  async getTruck(truckId: string) {
    try {
      const truckData = await this.prisma.trucks.findUnique({
        where: { id: truckId },
      });
      return truckData;
    } catch (error) {
      throw new Error(`Failed to fetch load: ${error.message}`);
    }
  }

  async userAddedAllTruck(userId: string, query: { pageNo: number; pageSize: number }) {
    try {
      const { pageNo, pageSize } = query;
      const skip = (pageNo - 1) * pageSize;

      const userTruck = await this.prisma.trucks.findMany({
        where: {
          postedBy: userId,
          deletedAt: null
        },
        include: { 'user': true },
        skip: skip,
        take: Number(pageSize),
      });

      // Fetch the total count of records (for pagination metadata)
      const totalCount = await this.prisma.trucks.count({
        where: {
          postedBy: userId,
          deletedAt: null, // Only count non-deleted records 
        },
      });

      // Return the data along with pagination metadata
      return {
        data: userTruck,
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

  async addBulkTruck(userId: string, fileName: string, data: Array<JSON>) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      try {
        // Step 1: Create bulkLogs entry
        const bulkLog = await tx.bulkLogs.create({
          data: {
            userId: userId,
            bulkType: 'TRUCK',
            totalCount: data.length,
            fileName: fileName
          }
        });

        // Step 2: Update data with the bulkLogId
        const updatedData: any = data.map((entry) => ({
          ...entry,
          bulkLogId: bulkLog.id,
          postedBy: userId
        }));
        // Step 3: Create entries in load table with bulkCreate
        await tx.trucks.createMany({
          data: updatedData,
        });

        // If everything is successful, commit the transaction
        return {
          bulkLogId: bulkLog.id,
          message: "Bulk trucks added successfully",
        };
      } catch (error) {
        // If any error happens, Prisma will automatically rollback
        console.error("Error in transaction: ", error);
        throw error;
      }
    })

    return transaction;
  }

  async getAllBulkTruckLogs(userId: string, query: { pageNo: number; pageSize: number }) {
    console.log(query)
    try {
      const { pageNo, pageSize } = query;
      const skip = (pageNo - 1) * pageSize;
      const totalCount = await this.prisma.bulkLogs.count({
        where: {
          userId: userId,
          bulkType: 'TRUCK'
        },
      });

      const bulkLogs = await this.prisma.bulkLogs.findMany({
        where: { userId: userId, bulkType: 'TRUCK' },
        skip: skip,
        take: Number(pageSize)
      });
      return {
        data: bulkLogs,
        meta: {
          totalCount,
          pageNo,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      };
    } catch (error) {
      throw new Error(`Failed to retrieve bulk load: ${error.message}`);
    }
  }

  async getContact(truckId: string, session: ISession) {
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
      if (userViewsInfo.truckViews < 5) {

        const getContactTxn = await this.prisma.$transaction(async (prismaTX) => {
          const contact = await prismaTX.trucks.findUnique({
            where: {
              id: truckId,
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
                truckViews: {
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
      if (error instanceof ForbiddenException)
        throw new HttpException("User views exhausted", HttpStatus.FORBIDDEN)
      else
        throw new Error(`Failed to get contact: ${error.message}`);
    }
  }

  async getTransporter(truckId: string) {
    try {
      const transporterData = await this.prisma.supplyTransporter.findUnique({
        where: { id: truckId },
      });
      return transporterData;
    } catch (error) {
      throw new Error(`Failed to fetch load: ${error.message}`);
    }
  }

  async getTransporterContact(transporterId: string, session: ISession) {
    try {
      const userViewsInfo = await this.prisma.servicesView.findUnique({
        where: {
          userId: session.userId
        }
      })

      if (userViewsInfo.directoryViews < 5) {

        const getContactTxn = await this.prisma.$transaction(async (prismaTX) => {
          const contact = await prismaTX.supplyTransporter.findUnique({
            where: {
              id: transporterId,
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

          if (contact.user.id !== session.userId)
            await prismaTX.supplyTransporter.update({
              where: {
                id: transporterId
              },
              data: {
                viewedBy: {
                  increment: 1
                }
              }
            })

          if (contact.user.id !== session.userId) {
            await prismaTX.servicesView.update({
              where: {
                userId: session.userId
              },
              data: {
                directoryViews: {
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
        return getContactTxn;
      }
      else
        throw new ForbiddenException("User views exhausted.")
    } catch (error) {
      if (error instanceof ForbiddenException)
        throw new HttpException("User views exhausted", HttpStatus.FORBIDDEN)
      else
        throw new Error(`Failed to get contact: ${error.message}`);
    }
  }

  async getAllTransporters(search: string | '', pageNo: any, pageSize: any) {
    const skip = (pageNo - 1) * pageSize;
    console.log("inside all directory")
    try {
      const directory = await this.prisma.supplyTransporter.findMany({
        where: {
          companyName: {
            not: ''
          }
        },
        take: Number(pageSize),
        skip: skip
      });
      const allLaneIds = [...new Set(directory.flatMap(transporter => transporter.operatingLanes))];
      const lanes = await this.prisma.transportLanes.findMany({
        where: {
          id: { in: allLaneIds as string[] },
        },
        select: {
          id: true,
          districtA: true,
          districtB: true,
        },
      });
      const laneMap = Object.fromEntries(lanes.map(lane => [lane.id, lane]));

      // Attach lane details to each truck
      const transportersWithLanes = directory.map(transporter => ({
        ...transporter,
        lanes: (transporter.operatingLanes as string[]).map(laneId => laneMap[laneId]).filter(Boolean),
      }));
      // console.log("re", directory)
      return { data: transportersWithLanes, message: "Directory Fetched Successfully" };
    } catch (error) {
      throw new Error(`Failed to fetch directory: ${error.message}`);
    }
  }

  async addTransporter(transporterData: CreateTransporterDto, userId: string) {
    try {
      console.log(transporterData);

      const homebaseDistrict = await this.getPlaceDistrictName(transporterData.homeBase.placeId);

      // Ensure `operatingLanes` completes before proceeding
      const operatingLanes = await Promise.all(
        transporterData.operatingCities.map(async (cityObj) => {
          const thisCityDistrict = await this.getPlaceDistrictName(cityObj.placeId);
          return [homebaseDistrict, thisCityDistrict];
        })
      );

      const operatingLaneIds: string[] = [];

      const createTxn = await this.prisma.$transaction(async (prismaTX) => {
        for (const lane of operatingLanes) {
          const existingLane = await prismaTX.transportLanes.findFirst({
            where: {
              OR: [
                { AND: [{ districtA: lane[0] }, { districtB: lane[1] }] },
                { AND: [{ districtA: lane[1] }, { districtB: lane[0] }] },
              ],
            },
          });

          if (!existingLane) {
            const newLane = await prismaTX.transportLanes.create({
              data: {
                districtA: lane[0],
                districtB: lane[1],
                loadRequestAtoB: 0,
                loadRequestBtoA: 0,
                trucksCountAtoB: 0,
                trucksCountBtoA: 0,
                transportersCount: 1,
                createdBy: userId,
              },
            });
            operatingLaneIds.push(newLane.id);
          } else {
            const updatedLane = await prismaTX.transportLanes.update({
              where: { id: existingLane.id },
              data: { transportersCount: { increment: 1 } },
            });
            operatingLaneIds.push(updatedLane.id);
          }
        }

        const newTransporter = await prismaTX.supplyTransporter.create({
          data: {
            companyName: transporterData.companyName,
            homeBase: transporterData.homeBase.name,
            operatingLanes: operatingLaneIds,
            userId: userId,
            viewedBy: 0,
          },
        });

        return newTransporter;
      });

      return createTxn;
    } catch (error) {
      throw new Error(`Failed to add transporter: ${error.message}`);
    }
  }


  async updateTransporter(transporterId: string, data: any) {
    try {
      const updatedTransporter = await this.prisma.supplyTransporter.update({
        where: { id: transporterId },
        data: data
      });
      return updatedTransporter;
    } catch (error) {
      throw new Error(`Failed to update transporter: ${error.message}`);
    }
  }

  async deleteTransporter(transporterId: string) {
    try {
      const deletedTransporter = await this.prisma.supplyTransporter.update({
        where: { id: transporterId },
        data: { deletedAt: new Date() }
      });
      return deletedTransporter;
    } catch (error) {
      throw new Error(`Failed to delete transporter: ${error.message}`);
    }
  }

  async getDistinctLoads(unit: Prisma.EnumUNITFilter<"Registry">) {
    try {
      const distinctLoads = await this.prisma.registry.findMany({
        distinct: ['tonnage'],
        select: {
          tonnage: true
        },
        where: {
          unit: unit
        }
      })
      const arrayResult = distinctLoads.map((item) => Number(item.tonnage)).sort((a, b) => a - b)

      return {
        data: arrayResult,
        message: 'success'
      }
    } catch (error) {
      throw new Error(`Failed to fetch load values: ${error.message}`)
    }
  }

}