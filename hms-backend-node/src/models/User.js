/**
 * User Model
 *
 * Responsibilities:
 * - Define the schema for all system users
 * - Enforce identity, role, and account-status constraints
 *
 * Constraints:
 * - Email must be unique and valid
 * - Passwords must always be stored in hashed form
 * - Role must be explicitly defined and restricted
 * - Account status controls access to protected workflows
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,

      // CRITICAL:
      // Email format validation ensures a consistent
      // and reliable user identifier.
      match: /.+\@.+\..+/,
    },

    // CRITICAL:
    // Password field must never store plaintext values.
    // Hashing is enforced at controller/service level.
    password: { type: String, required: true },

    role: {
      type: String,
      required: true,

      // CRITICAL:
      // Role enumeration prevents privilege escalation
      // through invalid or unexpected role values.
      enum: ['admin', 'doctor'],
    },

    name: { type: String },

    phno: {
      type: String,

      // CRITICAL:
      // Enforces standardized phone number format
      // to avoid ambiguous or malformed contact data.
      match: /^[0-9]{10}$/,
    },

    spec: { type: String },

    dept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',

      // CRITICAL:
      // Department reference must point to a valid
      // Department document when assigned.
    },

    exp: { type: String },
    qual: { type: String },

    status: {
      type: String,

      // CRITICAL:
      // Account status is used to gate authentication
      // and access to protected system features.
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    // CRITICAL:
    // Timestamps provide auditability for account lifecycle events.
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
