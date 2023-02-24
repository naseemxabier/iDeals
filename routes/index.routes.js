const express = require('express');
const router = express.Router();
const User = require("../models/User.model");
const Deal = require("../models/Deal.model");

router.get("/",  (req, res, next) => {

  Deal.find()
    .populate("creator")
    .then(result => {
       res.render("index",{result:result} )
    } )
}); 
 
module.exports = router;
