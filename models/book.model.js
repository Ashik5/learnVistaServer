import mongoose from "mongoose";
const BookSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    genere: {
        type: String,
    },
})

const Book = mongoose.model("Book", BookSchema);
export default Book;
