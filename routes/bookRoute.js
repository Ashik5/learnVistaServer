import express from 'express';
const router = express.Router();
import Book from '../models/book.model.js';

router.get("/", (req, res) => {
   res.send("working backend");
});

export default router;