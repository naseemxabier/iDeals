module.exports = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.render("/");
  }

  next();
};
