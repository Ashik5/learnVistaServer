import mongoose from "mongoose";
const BookSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
        unique: true,
    },

})

const Book = mongoose.model("Book", BookSchema);
export default Book;
