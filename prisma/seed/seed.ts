import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
let configuration:any = [
    {
        tonnage: 0.5,
        tires: 4,
        axle: 'SXL',
        unit: 'TN',
        configuration: [{
            "Open": [],
            "Standard Container": [],
            "Tarpaulin": []
        }]
    },
    {
        tonnage: 0.7,
        tires: 4,
        axle: 'SXL',
        unit: 'TN',
        configuration: [{
            "Open": [],
            "Standard Container": [],
            "Tarpaulin": []
        }]
    },
    {
        tonnage: 1,
        tires: 6,
        axle: 'SXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [],
            "Standard Container": [],
            "Tarpaulin": []
        }]
    },
    {
        tonnage: 1.2,
        tires: 6,
        axle: 'SXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [],
            "Standard Container": [],
            "Tarpaulin": []
        }]
    },
    {
        tonnage: 1.5,
        tires: 6,
        axle: 'SXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [],
            "Standard Container": [],
            "Tarpaulin": []
        }]
    },
    {
        tonnage: 1,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [],
            "Standard Container": [],
            "Tarpaulin": []
        }]
    },
    {
        tonnage: 2.5,
        tires: 10,
        axle: 'MXL',
        unit: 'TN',
        configuration: [{
            "Open": [10, 12, 14],
            "Standard Container": [10, 12, 14],
            "Tarpaulin": [10, 12, 14]
        }]
    },
    {
        tonnage: 3,
        tires: 10,
        axle: 'MXL',
        unit: 'TN',
        configuration: [{
            "Open": [10, 12, 14],
            "Standard Container": [10, 12, 14],
            "Tarpaulin": [10, 12, 14]
        }]
    },
    {
        tonnage: 3.5,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [10, 12, 14],
            "Standard Container": [10, 12, 14],
            "Tarpaulin": [10, 12, 14]
        }]
    },
    {
        tonnage: 4,
        tires: 12,
        axle: 'MXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [14, 17, 19],
            "Standard Container": [14, 17, 19],
            "Tarpaulin": [14, 17, 19]
        }]
    },
    {
        tonnage: 4.5,
        tires: 12,
        axle: 'MXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [14, 17, 19],
            "Standard Container": [14, 17, 19],
            "Tarpaulin": [14, 17, 19]
        }]
    },
    {
        tonnage: 5,
        tires: 12,
        axle: 'MXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [14, 17, 19],
            "Standard Container": [14, 17, 19],
            "Tarpaulin": [14, 17, 19]
        }]
    },
    {
        tonnage: 5.5,
        tires: 14,
        axle: 'MXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [14, 17, 19, 18, 24],
            "Standard Container": [14, 19, 20, 24],
            "Tarpaulin": [14, 12],
            "HQ Container":[14,24]
        }]
    },
    {
        tonnage: 6,
        tires: 14,
        axle: 'MXL HQ',
        unit: 'TN',
        configuration: [{
            "Open": [14, 17, 19, 18, 24],
            "Standard Container": [14, 19, 20, 24],
            "Tarpaulin": [14, 12]
        }]
    },
    {
        tonnage: 6.5,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [14, 17, 19, 18, 24, 20],
            "Standard Container": [14, 17, 18, 19, 20, 24],
            "Tarpaulin": [14, 17, 18, 19, 20, 24]
        }]
    },
    {
        tonnage: 7,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [17, 18, 19, 20, 24, 32],
            "Standard Container": [17, 18, 19, 20, 24, 32],
            "Tarpaulin": [17, 18, 19, 20, 24],
            "HQ Container": [24, 32],
            "Trailer": [20, 28]
        }]
    },
    {
        tonnage: 8,
        tires: 20,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Standard Container": [20, 22, 24, 32],
            "HQ Container": [20, 22, 24, 32],
            "Open": [17, 18, 19, 20, 24],
            "Tarpaulin": [18, 19, 20, 24],
            "Trailer": [20, 28]
        }]
    },
    {
        tonnage: 7.5,
        tires: 20,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Standard Container": [20, 22, 24, 32],
            "HQ Container": [20, 22, 24, 32,19],
            "Open": [17, 18, 19, 20, 24],
            "Tarpaulin": [18, 19, 20, 24]
        }]
    },
    {
        tonnage: 9,
        tires: 20,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Standard Container": [19, 20, 22, 24, 32],
            "HQ Container": [32, 19, 20, 22, 24,9],
            "Open": [19, 20, 22, 24, 32],
            "Tarpaulin": [19, 20, 22, 24, 32],
            "Trailer": [20, 28]
        }]
    },
    {
        tonnage: 10,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [19, 20, 22, 24, 32],
            "Standard Container": [20, 22, 24, 32],
            "HQ Container": [20, 22, 24, 32],
            "Tarpaulin": [19, 24, 32]
        }]
    },
    {
        tonnage: 11,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [19, 20, 22, 24, 32],
            "Tarpaulin": [19, 24, 32]
        }]
    },
    {
        tonnage: 14,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 32],
            "Tarpaulin": [22, 24, 32],
            "Standard Container":[32],
            "HQ Container":[32]
        }]
    },
    {
        tonnage: 15,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Standard Container":[32],
            "HQ Container":[32]
        }]
    }
    ,
    {
        tonnage: 16,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 32],
            "Tarpaulin": [22, 24, 32],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 18,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 32],
            "Tarpaulin": [22, 24, 27, 32],
            "Tipper/Dumper": [],
            "Bulker": [],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 19,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 32],
            "Tarpaulin": [22, 24, 27, 32],
            "Tipper/Dumper": [],
            "Bulker": []
        }]
    },
    {
        tonnage: 17,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 32],
            "Tarpaulin": [22, 24, 32]
        }]
    },
    {
        tonnage: 20,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 27],
            "Tarpaulin": [22, 24, 27, 32],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 21,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 27],
            "Tarpaulin": [22, 24, 27, 32],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 22,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 27],
            "Tarpaulin": [22, 24, 27, 32],
            "Tipper/Dumper": [],
            "Bulker": []
        }]
    },
    {
        tonnage: 23,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 27],
            "Tarpaulin": [22, 24, 27, 32],
            "Tipper/Dumper": [],
            "Bulker": []
        }]
    },
    {
        tonnage: 24,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 27],
            "Tarpaulin": [22, 24, 27, 32],
            "Tipper/Dumper": [],
            "Bulker": [],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 25,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [22, 24, 27],
            "Tarpaulin": [22, 24, 27, 32],
            "Trailer": [32, 40, 50],
            "Tipper/Dumper": [],
            "Bulker": [],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 26,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [27, 29, 32],
            "Tarpaulin": [29, 32],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 27,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [27, 29, 32],
            "Tarpaulin": [29, 32],
            "Trailer": [32, 40, 50]
        }]
    },
    {
        tonnage: 28,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [27, 29, 32],
            "Tarpaulin": [29, 32]
        }]
    },
    {
        tonnage: 29,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [27, 29, 32],
            "Tarpaulin": [29, 32]
        }]
    },
    {
        tonnage: 30,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [27, 29, 32],
            "Tarpaulin": [29, 32],
            "Standard Container":[24,26,32],
            "HQ Container":[24,26,32]
        }]
    },
    {
        tonnage: 33,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Trailer": [32, 40, 50],
            "Tipper/Dumper": [],
            "Bulker": []
        }]
    },
    {
        tonnage: 32,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [40],
            "Tarpaulin": [40],
            "Tipper/Dumper": [],
            "Bulker": []
        }]
    },
    {
        tonnage: 34,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Trailer": [32, 40, 50],
            "Tipper/Dumper": [],
            "Bulker": []
        }]
    },
    {
        tonnage: 35,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [40],
            "Tarpaulin": [40],
            "Tipper/Dumper": [],
            "Bulker": []
        }]
    },
    {
        tonnage: 36,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Open": [40],
            "Tarpaulin": [40]
        }]
    },
    {
        tonnage: 40,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Trailer": [40, 50]
        }]
    },
    {
        tonnage: 40,
        tires: null,
        axle: null,
        unit: 'TN',
        configuration: [{
            "Trailer": [40, 50]
        }]
    },
    {
        tonnage: 10,
        tires: null,
        axle: null,
        unit: 'KL',
        configuration: [{
            "Tanker": []
        }]
    },
    {
        tonnage: 25,
        tires: null,
        axle: null,
        unit: 'KL',
        configuration: [{
            "Tanker": []
        }]
    },
    {
        tonnage: 35,
        tires: null,
        axle: null,
        unit: 'KL',
        configuration: [{
            "Tanker": []
        }]
    },

]
async function main() {
    const data = await prisma.registry.createMany({
        data: configuration,
        skipDuplicates:true
    })
    if(data){
        console.log('Data seeded successfully !!!!')
    }
}

main().then(async () => {
    await prisma.$disconnect();
    console.log("Database connected prisma seeded Done!!!")
}).catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
})