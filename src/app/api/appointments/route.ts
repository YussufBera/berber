import { NextResponse } from 'next/server';

// GET: Fetch all appointments (Mock implementation)
export async function GET() {
    return NextResponse.json([
        {
            id: '1',
            date: new Date().toISOString(),
            status: 'CONFIRMED',
            user: { name: 'Demo User' },
            service: { name: 'Haircut & Styling' },
            barber: { shopName: 'Neon Cuts' }
        },
        {
            id: '2',
            date: new Date(Date.now() + 86400000).toISOString(),
            status: 'PENDING',
            user: { name: 'Guest Client' },
            service: { name: 'Beard Trim' },
            barber: { shopName: 'Midnight Grooming' }
        }
    ]);
}

// POST: Create a new appointment (Mock)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        return NextResponse.json({
            id: Math.random().toString(36).substr(2, 9),
            ...body,
            status: 'PENDING'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}
