import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Registration attempt:', { name, email, role }); // Debug log

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists'); // Debug log
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const user = new User({ name, email, password, role });
    await user.save();
    console.log('Registration successful for:', email); // Debug log

    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error); // Debug log
    res.status(500).json({ success: false, message: error.message });
  }
});


import svgCaptcha from 'svg-captcha';

// Generate CAPTCHA
router.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 2,
    color: true,
    background: '#f0f0f0'
  });

  // Sign the captcha text in a token to verify later (stateless)
  const captchaToken = jwt.sign(
    { text: captcha.text.toLowerCase() },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '5m' }
  );

  res.type('svg');
  res.status(200).json({
    svg: captcha.data,
    token: captchaToken
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, captchaAnswer, captchaToken } = req.body;

    // Verify CAPTCHA
    if (!captchaAnswer || !captchaToken) {
      return res.status(400).json({ success: false, message: 'CAPTCHA is required' });
    }

    try {
      const decoded = jwt.verify(captchaToken, process.env.JWT_SECRET || 'your-secret-key');
      if (decoded.text !== captchaAnswer.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'Incorrect CAPTCHA' });
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: 'CAPTCHA expired or invalid. Please refresh.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

