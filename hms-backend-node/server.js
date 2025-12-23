import 'dotenv/config';
import app from './src/app.js';
//import bodyParser from 'body-parser';
import connectDB from './src/config/db.js';

connectDB();

// app.use(cors());
// app.use(bodyParser.json());

import patientRoutes from './src/routes/patient.js';
import deptRoutes from './src/routes/dept.js';
import doctorRoutes from './src/routes/doctor.routes.js';
import appointmentRoutes from './src/routes/appointment.js';
import authRoutes from './src/routes/auth.routes.js';
import signupRoutes from './src/routes/signup.js';
import adminRoutes from './src/routes/adminroutes.js';

app.use('/api/patients', patientRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/users/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));