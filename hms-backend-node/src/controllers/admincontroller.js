/**
 * AuthController – Login Module
 *
 * Responsibilities:
 * - Authenticate users based on role, email, and password
 * - Issue JWT tokens for authenticated sessions
 *
 * Constraints:
 * - Authentication must be role-aware
 * - Login must remain stateless and idempotent
 */

import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Why:
 * Ensures only valid users with correct role credentials
 * are issued authentication tokens.
 */
export const login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // CRITICAL:
    // Case-insensitive role + email matching prevents duplicate
    // accounts differing only by letter casing.
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      role: { $regex: new RegExp(`^${role}$`, 'i') },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid role or email' });
    }

    // CRITICAL:
    // Password comparison must use bcrypt to avoid plaintext
    // exposure and timing attacks.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // CRITICAL:
    // JWT payload intentionally minimal to reduce token exposure risk.
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
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

};
