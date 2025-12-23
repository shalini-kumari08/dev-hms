import Department from '../models/Department.js';

export const createDepartment = async (req, res) => {
  try {
    const { dept, description } = req.body;

    if (!dept?.trim()) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    if (!description?.trim() || description.trim().length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Description is required and must be at least 10 characters long' 
      });
    }

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
    res.status(500).json({ success: false, message: 'Failed to create department', error: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.getAllDepartments();
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch departments', error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dept, description } = req.body;

    if (dept && !dept.trim()) {
      return res.status(400).json({ success: false, message: 'Department name cannot be empty' });
    }

    if (description && description.trim().length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Description must be at least 10 characters long' 
      });
    }

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
    res.status(500).json({ success: false, message: 'Failed to update department', error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete department', error: error.message });
  }
};