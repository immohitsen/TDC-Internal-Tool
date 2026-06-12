// types/index.ts

// 1. The Matchmaking Pipeline Status
// Locking these as exact literal types ensures you never accidentally type "Pending" 
// somewhere in your code and break the dashboard filters.
export type MatchStatus = 
  | 'New' 
  | 'Profile Shared'
  | 'Active' 
  | 'Matched';

// 2. The Core Customer Profile
export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string; // ISO string, e.g., '1995-08-24'
  age: number;
  country: string;
  city: string;
  heightCm: number;
  email: string;
  phone: string;
  
  // Education & Career
  ugCollege: string;
  degree: string;
  specialization: string;
  annualIncomeINR: number;
  company: string;
  designation: string;
  
  // Background & Lifestyle
  maritalStatus: 'Single' | 'Divorced' | 'Widowed';
  languagesKnown: string[];
  siblings: number;
  familyType: 'Nuclear' | 'Joint';
  caste: string;
  religion: string;
  gotra?: string; // Optional field (?) because not all religions/castes use it
  dietaryPreference: 'Veg' | 'Non-Veg' | 'Jain' | 'Eggetarian';
  smoking: 'No' | 'Occasionally' | 'Yes';
  drinking: 'No' | 'Occasionally' | 'Yes';
  
  // Compatibility Preferences
  wantKids: 'Yes' | 'No' | 'Maybe';
  openToRelocate: 'Yes' | 'No' | 'Maybe';
  openToPets: 'Yes' | 'No' | 'Maybe';
  
  // System Metadata
  status: MatchStatus;
  assignedMatchmaker: string; // The ID of the matchmaker managing this profile
  photos: string[]; // Array of image URLs (we'll use dummy avatars later)
  aboutMe: string;
}

// 3. The Matchmaker Account
export interface Matchmaker {
  id: string;
  name: string;
  email: string;
  password: string; // Only for MVP mock auth!
  assignedClients: string[]; // Array of Profile IDs this matchmaker is handling
}

// 4. The Match Interaction Record (The Join Table Concept)
// This interface tracks the relationship between two specific profiles.
export interface MatchInteraction {
  id: string;
  clientId: string; // Your primary customer
  matchId: string;  // The person you are matching them with
  status: MatchStatus; // Where this specific relationship is in the pipeline
  aiIntroEmail?: string; // Stores the Groq/OpenAI generated email once created
  matchScore: number; // The algorithm's compatibility score (0-100)
}