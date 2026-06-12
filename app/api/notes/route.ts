import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/lib/models/Note';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }

    await dbConnect();
    const note = await Note.findOne({ clientId });
    
    return NextResponse.json({ content: note ? note.content : '' });
  } catch (error) {
    console.error('Failed to fetch note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { clientId, content } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Upsert the note
    const note = await Note.findOneAndUpdate(
      { clientId },
      { content, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    return NextResponse.json(note);
  } catch (error) {
    console.error('Failed to save note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
