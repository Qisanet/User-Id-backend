import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        publishYear: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "user",
            required: true, // Ensure userId is required
        },
    },
    {
        timestamps: true,
    }
);

export const Book = mongoose.model("mybook", bookSchema);