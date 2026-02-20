import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch availability (off days)
export async function GET(request: Request) {
    try {
        if (!prisma) {
            return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const barber = searchParams.get('barber');
        const date = searchParams.get('date');

        let whereClause: any = {};
        if (barber) whereClause.barber = barber;
        if (date) whereClause.date = date;

        const availability = await prisma.barberAvailability.findMany({
            where: whereClause
        });

        return NextResponse.json(availability);
    } catch (error) {
        console.error('Failed to fetch availability:', error);
        // Fallback to empty array if DB fails so UI doesn't crash
        return NextResponse.json([]);
    }
}

// POST: Toggle availability (Set Day Off or Delete (Working))
export async function POST(request: Request) {
    try {
        if (!prisma) {
            return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500 });
        }

        const body = await request.json();
        const { barber, date, isOff, closedHours } = body;

        if (!barber || !date) {
            return NextResponse.json({ error: 'Missing barber or date' }, { status: 400 });
        }

        // If not full day off, and no closed hours, delete the record completely
        if (!isOff && (!closedHours || closedHours === "[]")) {
            try {
                await prisma.barberAvailability.delete({
                    where: {
                        barber_date: {
                            barber,
                            date
                        }
                    }
                });
                return NextResponse.json({ success: true, deleted: true });
            } catch (e) {
                return NextResponse.json({ success: true, deleted: false });
            }
        }

        // Otherwise, Set as Day Off OR Set blocked hours
        const record = await prisma.barberAvailability.upsert({
            where: {
                barber_date: {
                    barber,
                    date
                }
            },
            update: {
                isOff: isOff ?? false,
                closedHours: closedHours || "[]"
            },
            create: {
                barber,
                date,
                isOff: isOff ?? false,
                closedHours: closedHours || "[]"
            }
        });
        return NextResponse.json(record);
    } catch (error) {
        console.error('Failed to update availability:', error);
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }
}
