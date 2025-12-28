/**
 * Patient Model
 *
 * Responsibilities:
 * - Store demographic and contact information for patients
 * - Enforce validation for critical medical and identity fields
 * - Track patient lifecycle status for appointment workflows
 *
 * Constraints:
 * - Email and phone numbers must follow valid formats
 * - Gender and blood group values are strictly controlled
 * - Status reflects whether the patient record is active or cancelled
 */

import mongoose from 'mongoose';

const Patientschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

    // CRITICAL:
    // Patient name is mandatory for identification and record linking.
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,

    // CRITICAL:
    // Email format validation ensures reliable communication.
  },
  phno: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,

    // CRITICAL:
    // Phone number must be a valid 10-digit numeric string.
  },
  age: {
    type: Number,
    required: true,

    // CRITICAL:
    // Age is required for clinical and reporting purposes.
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,

    // CRITICAL:
    // Gender values are restricted to maintain data consistency.
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
    required: true,

    // CRITICAL:
    // Status controls whether the patient record is operational.
  },
  bg: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],

    // CRITICAL:
    // Blood group values are restricted to standard medical classifications.
  },
  address: {
    type: String,
  },
  emerno: {
    type: String,
    match: /^[0-9]{10}$/,

    // Emergency contact number validation.
  },
  medical_history: {
    type: String,

    // Optional field for storing patient medical background.
  },
}, { timestamps: true });

const Patient = mongoose.model('Patient', Patientschema);
export default Patient;
