import express from 'express';
import CaseNote from '../models/CaseNote.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all case notes (filtered by role)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};

    // Counsellors see only their notes
    if (req.user.role === 'counsellor') {
      query.counsellorId = req.user.id;
    }

    // Victims see only their notes
    if (req.user.role === 'victim') {
      query.survivorId = req.user.id;
    }

    // Admins see all
    const notes = await CaseNote.find(query)
      .populate('survivorId', 'name email')
      .populate('counsellorId', 'name email')
      .sort({ date: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get case note by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const note = await CaseNote.findById(req.params.id)
      .populate('survivorId', 'name email')
      .populate('counsellorId', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Case note not found' });
    }

    // Check access
    if (
      req.user.role !== 'admin' &&
      note.survivorId._id.toString() !== req.user.id &&
      note.counsellorId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create case note (Counsellor only)
router.post('/', authenticate, authorize('counsellor', 'admin'), async (req, res) => {
  try {
    const { survivorId, notes, riskLevel } = req.body;

    const note = new CaseNote({
      survivorId,
      counsellorId: req.user.id,
      notes,
      riskLevel,
    });

    await note.save();
    await note.populate('survivorId', 'name email');
    await note.populate('counsellorId', 'name email');

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update case note (Counsellor/Admin)
router.put('/:id', authenticate, authorize('counsellor', 'admin'), async (req, res) => {
  try {
    const note = await CaseNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Case note not found' });
    }

    // Check if counsellor owns this note or is admin
    if (req.user.role !== 'admin' && note.counsellorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { notes, riskLevel } = req.body;
    note.notes = notes || note.notes;
    note.riskLevel = riskLevel || note.riskLevel;

    await note.save();
    await note.populate('survivorId', 'name email');
    await note.populate('counsellorId', 'name email');

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete case note (Counsellor/Admin)
router.delete('/:id', authenticate, authorize('counsellor', 'admin'), async (req, res) => {
  try {
    const note = await CaseNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Case note not found' });
    }

    // Check if counsellor owns this note or is admin
    if (req.user.role !== 'admin' && note.counsellorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await CaseNote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Case note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

