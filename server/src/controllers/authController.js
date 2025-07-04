import bcrypt from "bcryptjs";
import generateToken from "../lib/generateToken.js";
import hashPass from "../lib/hashPass.js";
import User from "../models/User.js";

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password: await hashPass(password),
    });
    // Save user to database and console log the user
    const newRegisteredUser = await newUser.save();
    if (newRegisteredUser) {
      console.log("New user registered:", newRegisteredUser);
      return res.status(201).json({
        _id: newRegisteredUser._id,
        username: newRegisteredUser.username,
        email: newRegisteredUser.email,
        token: generateToken(newRegisteredUser._id),
      });
    } else {
      return res.status(500).json({ message: "User registration failed" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // find user by email
    const user = await User.findOne({ email });
    console.log(user);

    // check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { loginUser, registerUser };
