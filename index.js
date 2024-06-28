import express from "express"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js";
import Book from './models/book.model.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.listen(() => {
    connectToMongoDB();
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
})