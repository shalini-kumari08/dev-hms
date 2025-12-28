/**
 * Department Routes
 *
 * Issues / Risks Identified:
 *
 * 1️⃣ Access Control
 * - Only admin can create/update/delete departments (good)
 * - Doctors can view all departments (GET /) – acceptable, but ensure sensitive info is not exposed
 *
 * 2️⃣ No request validation
 * - Incoming data (dept name, description) is validated in controller
 * - Consider adding schema-level or middleware validation to prevent malformed requests
 *
 * 3️⃣ No pagination or filtering
 * - GET / may return large datasets if many departments exist
 * - Performance risk for production
 *
 * 4️⃣ No error handling for orphaned references
 * - Deleting a department may affect appointments or users referencing it
 * - Consider cascade handling or reject deletion if dependencies exist
 *
 * 5️⃣ Route-level logging missing
 * - For audit purposes, consider logging admin actions (create/update/delete)
 */

import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import * as departmentController from '../controllers/department.js';

const router = express.Router();

// Create department (admin only)
router.post('/', protect, authorize('admin'), departmentController.createDepartment);

// Update department (admin only)
router.put('/:id', protect, authorize('admin'), departmentController.updateDepartment);

// Delete department (admin only)
router.delete('/:id', protect, authorize('admin'), departmentController.deleteDepartment);

// Get all departments (admin + doctor)
router.get('/', protect, authorize('admin', 'doctor'), departmentController.getDepartments);

export default router;
