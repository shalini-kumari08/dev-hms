/**
 * DepartmentController
 *
 * Responsibilities:
 * - Create, retrieve, update, and delete department records
 * - Enforce department uniqueness and description quality
 *
 * Constraints:
 * - Department names must be unique
 * - Descriptions must meet minimum length requirements
 * - Data must remain consistent across create/update flows
 */

import Department from '../models/Department.js';

/**
 * Why:
 * Ensures only well-defined and non-duplicate departments
 * are created in the system.
 */
export const createDepartment = async (req, res) => {
  try {
    const { dept, description } = req.body;

    // CRITICAL:
    // Department name validation prevents empty or
    // whitespace-only records from being persisted.
    if (!dept?.trim()) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    // CRITICAL:
    // Minimum description length enforces clarity and
    // prevents low-quality or ambiguous departments.
    if (!description?.trim() || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description is required and must be at least 10 characters long'
      });
    }

    // CRITICAL:
    // Uniqueness check prevents duplicate department creation.
    // DO NOT rely solely on client-side validation.
    const exists = await Department.findOne({ dept: dept.trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Department already exists' });
    }

    const department = await Department.create({
      dept: dept.trim(),
      description: description.trim()
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message
    });
  }
};

/**
 * Why:
 * Provides a centralized and consistent department list
 * for dependent modules (appointments, users, reporting).
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.getAllDepartments();
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

/**
 * Why:
 * Allows controlled modification of department metadata
 * while preserving validation and data integrity.
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dept, description } = req.body;

    // CRITICAL:
    // Prevents clearing department name during partial updates.
    if (dept && !dept.trim()) {
      return res.status(400).json({ success: false, message: 'Department name cannot be empty' });
    }

    // CRITICAL:
    // Maintains minimum description quality during updates.
    if (description && description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters long'
      });
    }

    // CRITICAL:
    // runValidators ensures schema-level constraints
    // remain enforced during update operations.
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      {
        ...(dept && { dept: dept.trim() }),
        ...(description && { description: description.trim() })
      },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update department',
      error: error.message
    });
  }
};

/**
 * Why:
 * Enables safe removal of departments that are no longer needed.
 *
 * Constraints:
 * - Caller must ensure no active dependencies exist
 *   (e.g., appointments, users) before deletion.
 */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // CRITICAL:
    // Deleting a department may affect dependent records.
    // This operation assumes dependency checks are handled upstream.
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete department',
      error: error.message
    });
  }
};
