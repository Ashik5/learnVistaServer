import express from 'express';
const router = express.Router();
import { getBook, addBook } from '../controllers/bookController.js';
import upload from '../middlewares/uploadImage.js';

router.get("/", getBook);

router.post("/", upload.single('image') , addBook);

export default router;