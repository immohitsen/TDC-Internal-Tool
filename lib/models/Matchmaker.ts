import mongoose from 'mongoose';

const MatchmakerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  assignedClients: { type: [String], default: [] },
});

export default mongoose.models.Matchmaker || mongoose.model('Matchmaker', MatchmakerSchema);
