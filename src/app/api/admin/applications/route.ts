import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const applications = await prisma.jobApplication.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching job applications:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
