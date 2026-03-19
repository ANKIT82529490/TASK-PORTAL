const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/*
  Generate JWT token for authenticated user
*/
function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

/*
  Register New User
*/
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Basic validations
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: passwordHash,
    });

    const token = signToken(newUser);

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

/*
  Login Existing User
*/
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email & password required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

/*
  Get Logged-in User Details
*/
async function me(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("_id name email createdAt");

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

module.exports = {
  register,
  login,
  me,
};