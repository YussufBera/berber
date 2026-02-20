import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !phone || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const application = await prisma.jobApplication.create({
            data: {
                name,
                email,
                phone,
                message,
                status: "pending",
            },
        });

        return NextResponse.json({ success: true, application });
    } catch (error) {
        console.error("Error creating job application:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
