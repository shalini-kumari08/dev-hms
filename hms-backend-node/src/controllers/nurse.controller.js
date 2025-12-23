import User from "../models/User";
import bcrypt from "bcrypt";

const createNurse= async (req, res) => {
    try {
        const password= req.body.password || 'nurse@123';
        const hashedPassword= await bcrypt.hash(password, 10);

        const nurse= new User({
            ...req.body,
            password: hashedPassword,
            role: 'nurse'
        });
        await nurse.save();
        res.status(201).json(nurse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export { createNurse };