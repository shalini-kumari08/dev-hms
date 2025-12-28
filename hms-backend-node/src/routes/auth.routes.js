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
 * - Email format, password strength, and role are not validated
 * - May cause invalid records or security issues
 *
 * 3️⃣ No duplicate email check
 * - Multiple users can register with same email
 * - May break unique constraints or cause authentication conflicts
 *
 * 4️⃣ Logging sensitive data
 * - `console.log('Received body:', req.body)` may expose passwords
 * - Should remove before production
 *
 * 5️⃣ Password handling
 * - Password is hashed correctly, but no rules enforce strength or complexity
 *
 * 6️⃣ Health route is unprotected
 * - OK for monitoring, but be careful exposing environment info in prod
 *
 * 7️⃣ Login delegation
 * - Login correctly delegates to controller
 * - Ensure controller enforces role-based constraints and account status
 */

import express from 'express';
import * as authController from '../controllers/authcontroller.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'hms-backend-node',
    time: new Date().toISOString()
  });
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    // ⚠️ Debug logging exposes sensitive info, remove before prod
    console.log('Received body:', req.body);

    const { email, password, role } = req.body;

    // CRITICAL:
    // No input validation or duplicate email check
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

export default router;
