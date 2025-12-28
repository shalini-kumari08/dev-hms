/**
 * AppointmentController
 *
 * Responsibilities:
 * - Create, retrieve, and update appointment records
 * - Enforce referential integrity between patient, doctor, and department
 *
 * Constraints:
 * - Appointments must reference valid patient, doctor, and department entities
 * - Doctors must have role = 'doctor'
 * - Operations must not create orphaned or inconsistent records
 */

import Appointment from '../models/appointment.js';
import mongoose from 'mongoose';

/**
 * Why:
 * Ensures appointments are created only with valid,
 * existing patient, department, and doctor entities.
 */
const createAppointment = async (req, res) => {
  try {
    const { patient, dept, doctor } = req.body;

    // CRITICAL:
    // Parallel validation ensures referential integrity
    // before appointment creation.
    // DO NOT skip these checks — prevents orphaned records.
    const [patientDoc, deptDoc, doctorDoc] = await Promise.all([
      mongoose.model('Patient').findById(patient),
      mongoose.model('Department').findById(dept),
      mongoose.model('User').findOne({ _id: doctor, role: 'doctor' })
    ]);

    if (!patientDoc) return res.status(400).json({ message: 'Invalid patient ID' });
    if (!deptDoc) return res.status(400).json({ message: 'Invalid department ID' });
    if (!doctorDoc) return res.status(400).json({ message: 'Invalid doctor ID or user is not a doctor' });

    // CRITICAL:
    // Appointment creation must occur only after all
    // entity validations pass.
    const appointment = new Appointment(req.body);
    await appointment.save();

    res.status(201).json(appointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Why:
 * Restricts doctors to viewing only their own appointments
 * while allowing broader access for authorized roles.
 */
const getAppointments = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    let query = {};

    // CRITICAL:
    // Enforces role-based data visibility.
    // Doctors must not access other doctors' appointments.
    if (role === 'doctor') {
      query.doctor = userId;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name spec')
      .populate('dept', 'dept')
      .lean();

    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({
      message: 'Server error while fetching appointments',
      error: err.message
    });
  }
};

/**
 * Why:
 * Provides a detailed appointment view with related entities
 * for authorized access paths.
 */
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name spec')
      .populate('dept', 'dept')
      .lean();

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (err) {
    console.error('Error fetching appointment by ID:', err);
    res.status(500).json({
      message: 'Server error while fetching appointment',
      error: err.message
    });
  }
};

/**
 * Why:
 * Prevents updates that would introduce invalid or
 * inconsistent entity references.
 */
const updateAppointment = async (req, res) => {
  try {
    const { patient, dept, doctor } = req.body;

    if (patient || dept || doctor) {
      const checks = [];

      // CRITICAL:
      // Conditional validation ensures only modified references
      // are revalidated, preserving data integrity.
      if (patient) checks.push(mongoose.model('Patient').findById(patient));
      if (dept) checks.push(mongoose.model('Department').findById(dept));
      if (doctor) {
        checks.push(
          mongoose.model('User').findOne({ _id: doctor, role: 'doctor' })
        );
      }

      const [patientDoc, deptDoc, doctorDoc] = await Promise.all(checks);

      if (patient && !patientDoc) return res.status(400).json({ message: 'Invalid patient ID' });
      if (dept && !deptDoc) return res.status(400).json({ message: 'Invalid department ID' });
      if (doctor && !doctorDoc) {
        return res.status(400).json({ message: 'Invalid doctor ID or user is not a doctor' });
      }
    }

    // CRITICAL:
    // runValidators ensures schema-level constraints
    // remain enforced during updates.
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(updatedAppointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(400).json({ message: err.message });
  }
};

export {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
};
