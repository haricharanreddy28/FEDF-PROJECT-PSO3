import mongoose from 'mongoose';

const caseNoteSchema = new mongoose.Schema({
  survivorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('CaseNote', caseNoteSchema);

