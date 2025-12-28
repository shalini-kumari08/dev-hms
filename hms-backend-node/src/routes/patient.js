/**
 * Patient Routes
 *
 * Issues / Risks Identified:
 *
 * 1️⃣ Access Control
 * - Both admin and doctor can create, update, and view patients
 * - Ensure doctors cannot modify patients they shouldn't access (ownership not enforced)
 *
 * 2️⃣ Delete route disabled
 * - Commented out deletePatient route prevents full CRUD
 * - Deletion could impact appointments; consider cascade or soft delete
 *
 * 3️⃣ No input validation at route level
 * - Patient data is validated in controller
 * - Consider middleware validation for consistent early rejection
 *
 * 4️⃣ No pagination or filtering
 * - GET / returns all patients
 * - Could impact performance if dataset grows large
 *
 * 5️⃣ No logging / audit
 * - Admin/doctor actions (create/update) are not logged
 * - Useful for audit and tracking data changes
 */

import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import * as patientController from '../controllers/patient.js';

const router = express.Router();

// Get all patients (admin + doctor)
router.get('/', protect, authorize('admin', 'doctor'), patientController.getPatients);

// Create patient (admin + doctor)
router.post('/patient', protect, authorize('admin', 'doctor'), patientController.createPatient);

// Update patient (admin + doctor)
router.put('/:id', protect, authorize('admin', 'doctor'), patientController.updatePatient);

/*
// ⚠️ Delete route is currently disabled
router.delete('/:id', protect, authorize('admin'), patientController.deletePatient);
*/

export default router;

