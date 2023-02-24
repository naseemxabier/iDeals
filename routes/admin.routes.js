const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const saltRounds = 10;
const User = require("../models/User.model");
const Deal = require("../models/Deal.model")
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin")
const uploader = require("../config/cloudinary.config");


router.get("/dashboard", (req, res, next) => {
    User.find()
        .then(result => {
            
            res.render("auth/dashboard", { result: result, user: req.session.currentUser })
        })
        .catch(err => next(err))
})

router.post('/:id/delete', (req, res, next) => {
    let id = req.params.id

    User.findByIdAndDelete(id)
        .then(result => {
            res.redirect('/admin/dashboard')
        })
        .catch(err => next(err))
})

module.exports = router;