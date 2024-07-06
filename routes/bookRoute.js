import express from 'express';
const router = express.Router();
import Book from '../models/book.model.js';

router.get("/", (req, res) => {
    const Name = req.query.name;
    if (Name && Name !== "") {
        const rex = new RegExp(Name.toString(), 'i');
        Book.find(
            {
                $or: [
                    { "Name": rex },
                    { "authorName": rex }
                ]
            }).then((books) => {
                res.json(books)
            }).catch((err) => {
                res.status(400).json("Error: " + err)
            });
        return;
    }
    else {
        Book.find(
            {},
        ).then((books) => { res.json(books) }).catch((err) => { res.status(400).json("Error: " + err) });
    }
});

router.post("/", (req, res) => {
    const book = new Book({
        Name: req.body.Name,
        authorName: req.body.authorName,
        price: req.body.price,
    });
    book.save().then(() => { res.json("Book added") }).catch((err) => { res.status(400).json("Error: " + err) });
});

export default router;