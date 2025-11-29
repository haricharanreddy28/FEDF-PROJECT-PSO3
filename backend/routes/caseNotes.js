import express from 'express';
import CaseNote from '../models/CaseNote.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();


router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};

    
    if (req.user.role === 'counsellor') {
      query.counsellorId = req.user.id;
    }

    
    if (req.user.role === 'victim') {
      query.survivorId = req.user.id;
    }

    
    const notes = await CaseNote.find(query)
      .populate('survivorId', 'name email')
      .populate('counsellorId', 'name email')
      .sort({ date: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', authenticate, async (req, res) => {
  try {
    const note = await CaseNote.findById(req.params.id)
      .populate('survivorId', 'name email')
      .populate('counsellorId', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Case note not found' });
    }

    
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


router.put('/:id', authenticate, authorize('counsellor', 'admin'), async (req, res) => {
  try {
    const note = await CaseNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Case note not found' });
    }

    
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


router.delete('/:id', authenticate, authorize('counsellor', 'admin'), async (req, res) => {
  try {
    const note = await CaseNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Case note not found' });
    }

    
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

