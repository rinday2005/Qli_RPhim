import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//--------------------------Đăng kí-----------------------------------//

// Register user (bình thường)
const register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({ fullName, email, password, phone });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//--------------------------đăng nhập-----------------------------------//

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//--------------------------Kiểm tra quyền-----------------------------------//

// Test superadmin route
const superAdminTest = (req, res) => {
  res.json({ message: "Hello Superadmin ✅" });
};

// Test user route
const userTest = (req, res) => {
  res.json({ message: `Hello ${req.user.role}` });
};

module.exports = { register, login, superAdminTest, userTest };
