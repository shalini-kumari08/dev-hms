import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      role: { $regex: new RegExp(`^${role}$`, 'i') },
    }).select('email role status password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid role or email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    if (user.role.toLowerCase() === 'doctor' && user.status !== 'Active') {
      return res.status(403).json({ success: false, message: "Your account is currently inactive. Kindly reach out to the admin for support." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      role: user.role,
      token,
      user: {
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};