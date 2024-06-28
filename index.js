import express from "express"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js";
import Book from './models/book.model.js';
import cors from "cors";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.listen(PORT, () => {
    connectToMongoDB();
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
})
app.use(cors(
    {
        origin: ["deployed-vercel-frontend-app","localhost:3000"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

app.get("/", (req, res) => {
  res.json("Hello");
})