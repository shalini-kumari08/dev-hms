/**
 * PatientController
 *
 * Responsibilities:
 * - Create, retrieve, and update patient records
 * - Maintain consistency and validity of patient data
 *
 * Constraints:
 * - Patient data must comply with schema validations
 * - Updates must not bypass data integrity rules
 */

import Patient from '../models/patient.js';

/**
 * Why:
 * Creates new patient records as the source of truth
 * for appointment and clinical workflows.
 */
const createPatient = async (req, res) => {
  try {
    // CRITICAL:
    // Patient creation relies on schema-level validation
    // to enforce required fields and data correctness.
    const patient = new Patient(req.body);
    await patient.save();

    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Why:
 * Provides a complete list of patients for authorized
 * clinical and administrative workflows.
 */
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Why:
 * Allows controlled updates to patient information
 * while preserving schema-level validation rules.
 */
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // CRITICAL:
    // runValidators ensures that partial updates
    // do not violate patient data constraints.
    const patient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export {
  createPatient,
  getPatients,
  updatePatient,
};

