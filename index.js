import express from "express"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";

import bookRoute from "./routes/bookRoute.js";

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
    Book.find(
        {},
    ).then((books) => { res.json(books) }).catch((err) => { res.status(400).json("Error: " + err) });
}
);
app.use("/books", bookRoute);