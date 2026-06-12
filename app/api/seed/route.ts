import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';
import Matchmaker from '@/lib/models/Matchmaker';
import clientsData from '@/data/clients.json';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    // Clear existing profiles and matchmakers
    await Profile.deleteMany({});
    await Matchmaker.deleteMany({});

    // Insert new profiles
    await Profile.insertMany(clientsData);
    console.log("Seeded profile data successfully")

    // Create a default matchmaker
    const hashedPassword = await bcrypt.hash('password123', 10);
    await Matchmaker.create({
      email: 'admin@thedatecrew.com',
      password: hashedPassword,
      name: 'TDC Matchmaker',
      assignedClients: clientsData.map(c => c.id) // Assign all mock clients to the admin
    });
    console.log("Seeded matchmaker data successfully")

    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      profilesCount: clientsData.length,
      matchmaker: 'admin@thedatecrew.com (pw: password123)'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
