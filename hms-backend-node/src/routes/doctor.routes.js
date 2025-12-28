/**
 * Doctor Routes
 *
 * Issues / Risks Identified:
 *
 * 1️⃣ Access Control
 * - Admin can create/update/delete doctors (good)
 * - Doctors can view all doctors via GET / – ensure only non-sensitive info is returned
 *
 * 2️⃣ Missing change-password route
 * - Commented out route prevents doctors from updating their password
 * - Could block workflow; consider enabling with proper protection
 *
 * 3️⃣ Delete route disabled
 * - Commented out deleteDoctor route prevents full CRUD
 * - Ensure cascade effects or dependency checks if enabled
 *
 * 4️⃣ No request validation
 * - Incoming data (email, name, password, role, etc.) is validated in controller
 * - Consider middleware-level validation for consistency and early rejection
 *
 * 5️⃣ No logging or audit
 * - Admin actions like create/update/delete are not logged
 * - Could be useful for audit and compliance
 *
 * 6️⃣ Password handling
 * - Password hashing is handled in controller
 * - Ensure strong password policies are enforced
 */

import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import * as doctorController from '../controllers/doctor.controller.js';

const router = express.Router();

// Create doctor (admin only)
router.post('/', protect, authorize('admin'), doctorController.createDoctor);

// Get all doctors (admin + doctor)
router.get('/', protect, authorize('admin', 'doctor'), doctorController.getDoctors);

// Update doctor (admin only)
router.put('/:id', protect, authorize('admin'), doctorController.updateDoctor);

/*
// ⚠️ Change-password route for doctors is currently disabled
router.put('/change-password', protect, authorize('doctor'), doctorController.changePassword);

// ⚠️ Delete doctor route is currently disabled
router.delete('/:id', protect, authorize('admin'), doctorController.deleteDoctor);
*/

export default router;

