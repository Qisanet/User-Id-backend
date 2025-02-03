import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String, // Corrected "types" to "type"
            required: true,
            unique: true,
        },
        email: {
            type: String, // Corrected "types" to "type"
            required: true,
            unique: true,
        },
        password: {
            type: String, // Corrected "types" to "type"
            required: true,
        },
    },
    {
        timestamps: true, // Corrected typo from "tru" to "true"
    }
);

export const User = mongoose.model('user', UserSchema);