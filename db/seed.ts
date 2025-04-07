import { PrismaClient } from '@prisma/client';
import sampleData from "@/db/sample-data";

async function main() {
    const prisma = new PrismaClient();
    await prisma.product.deleteMany();
    await prisma.product.createMany({ data: sampleData.products })

    console.log("Database seeded with sample data");
};

main();