import jwt from "jsonwebtoken";
import User from "../models/User";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log(decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or Expired Token!" });
  }
};

export default authenticateToken;
