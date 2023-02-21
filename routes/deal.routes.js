const express = require("express");
const router = express.Router();
// :fuente_de_información: Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;
// Require the User model in order to interact with the database
/* const User = require("../models/User.model"); */
const Deal = require("../models/Deal.model");
// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin")
const uploader = require("../config/cloudinary.config");

router.get('/add', (req,res,next)=>{
    res.render('deals/add')
})
router.get("/home", (req, res, next) => {
    Deal.find()
    .populate("creator")
    .then(result => {
       /* console.log("result", result) */
       console.log({result:result, user: req.session.currentUser})
       res.render("auth/home",{result:result, user: req.session.currentUser}, )
    } )
  })

//get de la vista /deal/add
router.get('/add', (req,res,next)=>{
    res.render('deals/add')
})
router.post('/add',  uploader.single("imagen"),  (req,res,next)=>{
  let {dealTitle, dealDescription, dealLocation} = req.body
console.log("img:", req.file)
 Deal.create({
        creator: req.session.currentUser,
        title: req.body.dealTitle,
        description: req.body.dealDescription,
        location: req.body.dealLocation,
        filepath: req.file.path,
  })
  .then(result=>{
     Deal.findById(result._id)
     .populate("creator")
     .then(response=>{
        console.log("response",response)
        res.status(200).redirect('/deals/home')
     })
     .catch(err=>next( err))
  })
})
  
router.get('/:id/details', (req,res,next)=>{
    let id = req.params.id
    Deal.findById(id)
    .populate("creator")
    .then(result=>{
        /* console.log("result", result) */
        res.render('deals/details', {result:result})
    })
    .catch(err=>next( err))

})
router.get('/:id/edit', (req,res,next)=>{
    let id = req.params.id
    /* console.log("id:",id) */
    Deal.findById(id)
    .populate("creator")
    .then(result=>{
        /* console.log("result", result) */
        res.render('deals/edit', {result:result})
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
        /* console.log("Result edit", result) */
        res.redirect('/auth/home')
    })
    .catch(err=>next( err))
})

router.post('/:id/delete', (req, res, next) => {
    console.log('soy el post')
    const _id = req.params.id
    console.log('_id/delete',_id)

    Deal.findByIdAndDelete(_id)
        .then(result => {
            console.log("deleted")
            res.send('elinimado')
        })
        .catch(err => next(err))

})
module.exports = router;