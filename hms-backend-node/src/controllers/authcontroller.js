/**
 * AuthController – Login Module
 *
 * Responsibilities:
 * - Authenticate users using role-aware credentials
 * - Enforce account status rules for restricted roles
 * - Issue short-lived JWT tokens for authenticated sessions
 *
 * Constraints:
 * - Authentication must remain stateless and idempotent
 * - Role and email matching must be case-insensitive
 * - Inactive doctors must not be allowed to log in
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Why:
 * Central authentication entry point to ensure consistent
 * credential validation, role enforcement, and token issuance.
 */
export const login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // CRITICAL:
    // Case-insensitive role + email matching prevents duplicate
    // logical identities caused by casing differences.
    // Selected fields are intentionally minimal to reduce data exposure.
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      role: { $regex: new RegExp(`^${role}$`, 'i') },
    }).select('email role status password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid role or email' });
    }

    // CRITICAL:
    // bcrypt comparison is mandatory to prevent plaintext
    // password handling and mitigate timing attacks.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // CRITICAL:
    // Business rule: doctors must be explicitly activated
    // by an admin before being allowed to authenticate.
    if (user.role.toLowerCase() === 'doctor' && user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message:
          'Your account is currently inactive. Kindly reach out to the admin for support.',
      });
    }

    // CRITICAL:
    // JWT payload is intentionally minimal to limit
    // blast radius in case of token compromise.
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

    // CRITICAL:
    // Do not expose authentication or cryptographic
    // failure details to the client.
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
