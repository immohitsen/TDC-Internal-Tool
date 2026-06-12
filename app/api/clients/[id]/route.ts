import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { status } = await request.json();
    
    // We expect the id param from the URL path
    const updatedClient = await Profile.findOneAndUpdate(
      { id: params.id }, 
      { status }, 
      { new: true }
    );
    
    if (!updatedClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Failed to update client:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
