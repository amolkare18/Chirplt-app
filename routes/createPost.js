const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const POST = mongoose.model("POST");
const POST = require("../models/post.js"); 
const requireLogin = require('../middlewares/requireLogin.js');


router.get("/allposts",requireLogin,(req, res) => {
   POST.find().sort({ createdAt: -1 })
   .populate("postedBy", "_id userName")
        
    .then(posts => { return res.json({ posts }) })
    .catch (err=> console.error(err))
} )                                                                    

router.post("/createPost", requireLogin, (req, res) => {
    const { body, pic } = req.body;
    console.log(pic)
    if (!body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    console.log(req.user)
    const post = new POST({
        body,
        photo: pic,
        postedBy: req.user
    })
    
    post.save().then((result) => {
        console.log("post saved");
        return res.json({ post: result })
    }).catch(err => console.error("Error saving post:", err));

})

router.get('/myposts',requireLogin, (req, res) => { 
    console.log(req.user);
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(myposts => {
        return res.json({ myposts });
    })
})


router.put('/like', requireLogin, (req, res) => {
    // console.log("Like request received for postId:", req.body.postId);
    // console.log("User ID from token:", req.user._id);
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).then( result => {
        
            return res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
})

router.put('/unlike', requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).then( result => {
        
            return res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })


    router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        comment: req.body.text,
        postedBy: req.user._id
    };

    POST.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: comment } },
        { new: true }
    )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name Photo")
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
});

module.exports = router;