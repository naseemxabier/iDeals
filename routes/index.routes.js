const express = require('express');
const router = express.Router();
const transporter = require("../config/transporter.config")
const templates = require("../templates/template");
const nodemailer= require("nodemailer")


router.get("/", (req, res, next) => {
  res.render("index");
});
router.post("/send-email", (req, res, next) => {
  
  let { email, subject, message } = req.body;
 
  transporter.sendMail({
    from: `"iDeals " <${process.env.EMAIL_ADDRESS}>`,
    to: email,
    subject: subject,
    text: message,
    html: templates.templateExample(message),
  })
  .then((info) =>{
    console.log("hola")
   res.render("auth/home", { email, subject, message, info })})
  .catch((error) => console.log(error));
})
 
module.exports = router;
