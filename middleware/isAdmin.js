module.exports = (req, res, next) => {
    if(req.session.currentUser.role == "admin") next()
    else(res.redirect("/auth/login"))
}