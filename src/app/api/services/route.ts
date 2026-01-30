import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { MOCK_SHOPS } from '@/lib/mockData';

// GET: Fetch all services (with Seeding)
export async function GET() {
    try {
        if (!prisma) return NextResponse.json([], { status: 500 });

        let services = await prisma.simpleService.findMany({ orderBy: { price: 'asc' } });

        // Seed if empty
        if (services.length === 0) {
            const defaults = MOCK_SHOPS[0].services;
            await prisma.simpleService.createMany({
                data: defaults.map(s => ({
                    name_de: s.name.de,
                    name_en: s.name.en,
                    name_tr: s.name.tr,
                    price: s.price,
                    duration: s.duration
                }))
            });
            // Fetch again after seeding
            services = await prisma.simpleService.findMany({ orderBy: { price: 'asc' } });
        }

        // Map to frontend structure
        const formatted = services.map(s => ({
            id: s.id,
            name: { de: s.name_de, en: s.name_en, tr: s.name_tr },
            price: s.price,
            duration: s.duration
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Fetch Services Error:", error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

// POST: Add new service
export async function POST(request: Request) {
    try {
        if (!prisma) return NextResponse.json({ error: 'DB Error' }, { status: 500 });
        const body = await request.json();

        const service = await prisma.simpleService.create({
            data: {
                name_de: body.name.de,
                name_en: body.name.en,
                name_tr: body.name.tr,
                price: parseFloat(body.price),
                duration: parseInt(body.duration)
            }
        });

        // Return formatted
        return NextResponse.json({
            id: service.id,
            name: { de: service.name_de, en: service.name_en, tr: service.name_tr },
            price: service.price,
            duration: service.duration
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}

// PUT: Update service
export async function PUT(request: Request) {
    try {
        if (!prisma) return NextResponse.json({ error: 'DB Error' }, { status: 500 });
        const body = await request.json();

        if (!body.id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const service = await prisma.simpleService.update({
            where: { id: body.id },
            data: {
                price: parseFloat(body.price),
                duration: parseInt(body.duration)
            }
        });

        return NextResponse.json({ success: true, service });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

// DELETE: Remove service
export async function DELETE(request: Request) {
    try {
        if (!prisma) return NextResponse.json({ error: 'DB Error' }, { status: 500 });
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await prisma.simpleService.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
