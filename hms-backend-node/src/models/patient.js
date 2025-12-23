import mongoose from 'mongoose';

const Patientschema=new mongoose.Schema({
name:{ type:String,  required:true },
email:{ 
    type: String, 
    required:true, 
    match: /.+\@.+\..+/
    },
phno:{ 
    type: String, 
    required:true,
    match:/^[0-9]{10}$/
    },
age:{type:Number, required:true},
gender: {
    type:String, 
    enum:['male','female','other'],
    required:true},
status:{
    type:String,
    enum:['active','cancelled'],
    default:'active',
    required:true
},
bg:{
    type: String,
    enum:['A+','A-','B+','B-','AB+','AB-','O+','O-']
    },
address: {type:String},
emerno:{
    type:String,
    match:/^[0-9]{10}$/
    },
medical_history: {type:String}
},{ timestamps: true});

const Patient= mongoose.model('Patient', Patientschema);
export default Patient;