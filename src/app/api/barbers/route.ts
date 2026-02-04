
import { NextResponse } from 'next/server';
import { MOCK_BARBERS } from '@/lib/mockData';

// Simulating database with in-memory storage for this session
let barbers = [...MOCK_BARBERS];

export async function GET() {
    return NextResponse.json(barbers);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const newBarber = {
            id: Math.random().toString(36).substr(2, 9),
            ...body
        };

        barbers.push(newBarber);

        return NextResponse.json(newBarber);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create barber' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        barbers = barbers.filter(b => b.id !== id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete barber' }, { status: 500 });
    }
}
