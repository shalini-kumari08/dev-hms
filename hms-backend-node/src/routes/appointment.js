/**
 * Appointment Routes
 *
 * Issues Identified:
 *
 * 1️⃣ Over-permissive access
 * - Both 'admin' and 'doctor' can access ALL appointment routes.
 * - Doctors should ideally only access appointments assigned to them.
 *
 * 2️⃣ Missing role-based filtering
 * - getAppointments does not differentiate between admin and doctor.
 * - Doctors can view all appointments (potential data leakage).
 *
 * 3️⃣ No request validation
 * - Incoming appointment data is not validated at route level.
 * - Invalid date/time or ObjectId may cause runtime errors.
 *
 * 4️⃣ Missing delete route
 * - deleteAppointment route is commented out.
 * - Leads to incomplete CRUD implementation.
 *
 * 5️⃣ No pagination or filtering
 * - getAppointments may return large datasets.
 * - Performance risk for production usage.
 *
 * 6️⃣ No rate limiting
 * - Appointment creation is not rate-limited.
 * - Could be abused by malicious clients.
 */

import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import * as appointmentController from '../controllers/aptcontrol.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('admin', 'doctor'), // ⚠️ Doctor access should be scoped to self
  appointmentController.createAppointment
);

router.get(
  '/',
  protect,
  authorize('admin', 'doctor'), // ⚠️ No role-based filtering applied
  appointmentController.getAppointments
);

router.get(
  '/:id',
  protect,
  authorize('admin', 'doctor'), // ⚠️ No ownership check
  appointmentController.getAppointmentById
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'doctor'), // ⚠️ Doctors can update any appointment
  appointmentController.updateAppointment
);

/*
 ❌ DELETE route disabled
 ❌ Prevents full appointment lifecycle management
 ❌ Should be enabled with proper authorization
*/
// router.delete(
//   '/:id',
//   protect,
//   authorize('admin', 'doctor'),
//   appointmentController.deleteAppointment
// );

export default router;

