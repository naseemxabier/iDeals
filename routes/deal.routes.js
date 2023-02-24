const express = require("express");
const router = express.Router();
const envioMail = require ("../utils/nodemailer")

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;

const User = require("../models/User.model");
const Deal = require("../models/Deal.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin")
const uploader = require("../config/cloudinary.config");

router.get('/add', (req,res,next)=>{
    res.render('deals/add', {user: req.session.currentUser})
})
router.get("/home", (req, res, next) => {
    Deal.find()
    .populate("creator")
    .then(result => {

       res.render("auth/home",{result:result.reverse(), user: req.session.currentUser}, )
    } )
  })



router.post('/add',  uploader.single("imagen"),  (req,res,next)=>{
    let {dealTitle, dealDescription, dealLocation} = req.body
    let img = req.file.path

 if(dealTitle === "" || dealDescription === "" || dealLocation === "" || !img ){
    res.status(400).render("deals/add", {errorMessage:"All fields are mandatory."});
      return;
    }
 
    Deal.create({
        creator: req.session.currentUser,
        title: req.body.dealTitle,
        description: req.body.dealDescription,
        location: req.body.dealLocation,
        filepath: req.file.path,    
  })
 .then(result=>{

    User.find({ notification: "on"})
    .then(result=>{
        if(result.length > 0){
            result.forEach ((user)=> {
                   envioMail(user.email, "Latest deals!", {name: user.username, dealTitle, dealDescription, dealLocation, img})
                  .then(result => {
                     res.redirect("/deals/home")
                  })
              })  
        }
        else {res.redirect("/deals/home") }
    }) 
  })
  .catch(err=>next(err))
})


router.get('/:id/details', (req,res,next)=>{
   let id = req.params.id
   Deal.findById(id)
    .populate("creator")
    .then(result=>{
        res.render('deals/details', {result:result, user: req.session.currentUser})
   })
    .catch(err=>next( err))
    
})

router.get('/:id/edit', (req,res,next)=>{
    let id = req.params.id

    Deal.findById(id)
    .populate("creator")
    .then(result=>{
        res.render('deals/edit', {result:result, user: req.session.currentUser})
    })
    .catch(err=>next( err))
})
router.post('/:id/edit',  uploader.single("imagen"),(req,res,next)=>{
    let {dealTitle, dealDescription, dealLocation} = req.body
    const dealAGuardar = {}
    dealAGuardar.title = dealTitle
    dealAGuardar.description =dealDescription
    dealAGuardar.location = dealLocation
        
    if( req.file !== undefined){
        dealAGuardar.filepath = req.file.path
    }
  
    let _id = req.params.id
    Deal.findByIdAndUpdate(_id, dealAGuardar , {new:true}  )
    .then(result=>{
         if(result.title === "" || result.description === "" || result.location === "" || result.filepath === "" ){

            res.status(400).render("deals/edit",  {result:result, errorMessage:"All fields are mandatory."});
                return;
            }   
        res.redirect('/deals/home')
    })
    .catch(err=>next(err))
})

router.post('/:id/delete', (req, res, next) => {
    const _id = req.params.id

    Deal.findByIdAndDelete(_id)
        .then(result => {
            res.redirect('/deals/home')
        })
        .catch(err => next(err))

})
module.exports = router;