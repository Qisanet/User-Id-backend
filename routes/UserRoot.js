import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/usermodel.js';

const router = express.Router();

router.post('/signup', async (request, response) => {
    try {
        const { username, email, password } = request.body;

      
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return response.status(400).json({ message: 'User or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return response.status(201).json(newUser);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});

router.post('/login', async (request, response) => {
    try {
        const { username, password } = request.body;

        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return response.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { userId: user._id, isLogged: true },
            'your_secret_key', 
            { expiresIn: '1h' }
        );

       
        return response.status(200).json({ token, username: user.username });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message }); 
    }
});

export default router;