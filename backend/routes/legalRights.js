import express from 'express';
import LegalRight from '../models/LegalRight.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const rights = await LegalRight.find().sort({ updatedAt: -1 });
    res.json(rights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const right = await LegalRight.findById(req.params.id);
    if (!right) {
      return res.status(404).json({ message: 'Legal right not found' });
    }
    res.json(right);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', authenticate, authorize('admin', 'legal'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const right = new LegalRight({
      title,
      description,
      category,
      updatedBy: req.user.name || req.user.email,
    });
    await right.save();
    res.status(201).json(right);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', authenticate, authorize('admin', 'legal'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const right = await LegalRight.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        updatedAt: new Date(),
        updatedBy: req.user.name || req.user.email,
      },
      { new: true, runValidators: true }
    );

    if (!right) {
      return res.status(404).json({ message: 'Legal right not found' });
    }

    res.json(right);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/:id', authenticate, authorize('admin', 'legal'), async (req, res) => {
  try {
    const right = await LegalRight.findByIdAndDelete(req.params.id);
    if (!right) {
      return res.status(404).json({ message: 'Legal right not found' });
    }
    res.json({ message: 'Legal right deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

