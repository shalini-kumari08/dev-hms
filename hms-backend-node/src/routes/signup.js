/**
 * Auth Routes
 *
 * Issues / Risks Identified:
 *
 * 1️⃣ Signup route allows arbitrary role assignment
 * - Anyone can create an 'admin' or 'doctor' account
 * - Security risk: privilege escalation
 *
 * 2️⃣ No input validation
 * - Email, password strength, and role are not validated
 * - May cause invalid records or security issues
 *
 * 3️⃣ No duplicate email check
 * - Multiple users can register with the same email
 * - May break unique constraints or cause authentication conflicts
 *
 * 4️⃣ Password handling
 * - Password hashing is correctly applied
 * - No rules enforce password complexity or strength
 *
 * 5️⃣ Login route delegates correctly
 * - Ensure controller enforces role-based constraints and account status
 */

import express from 'express';
import * as authController from '../controllers/authcontroller.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // CRITICAL:
    // Password hashing prevents storing plaintext passwords
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

export default router;
