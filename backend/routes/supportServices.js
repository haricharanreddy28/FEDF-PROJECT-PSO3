import express from 'express';
import SupportService from '../models/SupportService.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const services = await SupportService.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const service = await SupportService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Support service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = new SupportService(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = await SupportService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Support service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = await SupportService.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Support service not found' });
    }
    res.json({ message: 'Support service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

