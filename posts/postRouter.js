const express = require('express');
const postDB = require('../posts/postDb');
const userDB = require('../users/userDb');
const router = express.Router();

router.get('/',async (req, res) => {
        const posts = await postDB.get()
    try{
        res.status(200).json(posts)
    }
    catch{
        res.status(500).json({success: false, message: "There was an error accessinf the database."})
    }
});

router.get('/:id', validatePostId ,async (req, res) => {
    const {id} = req.params;
    const post = await postDB.getById(id)
    try{
        res.status(200).json(post)
    }
    catch{
        res.status(500).json({success: false, message:"There was an error reading from the database."})
    }
});

router.delete('/:id',validatePostId, async (req, res) => {
    const {id} = req.params;
    const  deletedPost =  await postDB.remove(id)
    try{
        res.status(200).end()
    }
    catch{
        res.status(500).json({success: false, message:"There was an error reading from the database."})
    }
});

router.put('/:id', validatePostId ,async (req, res) => {
    const {id} = req.params;
    const postToUpdate = req.body
    const updatedPost = postDB.update(id, postToUpdate);
    try{
        res.status(200).json(updatedPost)
    }
    catch{
        res.status(500).json({success: false, message:"There was a error writting to the database."})
    }
});

// custom middleware

async function validatePostId(req, res, next) {
    const {id} = req.params;
    const exsistingUser = await userDB.getById(id)
    try{
        exsistingUser?next():res.status(400).json({success: false, message:"Invalid user ID."});
    } 
    catch{
        res.status(500).json({success: false, message: "There was an error accessing the database."});
    } 
};

module.exports = router;