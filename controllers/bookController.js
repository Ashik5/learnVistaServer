import Book from "../models/book.model.js";
export const getBook = (req, res) => {
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
}

export const addBook = (req, res) => {
    try {
        const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
        const book = new Book({
            Name: req.body.Name,
            authorName: req.body.authorName,
            price: req.body.price,
            imageUrl: image,
            genere: req.body.genere,
        });
        book.save().then(() => { res.status(201).json("Book added") });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const getBookById = (req, res) => {
    const { id } = req.params;  // Extract the book ID from the URL parameters
  
    Book.findById(id)
      .then((book) => {
        if (!book) {
          return res.status(404).json({ error: "Book not found" });
        }
        res.json(book);
      })
      .catch((err) => {
        res.status(400).json({ error: "Error: " + err.message });
      });
  };