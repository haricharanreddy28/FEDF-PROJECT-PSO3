import mongoose from 'mongoose';

const victimAssignmentSchema = new mongoose.Schema({
    victimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedProfessionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    professionalType: {
        type: String,
        enum: ['counsellor', 'legal'],
        required: true,
    },
    aiAnalysis: {
        type: String,
        default: '',
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
    isFirstLogin: {
        type: Boolean,
        default: true,
    },
    transferredFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    transferReason: {
        type: String,
        default: '',
    },
    transferredAt: {
        type: Date,
        default: null,
    },
});

// Index for faster lookups
victimAssignmentSchema.index({ victimId: 1, professionalType: 1 });

export default mongoose.model('VictimAssignment', victimAssignmentSchema);
