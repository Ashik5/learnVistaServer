import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRouter from "./routes/auth.js";
import cookieParser from 'cookie-parser';
import path from 'path';
import bookRoute from "./routes/bookRoute.js";

dotenv.config();

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);  // Specific domain
    res.header('Access-Control-Allow-Credentials', 'true');  // Credentials are allowed
    res.header('Access-Control-Allow-Methods', 'GET,POST');  // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Allowed headers
    next();
  });  

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send(`Client URL: ${process.env.CLIENT_URL}`);
});

app.use("/users", userRoutes);
app.use("/auth", authRouter);
app.use("/books", bookRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToMongoDB();
});
