import express from 'express';
const router = express.Router();
import { getBook, addBook, getBookById } from '../controllers/bookController.js'; // Import the new function
import upload from '../middlewares/uploadImage.js';

router.get("/", getBook);

router.post("/", upload.single('image'), addBook);
router.get("/:id", getBookById); 

export default router;
