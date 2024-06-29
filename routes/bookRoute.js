import express from 'express';
const router = express.Router();
import Book from '../models/book.model.js';

router.get("/", async(req, res) => {
    await Book.find(
        {},
    ).then((books) => { res.json(books) }).catch((err) => { res.status(400).json("Error: " + err) });
});
router.post("/", async(req, res) => {
    const book = new Book(req.body);
    try {
        await book.save();
        res.json("Book added successfully");
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

export default router;