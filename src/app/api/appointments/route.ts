import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all appointments from Real DB
export async function GET(request: Request) {
    try {
        if (!prisma) {
            return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');

        let whereClause = {};
        if (phone) {
            // Basic cleaner similar to frontend regex just in case, but keep simple strict match for now
            // Or better, matching contains or exact. Let's do exact match first.
            whereClause = {
                phone: {
                    contains: phone // Allow partial match or exact? User said "enter phone". Exact is safer.
                    // But user types "+49..." usually. Let's stick to simple equals or contains if consistent.
                }
            }
            // Actually, prisma exact match is default.
            whereClause = { phone: phone };
        }

        const appointments = await prisma.simpleAppointment.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(appointments);
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

// POST: Create a new appointment in Real DB
export async function POST(request: Request) {
    try {
        if (!prisma) {
            return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.date || !body.time || !body.services) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const appointment = await prisma.simpleAppointment.create({
            data: {
                name: body.name,
                email: body.email || "",
                phone: body.phone || "",
                date: body.date,
                time: body.time,
                services: Array.isArray(body.services) ? body.services.join(", ") : body.services, // Ensure string storage
                total: parseFloat(body.total),
                status: 'pending',
                barber: body.barber || null // Save barber name if present
            }
        });

        return NextResponse.json(appointment);
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}

// PATCH: Update appointment status
export async function PATCH(request: Request) {
    try {
        if (!prisma) {
            return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500 });
        }

        const body = await request.json();
        if (!body.id || !body.status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const updated = await prisma.simpleAppointment.update({
            where: { id: body.id },
            data: { status: body.status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Failed to update appointment:', error);
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}

// DELETE: Delete an appointment (Reject/Remove)
export async function DELETE(request: Request) {
    try {
        if (!prisma) {
            return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const deleted = await prisma.simpleAppointment.delete({
            where: { id }
        });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error('Failed to delete appointment:', error);
        return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
    }
}
