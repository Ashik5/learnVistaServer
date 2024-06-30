import express from 'express';
const router = express.Router();
import Book from '../models/book.model.js';

router.get("/", (req, res) => {
    Book.find(
        {},
    ).then((books) => { res.json(books) }).catch((err) => { res.status(400).json("Error: " + err) });
});

export default router;