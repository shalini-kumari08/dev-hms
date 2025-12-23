import User from '../models/User.js';
import bcrypt from 'bcrypt';

const createDoctor = async (req, res) => {
  try {
    const password = req.body.password || "doctor@123"; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      ...req.body,           
      password: hashedPassword,
      role: 'doctor'
    });

    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id); 
    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, doctor.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    doctor.password = await bcrypt.hash(newPassword, 10);
    await doctor.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

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

/*const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await User.findOneAndDelete({ _id: id, role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};*/

export {
  createDoctor,
  getDoctors,
  updateDoctor,
  //deleteDoctor
};