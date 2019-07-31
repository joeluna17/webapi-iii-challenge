const express = require('express');
const userDB = require('./userDb');
const postDB = require('../posts/postDb');
const router = express.Router();

router.post('/',validateUser,async (req, res) => {
    const newUser = req.body
    const newUserAdded = await userDB.insert(newUser)
try{
        res.status(201).json(newUserAdded)
    }
catch{
    res.status(500).json({success: false, message:"There was an error saving the user to the database."})
}
});

router.post('/:id/posts', validatePost, async (req, res) => {
    const postAdded = req.body;
    const post = await postDB.insert(postAdded)
    try{
        res.status(201).json(post)
    }
    catch{
        res.staus(500).json({success: false, message:"There was an issue saving to the database."})
    }
});

router.get('/', async (req, res) => {
    const users = await userDB.get()
    try{
        res.status(200).json(users)
    }
    catch{
        res.status(500).json({success: false, message:"there was an error fetching data."})
    }
});

router.get('/:id', validateUserId, async (req, res) => {
        const {id} = req.params;
        const user = await userDB.getById(id)
        try{
            res.status(200).json(user)
        }
        catch{
            res.status(500).json({success: false,message: "there was an error reading from the database."})
        }
    });

router.get('/:id/posts',validateUserId ,async (req, res) => {
    const {id} = req.params;
    const userPost = await userDB.getUserPosts(id)
    try{
        res.status(200).json(userPost)
    }
    catch{
        res.status(500).json({success: false, message:"There was an error fetching post from the database."})
    }
});


router.delete('/:id', validateUserId ,async (req, res) => {
    const{id} = req.params;
    const deletedUser = await userDB.remove(id)
    try{
        res.status(200).end()
    }
    catch{
        res.status(500).json({success: true, message:"There was ans error accessing the database"})
    }
});

router.put('/:id',validateUserId, validatePost ,async (req, res) => {
    const {id} = req.params;
    const updatedPost = req.body;
    const returnedUpdatesPost = await userDB.update(id,updatedPost)
    try{
        res.status(200).json(returnedUpdatesPost)
    }
    catch{
        res.status(500).json({success:false, message: "There was an error accessing the database."})
    }

});

//custom middleware

async function validateUserId(req, res, next) {
    const {id} = req.params
    const exsistingUser = await userDB.getById(id)
    try
    {
        if(!exsistingUser){
            res.status(404).json({success: false, message: "That was not an valid id"})
        }else{
         console.log("this was a user", exsistingUser)
        next()
        }
    }
    catch{
        res.status(500).json({success: false, message: "There was an issue checking the database."})
    }
};

async function validateUser(req, res, next) {
    const newUser = req.body;
    try{
            newUser.name === ""? res.status(400).json({sucess:false, message:"missing user data."}):
               next()  
    }
    catch{
        res.status(500).json({success: false, message:"There was an issue reading from the database."})
    }
};

 function validatePost(req, res, next) {
    const newPost = req.body;
    try{
        if(newPost.text === "" || newPost.user_id === ""){
            res.status(400).json({success: false, message:' missing post data'})
        }else{
            const exsistingUser = userDB.getById(newPost.user_id)
            console.log("im about to check the user and if they exsist")
                if(!exsistingUser){
                res.status(404).json({success: false, message:"Id used does not exsist"})
             }else{
                 console.log("I'm in the post ")
                next()
             } 
        }
    }
    catch{
        res.staus(500).json({success: false, message:"There was an error accessing the database."})
    }
};

module.exports = router;
