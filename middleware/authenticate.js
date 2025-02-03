import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "your_secret_key");
        req.userId = decoded.userId; 
        next();
    } catch (error) {
        res.status(401).send({ message: "Unauthorized" });
    }
};

export default authenticate;