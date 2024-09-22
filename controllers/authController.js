import User from "../models/user.model.js";
import { comparePassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const accessTokenLifetime = "15m";  // Short-lived access token
const refreshTokenLifetime = "7d";  // Long-lived refresh token

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: accessTokenLifetime }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: refreshTokenLifetime }
  );
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select(["-__v"]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isSame = await comparePassword(password, user.password);
    if (!isSame) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set the tokens as httpOnly cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: true,  // use in production
      sameSite: "none",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,  // use in production
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return res.status(200).json({ message: "Logout successful" });
};
