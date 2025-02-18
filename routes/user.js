const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

// to get user profile
router.get("/user/:id", (req, res) => {
    USER.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            POST.find({ postedBy: req.params.id })
                .populate("postedBy", "_id")
                .then(( post) => {
                   
                    res.status(200).json({ user, post })
                })
        }).catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
})

// to follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        const result1 = await USER.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        if (!result1) {
            return res.status(422).json({ error: "User not found" });
        }

        const result2 = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        res.json(result2);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});


// to unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        const result1 = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        if (!result1) {
            return res.status(422).json({ error: "User not found" });
        }

        const result2 = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        res.json(result2);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});


// to upload profile pic
router.put("/uploadProfilePic", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.user._id, {
        $set: { Photo: req.body.pic }
    }, {
        new: true
    }).then(( result) => {
        
            res.json(result)
      
    })
        .catch(err => {
            console.log(err);
    })
})

module.exports = router;