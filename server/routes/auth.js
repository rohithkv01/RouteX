const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/sendEmail');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, phone, passwordHash: password });
    // Fire-and-forget — don't block registration if email fails
    sendWelcomeEmail(user.email, user.name).catch(err => console.warn('Welcome email skipped:', err.message));
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/google/verify
// Receives the access_token from @react-oauth/google popup (useGoogleLogin).
// Calls Google's userinfo endpoint to verify & fetch profile, then issues a JWT.
router.post('/google/verify', async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ success: false, message: 'No access token provided' });
    }

    // Fetch user profile from Google
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );
    const profile = await googleRes.json();

    if (profile.error || !profile.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }

    const { id: googleId, email, name, picture } = profile;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Link Google account to existing email user
        user.googleId = googleId;
        if (!user.profilePic && picture) user.profilePic = picture;
        await user.save();
      } else {
        // Brand-new user via Google
        user = await User.create({
          name,
          email,
          googleId,
          profilePic: picture,
          isVerified: true,
        });
        sendWelcomeEmail(user.email, user.name).catch(err =>
          console.warn('Welcome email skipped:', err.message)
        );
      }
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error('Google verify error:', err.message);
    res.status(500).json({ success: false, message: 'Google sign-in failed. Please try again.' });
  }
});

module.exports = router;
