module.exports = (req, res, next) => {
    if(currentUser==="admin") next()
    else(res.redirect("/auth/login"))
}