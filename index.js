import express from "express"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRouter from "./routes/auth.js";
import cookieParser from 'cookie-parser';
import path from 'path';

import bookRoute from "./routes/bookRoute.js";
const app = express();
app.use("",cors(
    {
        origin: "https://learnvista.vercel.app/",
        credentials: true,
    }
));

dotenv.config();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.listen(PORT, () => {
    connectToMongoDB();
    app.get("/", (req, res) => {
        res.send(process.env.CLIENT_URL);
    });
})

app.get("/", (req, res) => {    
    res.send(process.env.CLIENT_URL);
}
);
app.use("/users", userRoutes);
app.use("/auth", authRouter);
app.use("/books", bookRoute);