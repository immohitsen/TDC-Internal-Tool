import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  heightCm: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Education & Career
  ugCollege: { type: String, required: true },
  degree: { type: String, required: true },
  specialization: { type: String, required: true },
  annualIncomeINR: { type: Number, required: true },
  company: { type: String, required: true },
  designation: { type: String, required: true },
  
  // Background & Lifestyle
  maritalStatus: { type: String, enum: ['Single', 'Divorced', 'Widowed'], required: true },
  languagesKnown: { type: [String], required: true },
  siblings: { type: Number, required: true },
  familyType: { type: String, enum: ['Nuclear', 'Joint'], required: true },
  caste: { type: String, required: true },
  religion: { type: String, required: true },
  gotra: { type: String },
  dietaryPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Jain', 'Eggetarian'], required: true },
  smoking: { type: String, enum: ['No', 'Occasionally', 'Yes'], required: true },
  drinking: { type: String, enum: ['No', 'Occasionally', 'Yes'], required: true },
  
  // Compatibility Preferences
  wantKids: { type: String, enum: ['Yes', 'No', 'Maybe'], required: true },
  openToRelocate: { type: String, enum: ['Yes', 'No', 'Maybe'], required: true },
  openToPets: { type: String, enum: ['Yes', 'No', 'Maybe'], required: true },
  
  // System Metadata
  status: { type: String, required: true },
  assignedMatchmaker: { type: String, required: true },
  photos: { type: [String], required: true },
  aboutMe: { type: String, required: true },
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
