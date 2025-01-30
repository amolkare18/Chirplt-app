const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model('USER');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {jwt_secret }= require('../keys.js');
const requireLogin = require('../middlewares/requireLogin.js');




router.post('/signup', (req, res) => {
    const { name, userName, email, password } = req.body;

    // Validate input fields
    if (!name || !userName || !email || !password) {
          
        return res.status(422).json({ error: "Please fill all the fields" });
    }

    // Check if user already exists
    USER.findOne({ $or: [{ email: email }, { userName: userName }] })
        .then(saveduser => {
            if (saveduser) {
              
                return res.status(422).json({error: "User with this email or username already exists" });
            }

            // Hash the password and save the new user
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new USER({
                        name,
                        userName,
                        email,
                        password: hashedpassword,
                    });

                    user.save()
                        .then(user => {
                            
                            return res.json({ message: "User saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json({ error: "Error saving user" });
                        });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: "Error hashing password" });
                });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ errro: "Server error" });
        });
});

// router.get('/createPost', requireLogin, (req, res) => {
//     console.log('auth proceed');
// })

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }

    USER.findOne({ email: email })
        .then(saveduser => {
            if (!saveduser) {
                return res.status(401).json({ error: "Invalid email" });
            }

            bcrypt.compare(password, saveduser.password)
                .then(match => {
                    if (!match) {
                        return res.status(401).json({ error: "Invalid password" });
                    } 
                    
                    // Generate JWT token
                    const token = jwt.sign({ _id: saveduser._id }, jwt_secret, { expiresIn: '1h' });
                 
                    const { _id, name, email, userName } = saveduser;
                    console.log({ token, user: { _id, name, email, userName } });

                    return res.json({ token, user: { _id, name, email, userName } });

                    // Send token wrapped in an object

                    
                })
                .catch(err => {
                    console.error("Error comparing password:", err);
                    res.status(500).json({ error: "Internal server error" });
                });
        })
        .catch(err => {
            console.error("Error finding user:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

module.exports = router;