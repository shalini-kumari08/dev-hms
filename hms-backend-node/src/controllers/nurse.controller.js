/**
 * NurseController
 *
 * Responsibilities:
 * - Create nurse user accounts
 * - Enforce role assignment and password security
 *
 * Constraints:
 * - All nurses must have role = 'nurse'
 * - Passwords must never be stored in plaintext
 * - Account creation must not allow role escalation
 */

import User from "../models/User";
import bcrypt from "bcrypt";

/**
 * Why:
 * Creates nurse accounts with enforced role assignment
 * and secure password hashing.
 */
const createNurse = async (req, res) => {
  try {
    // CRITICAL:
    // Default password is applied only when none is provided.
    // Must always be hashed before persistence.
    const password = req.body.password || 'nurse@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // CRITICAL:
    // Role is force-set to prevent privilege escalation
    // via request payload manipulation.
    const nurse = new User({
      ...req.body,
      password: hashedPassword,
      role: 'nurse',
    });

    await nurse.save();
    res.status(201).json(nurse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { createNurse };
