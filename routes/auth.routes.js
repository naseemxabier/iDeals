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



router.get('/admin', (req,res,next)=>{
  console.log("user")
  res.render('auth/admin', req.session.currentUser)
})

router.post('/admin', (req,res,next)=>{
  let {passwordAdmin} = req.body
  let id=req.session.currentUser 

       if(passwordAdmin === "soyadmin"){
        User.findByIdAndUpdate(id, {isAdmin:true}, {new:true})
        .then(result=>{
          req.session.currentUser.isAdmin = true;
            console.log("response", result)
            res.redirect("/deals/home")
          })
        }
      })


router.get("/signup", isLoggedOut, (req, res,next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const {username, email, password, notification} = req.body;

  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }
  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
    return;
  }
 
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
  
      return User.create({ username, email, password: hashedPassword, notification, role: "user", });
    })
    .then((user) => {
      res.redirect("/");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

 router.get("/login", isLoggedOut, (req, res) => {
  res.render("index");
});


router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  

  if (username === "" || password === "") {
    res.status(400).render("index", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });
    return;
  }
 
  if (password.length < 6) {
    return res.status(400).render("index", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }  

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .render("index", { errorMessage: "Wrong credentials." });
        return;
      }

      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("index", { errorMessage: "Wrong credentials." });
            return;
          }
        
          req.session.currentUser = user.toObject(username, password);
          req.session.currentUser._id = user._id;
          req.session.currentUser.role = user.role;
          req.session.currentUser.email = user.email;
          req.session.currentUser.notification = user.notification
        
          delete req.session.currentUser.password;
          
          res.redirect("/deals/home")
        })
        .catch((err) => next(err)); 
    })
    .catch((err) => next(err));
});

router.get("/profile/:id", (req, res, next) => {
  let id =  req.params.id

  Deal.find({creator:id})
  .then(resulDeal=>{ 
    res.render("auth/profile",{resulDeal, user: req.session.currentUser})
  })
  .catch(e =>(console.log(e)))
})

 router.get("/profile/:id/edit", (req, res, next) => {
  if(req.session.currentUser.notification === "on") {
  res.render("auth/profile-edit", {user: req.session.currentUser, status: true})
return;
  }
  res.render("auth/profile-edit", {user: req.session.currentUser})
})

router.post("/profile/:id/edit", uploader.single("imagen"), (req, res, next) => {
  let id = req.params.id
  let {username, email, password, repeatpassword, notification} = req.body
  let camposUpdate = {username, email, notification};

  if(req.body.notification === undefined) {
    console.log("console.log del notification en el post del edit:", notification)
    camposUpdate.notification = "off";
  }
   if(req.file) {
    console.log("req.file.path:", req.file.path)
    camposUpdate.avatar = req.file.path;
   }

  if (password !== repeatpassword) {
    return res.status(400).render("auth/profile-edit", {user: req.session.currentUser, errorMessage: "Password and Repeat password must be the same"})
  }
  if (password !== "" && password.length !== 6 || repeatpassword !== "" && repeatpassword.length !== 6) {
    return res.status(400).render("auth/profile-edit", {user: req.session.currentUser, errorMessage: "Please check your password, should be 6 characthers long"})
  }
    let salt = bcrypt.genSaltSync(saltRounds);
    let hashedPass = bcrypt.hashSync(password, salt);
    camposUpdate.password = hashedPass;

  User.findByIdAndUpdate(id, camposUpdate, {new: true})
  .then (result => {
    if (username === "" || email === "" ) {
      res.status(400).render("auth/profile-edit", {user: req.session.currentUser,
        errorMessage:
          "All fields are mandatory. Please provide your username, email and password.",
      });
    }
    
    req.session.currentUser.username = username;
    req.session.currentUser.email = email;
    req.session.currentUser.notification = camposUpdate.notification;
    if(req.file) {
      console.log("req.file.path:", req.file.path)
      req.session.currentUser.avatar = camposUpdate.avatar;
     }
    res.redirect(`/auth/profile/${id}`)
  })
  .catch((err) => next(err));

})
router.post("/profile/:id/delete", (req, res, next) => {
  let id = req.params.id
  User.findByIdAndDelete(id)
  .then(()=> {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).render("auth/logout", { errorMessage: err.message });
        return;
      }
      res.redirect("/");
    })
})
.catch((err) => next(err))
})


router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }
    res.redirect("/");
  });
});
module.exports = router;