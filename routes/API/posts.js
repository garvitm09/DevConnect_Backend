const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Loading Post model
const Post = require('../../models/Post');

//Loading Profile model
const Profile = require('../../models/Profile');

//Validation
const validatePostInput = require('../../validation/post');

//@route  GET api/posts/test
//@desc  Tests post route
//@access  public
router.get('/test', (req, res) => {
    res.json({msg: 'Posts works'})
});


//@route  GET api/posts
//@desc  Get posts
//@access  public
router.get('/', (req,res) => {
    Post.find()
        .sort({data: -1})
        .then(posts => res.json(posts))
        .catch(err =>  
            res.status(404).json({nopostfound: 'No posts found'}))
})


//@route  GET api/posts/:_id
//@desc  Get post by id
//@access  public
router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err =>  res.status(404).json({nopostfound: "No post found with that id"})); 
})


//@route  POST api/posts
//@desc  Create post
//@access  private

router.post('/', passport.authenticate('jwt', {session: false}), (req,res) =>{
    const {errors, isValid} = validatePostInput(req.body);
    if(!isValid){
        //Check errors
        return res.status(404).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    });
    newPost.save().then(post => res.json(post));
})


//@route  DELETE api/posts/:id
//@desc  Delete post
//@access  private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res) =>{
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            //Check for post owner
            if (post.user.toString() !== req.user.id){
                return res
                .status(401)
                .json({notauthorized: 'User not authorized'});
            }
            //Delete
            post.deleteOne().then(() => res.json({success: true}));
        })
        .catch(err => res.status(400).json({postnotfound: 'No post found'}));
    })
})


//@route  POST api/posts/like/:id
//@desc  Like post
//@access  private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res) =>{
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                return res.status(400).json( {alreadyliked: 'User already liked this post'})
            }
            //Add usre id to likes array
            post.likes.unshift({user: req.user.id})
            
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(400).json({postnotfound: 'No post found'}));
    })
})


//@route  POST api/posts/unlike/:id
//@desc  Unlike post
//@access  private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res) =>{
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                return res.status(400).json( {notliked: 'You have no likes this post'})
            }
            
            // get remove index
            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
        
            //Splice our of array
            post.likes.splice(removeIndex, 1);

            //Save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(400).json({postnotfound: 'No post found'}));
    })
})


//@route  POST api/posts/comment/:id
//@desc  Add comment to post
//@access  private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req,res) =>{
    const {errors, isValid} = validatePostInput(req.body);
    if(!isValid){
        //Check errors
        return res.status(404).json(errors);
    }
    Post.findById(req.params.id)
    .then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        //Add comment to array
        post.comments.unshift(newComment);

        //save
        post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({postnotfound: 'No post found'}))
})


//@route  DELETE api/posts/comment/:id
//@desc  delete comment
//@access  private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req,res) =>{
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.comments.filter(comment => comment.user.toString() === req.user.id).length === 0){
                return res.status(400).json( {nocomment: 'You have no commented on this post'})
            }
            
            // get remove index
            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.params.comment_id);
        
            //Splice our of array
            post.comments.splice(removeIndex, 1);

            //Save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(400).json({postnotfound: 'No post found'}));
    })
})


module.exports = router;    