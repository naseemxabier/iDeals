const express = require("express");
const router = express.Router();
const envioMail = require ("../utils/nodemailer")
// :fuente_de_información: Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;
// Require the User model in order to interact with the database
/* const User = require("../models/User.model"); */
const User = require("../models/User.model");
const Deal = require("../models/Deal.model");
// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
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
    //    console.log("resultHOME", result) 
       /* console.log({result, user: req.session.currentUser}) */
       res.render("auth/home",{result:result, user: req.session.currentUser}, )
    } )
  })

//get de la vista /deal/add
/* router.get('/add', (req,res,next)=>{
    res.render('deals/add',{user: req.session.currentUser})
}) */


router.post('/add',  uploader.single("imagen"),  (req,res,next)=>{
    let {dealTitle, dealDescription, dealLocation} = req.body
    let img = req.file
    console.log("img:", img)

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
  .then(result => {
     /* console.log("resultmail", result) */ 
   res.redirect("/deals/home")
})
    .catch(err=> console.log(err))

 .then(result=>{
    console.log(result)
    User.find({ notification: "on"})
    .then(result=>{
      result.forEach ((user)=> {
          envioMail(user.email, "Latest deals!", user.username, dealTitle, dealDescription, dealLocation, img)
          .then(result => {
             res.redirect("/deals/home")
          })
          .catch(err=> console.log(err))
      })
    }) 
  })
  .catch(err=>next(err))
 
 
})


router.get('/:id/details', (req,res,next)=>{

   let id = req.params.id
   console.log("id:",id)
   Deal.findById(id)
    .populate("creator")
    .then(result=>{
    /* console.log("result", result) */
        res.render('deals/details', {result:result, user: req.session.currentUser})
   })
    .catch(err=>next( err))
    
})
 //router.get('/:id/edit', (req,res,next)=>{
 // let {id} = req.params
   //console.log("id:",id)
 //   Deal.findById(id)
 //   .populate("creator")
 //   .then(result=>{
  //      /* console.log("result", result) */
  //      res.render('deals/details', {result:result})
 //   })
  //  .catch(err=>next( err))
//}) 

router.get('/:id/edit', (req,res,next)=>{
    let id = req.params.id
    /* console.log("id:",id) */

    Deal.findById(id)
    .populate("creator")
    .then(result=>{
        res.render('deals/edit', {result:result, user: req.session.currentUser})
    })
    .catch(err=>next( err))
})
router.post('/:id/edit',  uploader.single("imagen"),(req,res,next)=>{
    let {dealTitle, dealDescription, dealLocation} = req.body
    /* console.log('BODY', req.body) */
    /* let img = req.file.path */
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
    console.log('_id/delete',_id) 

    Deal.findByIdAndDelete(_id)
        .then(result => {
            console.log("deleted")
            res.redirect('/deals/home')
        })
        .catch(err => next(err))

})
module.exports = router;