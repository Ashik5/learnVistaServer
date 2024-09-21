import { hashPassword } from "../utils/helpers.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Book from "../models/book.model.js";

// Helper functions for generating tokens
const accessTokenLifetime = "15m";
const refreshTokenLifetime = "7d";

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

// Endpoint to refresh the access token using a valid refresh token
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is missing" });
  }

  try {
    // Verify the refresh token
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(user);
    res.cookie("accessToken", newAccessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({ message: "Access token refreshed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Invalid refresh token", err });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select(["-password", "-__v"]);
    return res.status(200).json(allUsers);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getProfile = async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userInfo = await User.findById(user.id);
    return res.status(200).json(userInfo);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const createUser = async (req, res) => {
  const { username, displayName, password } = req.body;

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    username,
    displayName,
    password: hashedPassword,
  });

  try {
    const otherUser = await User.findOne({ username }).select(["username"]);

    if (otherUser) {
      return res.status(400).json({ error: "Username already in use" });
    }
    const savedUser = await newUser.save();
    return res.status(201).json({ message: "New user added successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const updatedUser = async (req, res) => {
  const { displayName, username, password } = req.body;
  const { id } = req.params;

  const hashedPassword = await hashPassword(password);

  try {
    const anotherUser = await User.findOne({ username }).select("_id").lean();

    if (anotherUser && anotherUser._id.toString() !== id) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { username, displayName, password: hashedPassword },
      {
        new: true,
      }
    ).select("-__v");

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.deleteOne({ _id: id });
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();
    return res.status(200).json({ message: "All users deleted" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const addBook = async (req, res) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ error: "Token is missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.books.includes(bookId)) {
      return res.status(400).json({ error: "Book bought" });
    }

    user.books.push(bookId);
    await user.save();

    return res.status(200).json({ message: "Book added to user's cart successfully", books: user.books });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Route to add a book to the user's cart
export const addToCart =  async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({ error: "Token is missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { bookId } = req.body;
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Add book to cart if it's not already in there
    if (!user.cart.includes(bookId)) {
      user.cart.push(bookId);
      await user.save();
      return res.status(200).json({ message: 'Book added to cart', cart: user.cart });
    } else {
      return res.status(400).json({ message: 'Book already in cart' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
