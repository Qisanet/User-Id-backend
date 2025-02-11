import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import bookRouter from "./routes/booksRoute.js";
import userRouter from "./routes/UserRoot.js";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 4444;
const mongoDBURL = process.env.MONGO_URL; // Changed to match the .env variable

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to MERN stack Tutorial" });
});

app.use("/books", bookRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error", error: err.message });
});

// mongoose connection
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Database connection error:", err));
  
