import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';


async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists:', existingAdmin.email);
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10); 

    const adminUser = new User({
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      name: 'Super Admin',
      phno: '9999999999',
      status: 'Active'
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.email);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
}

seedAdmin();
