import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/  
  },
  password: { type: String, required: true },

  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'doctor'] 
  },


  name: { type: String },
  phno: { 
    type: String,
    match: /^[0-9]{10}$/  
  },
  spec: { type: String },
  dept: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  exp: { type: String },
  qual: { type: String },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;