const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../keys.js');
const mongoose = require('mongoose');
const User = mongoose.model('USER');




module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // console.log('Authorization Header:', authorization);

    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });

    }

    // Extract the token directly from the Bearer token format
    const token = authorization.replace("Bearer ", "");
    // console.log("Processed Token:", token);

    if (!token || token === "undefined") {
        return res.status(401).json({ error: "Invalid token provided" });
    }
const decodedToken = jwt.decode(token);
    // console.log("Decoded Token (without verification):", decodedToken);
    // console.log("secret " + jwt_secret);
    
    jwt.verify(token, jwt_secret, async (err, payload) => {
        console.log("JWT Payload:", payload);
        if (err) {
            console.error("JWT Verification Error:", err);

            if (err.name === 'TokenExpiredError') {
                
                 return res.status(401).json({ error: "Token expired, please log in again" });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: "Invalid token signature or format" });
            } else {
                return res.status(401).json({ error: "Invalid or expired token" });
            }
        }

        // console.log("Token verified successfully:", payload);

        try {
            const { _id } = payload;
            const userdata = await User.findById(_id);
            if (!userdata) {
                return res.status(404).json({ error: "User not found" });
            }
            req.user = userdata;
            next();
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
};
