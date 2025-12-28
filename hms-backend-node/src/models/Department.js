/**
 * Department Model
 *
 * Responsibilities:
 * - Define the schema for department entities
 * - Enforce structural and validation rules for department data
 *
 * Constraints:
 * - Department names must be present
 * - Descriptions must meet minimum length requirements
 * - Schema must prevent persistence of invalid department records
 */

import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  dept: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    trim: true,
  },
});

/**
 * Why:
 * Provides a centralized and consistently ordered
 * list of departments for dependent modules.
 */
departmentSchema.statics.getAllDepartments = function () {
  // CRITICAL:
  // Alphabetical ordering ensures predictable results
  // for UI rendering and downstream processing.
  return this.find().sort({ dept: 1 });
};

const Department = mongoose.model('Department', departmentSchema);
export default Department;
