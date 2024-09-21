import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRouter from "./routes/auth.js";
import cookieParser from 'cookie-parser';
import bookRoute from "./routes/bookRoute.js";
import path from 'path';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send(`Client URL: ${process.env.CLIENT_URL}`);
});
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use("/users", userRoutes);
app.use("/auth", authRouter);
app.use("/books", bookRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToMongoDB();
});
