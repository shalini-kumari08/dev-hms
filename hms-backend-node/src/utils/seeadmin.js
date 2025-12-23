import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

async function seed() {
  await connectDB();

  const exists = await User.findOne({ username: 'admin' });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin123', 10);

  await User.create({
    username: 'admin',
    password: hashed,
    role: 'admin',
  });

  console.log('Admin created: username=admin, password=admin123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
