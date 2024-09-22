import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  getAllUsers,
  getProfile,
  createUser,
  deleteUser,
  deleteAllUsers,
  updatedUser,
  addBook,
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/userController.js";

const router = express.Router();
router.get("/", checkToken, getAllUsers);
router.get("/profile", checkToken, getProfile);
router.post("/", createUser);
router.put("/:id", checkToken, updatedUser);
router.put("/:id/addbooks", checkToken, addBook);
router.post("/add_to_cart", checkToken, addToCart);
router.post("/remove_from_cart", checkToken, removeFromCart);
router.get("/cart", checkToken, getCart);
router.delete("/:id", checkToken, deleteUser);
router.delete("/", checkToken, deleteAllUsers);

export default router;