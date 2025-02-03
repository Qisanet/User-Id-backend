import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";

import bookRouther from './routes/booksRoute.js'
import cors from 'cors'
import userRoot from './routes/UserRoot.js'
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  
    return response.status(234).send("welcome to MERN stack Tutorial ");
});
app.use('/books',bookRouther);
app.use('/user',userRoot)
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("app connected to data to database");
        app.listen(PORT, () => {
            console.log(`app is litening to port`);
        });
    })
    .catch((error) => {
        console.log(error);
    });