const transporter = require("../config/transporter.config")
const templates = require("../templates/template");

module.exports = function (email, subject, {name, dealTitle, dealDescription, dealLocation, img}) {
  console.log(typeof email)
    return transporter.sendMail({
    from: `"iDeals " <${process.env.EMAIL_ADDRESS}>`,
    to: email,
    subject: subject,
    text: name, dealTitle, dealDescription, dealLocation,
    html: templates.templateExample({name, dealTitle, dealDescription, dealLocation, img}),
  })
}

