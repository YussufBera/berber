import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all services
export async function GET() {
    try {
        if (!prisma) return NextResponse.json([], { status: 500 });
        const services = await prisma.simpleService.findMany({ orderBy: { price: 'asc' } });

        // Map to frontend structure
        const formatted = services.map(s => ({
            id: s.id,
            name: { de: s.name_de, en: s.name_en, tr: s.name_tr },
            price: s.price,
            duration: s.duration
        }));

        return NextResponse.json(formatted);
    } catch (error) {
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
