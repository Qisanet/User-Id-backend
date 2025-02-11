import express from "express";
import { Book } from "../models/bookModel.js";
import upload from "../middleware/multer.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Create a new book
router.post("/", authenticate, upload.single("image"), async (req, res) => {
    try {
        const { title, author, publishYear } = req.body;
        console.log("user",req.userId)
        if (!title || !author || !publishYear) {
            return res.status(400).send({
                message: "Please send all required fields: title, author, publishYear",
            });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;
        }

        const newBook = {
            title,
            author,
            publishYear,
            image: imageUrl,
            userId: req.userId, // Associate book with the logged-in user
        };

        console.log(newBook)
        const book = await Book.create(newBook);
        return res.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get books for the logged-in user
router.get("/", authenticate, async (req, res) => {
    try {
        const books = await Book.find({ userId: req.userId }); // Filter by userId
        return res.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get a specific book (ensure it belongs to the user)
router.get("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findOne({ _id: id, userId: req.userId }); // Check userId
        if (!book) {
            return res.status(404).send({ message: "Book not found or unauthorized" });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Update a book (ensure it belongs to the user)
router.put("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, publishYear } = req.body;

        if (!title || !author || !publishYear) {
            return res.status(400).send({
                message: "Please send all required fields: title, author, publishYear",
            });
        }

        const result = await Book.findOneAndUpdate(
            { _id: id, userId: req.userId }, // Check userId
            { title, author, publishYear },
            { new: true }
        );

        if (!result) {
            return res.status(404).send({ message: "Book not found or unauthorized" });
        }

        return res.status(200).send({ message: "Book updated successfully", result });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Delete a book (ensure it belongs to the user)
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Book.findOneAndDelete({ _id: id, userId: req.userId }); // Check userId
        if (!result) {
            return res.status(404).send({ message: "Book not found or unauthorized" });
        }

        res.status(200).send({ message: "Book successfully deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;