/**
 * DoctorController
 *
 * Responsibilities:
 * - Manage doctor accounts (creation, retrieval, updates)
 * - Enforce password security for doctor users
 *
 * Constraints:
 * - All doctors must have role = 'doctor'
 * - Passwords must always be stored in hashed form
 * - Sensitive operations must not expose plaintext credentials
 */

import User from '../models/User.js';
import bcrypt from 'bcrypt';

/**
 * Why:
 * Creates doctor accounts with enforced role assignment
 * and secure password hashing.
 */
const createDoctor = async (req, res) => {
  try {
    // CRITICAL:
    // Default password is applied only when none is provided.
    // Must always be hashed before persistence.
    const password = req.body.password || 'doctor@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // CRITICAL:
    // Role is force-set to prevent privilege escalation
    // via request payload manipulation.
    const doctor = new User({
      ...req.body,
      password: hashedPassword,
      role: 'doctor',
    });

    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Why:
 * Allows doctors to securely update their password
 * after validating their existing credentials.
 */
const changePassword = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    // CRITICAL:
    // Existing password verification prevents unauthorized
    // password changes if session is compromised.
    const isMatch = await bcrypt.compare(oldPassword, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // CRITICAL:
    // New password must always be hashed before saving.
    doctor.password = await bcrypt.hash(newPassword, 10);
    await doctor.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Why:
 * Provides a list of all registered doctors
 * for administrative and scheduling workflows.
 */
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Why:
 * Enables controlled updates to doctor profiles
 * while enforcing role and password security.
 */
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // CRITICAL:
    // Any password update must be re-hashed to
    // avoid storing plaintext credentials.
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // CRITICAL:
    // Role constraint ensures only doctor records
    // can be modified through this endpoint.
    const doctor = await User.findOneAndUpdate(
      { _id: id, role: 'doctor' },
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export {
  createDoctor,
  getDoctors,
  updateDoctor,
};
