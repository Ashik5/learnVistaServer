import express from "express"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";

import bookRoute from "./routes/bookRoute.js";
app.use(express.json());
app.use("",cors(
    {
        origin: "*",
        methods: ["POST", "GET"],
        credentials: true
    }
));

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000



app.listen(PORT, () => {
    connectToMongoDB();
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
})

app.get("/", (req, res) => {    
    res.send("Hello World");
}
);
app.use("/books", bookRoute);