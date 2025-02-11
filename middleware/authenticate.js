import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.id; 
        next();
    } catch (error) {
        res.status(401).send({ message: "Unauthorized" });
    }
};

export default authenticate;