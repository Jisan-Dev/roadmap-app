import bcrypt from "bcryptjs";

const hashPass = async (password) => {
  try {
    // Generate a salt (the higher the salt rounds, the more secure it is but also slower)
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPass = await bcrypt.hash(password, salt);
    // Return the hashed password
    return hashedPass;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};

export default hashPass;
