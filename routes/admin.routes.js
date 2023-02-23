const express = require("express");
const router = express.Router();
// :fuente_de_información: Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;
// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Deal = require("../models/Deal.model")
// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin")
const uploader = require("../config/cloudinary.config");

router.get("/dashboard", (req, res, next) => {
    User.find()
        .then(result => {
            console.log("DASH", result)
            res.render("auth/dashboard", { result: result, user: req.session.currentUser })
        })
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