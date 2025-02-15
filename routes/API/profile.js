const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load profile Validation 
const validateProfileInput = require('../../validation/profile')

//Load experience validation
const validateExperienceInput = require('../../validation/experience')

//Load education validation
const validateEducationInput = require('../../validation/education')


//Load Profile model
const Profile = require('../../models/Profile')

//Load User model
const User = require('../../models/User')

//@route  GET api/profie/test
//@desc  Tests profile route
//@access  public
router.get('/test', (req, res) => {
    res.json({msg: 'Profile works'})
});


//@route  GET api/profie
//@desc  Get current users profile
//@access  private
router.get('/', passport.authenticate('jwt', {session: false}), (req,res) =>{
    const errors = {};
    Profile.findOne({user: req.user.id})
        .populate('user',['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => {res.status(404).json(err)});
})



//@route  GET api/profie/handle/:handle
//@desc  Get profile by handle
//@access  Public
router.get('/handle/:handle', (req,res) => {
    const errors = {};
    Profile.findOne({handle: req.params.handle})
    .populate('user', ['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        else {console.log(profile)
        res.json(profile)}
    })
    .catch(err => res.status(404).json(err));
})

//@route  GET api/profie/user/:user_id
//@desc  Get profile by user id
//@access  Public
router.get('/user/:user_id', (req,res) => {
    const errors = {};
    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err));
})



//@route  get /all
//@desc  get allprofiles available
//@access  public
router.get('/all', (req, res) => {
    const errors = {}
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles =>{
        if(!profiles){
            errors.noprofile = "There are no profiles";
            return res.status(404).json(errors)
        }
        res.json(profiles);
    })
    .catch(err =>{res.status(404).json(err)})
})



//@route  POST api/profie
//@desc  Create current users profile
//@access  private
router.post('/', passport.authenticate('jwt', {session: false}), (req,res) =>{
    
    const {errors, isValid} = validateProfileInput(req.body);
    if(!isValid){
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }

    //Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //Skills - Split into array
    if(typeof req.body.skills !== 'udefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    //Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(profile){
                //update
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new : true}
                )
                .then(
                    profile => res.json(profile));
                    console.log(profile);
                    
            } else {
                //create
                
                //Check if handle exists
                Profile.findOne(
                    {handle: profileFields.handle}
                )
                .then(profile => {
                    if (profile){
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }
                //Save profile
                new Profile(profileFields).save().then(
                    profile => res.json(profile));
                    console.log(profile);   
                })
            }
        })
}
);

//@route  POST api/profie/experience
//@desc  Add experience to profile
//@access  Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req,res) =>{
    const {errors, isValid} = validateExperienceInput(req.body);
    if(!isValid){
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
    .then(profile =>{ 
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        // unshift is used manipulate array and by calling this we can pass in one or more parameters representing the elements to be added to the beginning of the array
        profile.experience.unshift(newExp);
        profile.save().then(profile => res.json(profile));
    })
});



//@route  POST api/profie/education
//@desc  Add education to profile
//@access  Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req,res) =>{
    const {errors, isValid} = validateEducationInput(req.body);
    if(!isValid){
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
    .then(profile =>{ 
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        // unshift is used manipulate array and by calling this we can pass in one or more parameters representing the elements to be added to the beginning of the array
        profile.education.unshift(newEdu);
        profile.save().then(profile => res.json(profile));
    })
});


//@route  DELETE api/profie/experience
//@desc  Delete experience from profile
//@access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req,res) =>{
    
    Profile.findOne({user: req.user.id})
    .then(profile =>{ 
       //Get remove index
       const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
        
        //Splice out of array
        profile.experience.splice(removeIndex, 1);

        //Save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});


//@route  DELETE api/profie/education
//@desc  Delete education from profile
//@access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req,res) =>{
    
    Profile.findOne({user: req.user.id})
    .then(profile =>{ 
        //Get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        
        //Splice out of array
        profile.education.splice(removeIndex, 1);

        //Save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});


//@route  DELETE api/profie
//@desc  Delete user and profile
//@access  Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req,res) =>{
    Profile.findOneAndDelete({ user: req.user.id })
        .then(() => {
            User.findOneAndDelete({ _id: req.user.id })
        .then(() => {res.json({ success: true })})
    });
})

module.exports = router;    