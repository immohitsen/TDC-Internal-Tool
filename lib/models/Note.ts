import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
