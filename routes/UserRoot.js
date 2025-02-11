




import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../Models/usermodel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { PORT } from '../config.js';

dotenv.config()
const router = express.Router();


const generateToken = (userId) => {
    const payload={ id: userId }
    return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });
};

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or any other service
        auth: {
            user: process.env.EMAIL, // Add this to your .env
            pass: process.env.EMAIL_PASSWORD, // Add this to your .env
        },
        tls: {
            rejectUnauthorized: false, // This allows self-signed certificates
        }
    });

    const mailOptions = {
        from: '"Kisanet" <ksanetang@gmail.com>', 
        to: email,
        subject: 'Verify your email',
        text: 'Please verify your email address.',
        html: `<p>Click <a href="http://localhost:${PORT}/user/verify?token=${token}">here</a> to verify your email.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
};

router.post('/signup', async (req, res) => {
    const { username, password,email } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });

        const newUser = new User({
            username,
            password: hashedPassword,
           
            email,
            
            verificationToken
        });

        await newUser.save();
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User created successfully. Please verify your email.' });
    } catch (error) {
        console.error(error);
        console.log(error)
        res.status(500).json({ message:error.message});
    }
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ message: 'Please verify your email to login' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/verify', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ email: decoded.email, verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.isEmailVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});




export default router;