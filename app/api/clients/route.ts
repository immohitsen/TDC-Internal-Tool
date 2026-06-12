import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';

export async function GET() {
  try {
    await dbConnect();
    const clients = await Profile.find({});
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
