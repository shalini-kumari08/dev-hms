import express from 'express';
import { protect, authorize } from '../middleware/authmiddleware.js';
import * as appointmentController from '../controllers/aptcontrol.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('admin', 'doctor'),
  appointmentController.createAppointment
);

router.get(
  '/',
  protect,
  authorize('admin', 'doctor'),
  appointmentController.getAppointments
);

router.get(
  '/:id',
  protect,
  authorize('admin', 'doctor'),
  appointmentController.getAppointmentById
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'doctor'),
  appointmentController.updateAppointment
);

/*router.delete(
  '/:id',
  protect,
  authorize('admin', 'doctor'),
  appointmentController.deleteAppointment
);*/

export default router;
