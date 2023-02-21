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
router.get('/deals/add', (req,res,next)=>{
    res.render('deals/add')
})
router.get("/home", (req, res, next) => {
     Deal.find()
     .populate("creator")
     .then(result => {
        /* console.log("result", result) */
        res.render("auth/home",{result:result})
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
        creator:req.session.currentUser,
        title: req.body.dealTitle,
        description: req.body.dealDescription,
        location: req.body.dealLocation,
        filepath: req.file.path,
  })
 User.find({ notification : true})
  .then(result=>{
    console.log(result)
    result.forEach ((user)=> {
        console.log("user:", user)
        envioMail(user.email, "hola", "hola")
        .then(result => {
            console.log("hola")
           res.redirect("/deals/home")
        })
    })
  }) 
})


router.get('/details', (req,res,next)=>{
    res.render('deals/details')
})
router.get('/:id/edit', (req,res,next)=>{
    let {id} = req.params
    console.log("id:",id)
    Deal.findById(id)
    .populate("creator")
    .then(result=>{
        console.log("result", result)
        res.render('deals/edit', {result:result})
    })
})
router.post('/:id/edit',  uploader.single("imagen"),(req,res,next)=>{
    let {dealTitle, dealDescription, dealLocation} = req.body
    let {id} = req.params
    Deal.findOneAndUpdate(id, {dealTitle}, {new:true} )
    .then(result=>{
        console.log("Result edit", result)
        res.redirect('/deals/home',{result:result})
    })
})
module.exports = router;