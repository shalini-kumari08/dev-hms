/**
 * Appointment Model
 *
 * Responsibilities:
 * - Define the schema for patient appointment records
 * - Enforce referential integrity across patient, doctor, and department
 * - Capture scheduling and status information for clinical workflows
 *
 * Constraints:
 * - Appointments must reference valid patient, doctor, and department entities
 * - Status values must follow a controlled lifecycle
 * - Date and time fields must be explicitly provided
 */

import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,

    // CRITICAL:
    // Patient reference must always point to a valid Patient document.
  },
  dept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,

    // CRITICAL:
    // Department reference ensures appointments are scoped correctly
    // within organizational units.
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,

    // CRITICAL:
    // Doctor reference must map to a User with role = 'doctor'.
    // Role enforcement is handled at controller/service level.
  },
  status: {
    type: String,
    required: true,

    // CRITICAL:
    // Status enum enforces a controlled appointment lifecycle.
    enum: ['Scheduled', 'Completed', 'Cancelled'],
  },
  date: {
    type: Date,
    required: true,

    // CRITICAL:
    // Appointment date is required for scheduling
    // and downstream reporting.
  },
  time: {
    type: String,
    required: true,

    // CRITICAL:
    // Time is stored separately to allow flexible
    // display and scheduling logic.
  },
  rsv: {
    type: String,
    required: true,

    // CRITICAL:
    // Reservation identifier is mandatory to support
    // tracking and reconciliation workflows.
  },
  notes: {
    type: String,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;

