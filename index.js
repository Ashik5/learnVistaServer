import express from "express"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRouter from "./routes/auth.js";
import log from "./middlewares/logger.js";
import cookieParser from 'cookie-parser';

import bookRoute from "./routes/bookRoute.js";
const app = express();
app.use("",cors(
    {
        origin: "https://learnvista.vercel.app",
        credentials: true,
    }
));

dotenv.config();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());
app.use(log);

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
app.use("/users", userRoutes);
app.use("/auth", authRouter);
app.use("/books", bookRoute);