const User = require("../models/user");

exports.getAdmin = (req, res, next) => {
  User.findOne({ isLoggedIn: true })
    .then((foundUser) => {
      res.json({ type: 200, user: foundUser });
    })
    .catch((error) => {
      res.json({
        user: null,
      });
    });
};

exports.signIn = (req, res, next) => {
  User.findOneAndUpdate(
    { username: req.body.userName, password: req.body.password },
    { isLoggedIn: true }
  )
    .then((foundUser) => {
      if (foundUser) {
        res.json({ type: 200, user: foundUser });
      } else {
        res.json({
          type: 404,
          message: "Wrong username and password",
        });
      }
    })
    .catch((error) => {
      res.json({
        type: 404,
        message: error,
      });
    });
};

exports.signOut = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.body._id }, { isLoggedIn: false })
    .then((foundUser) => {
      if (foundUser) {
        res.json({
          type: 200,
          user: foundUser,
          message: "User logout successfully",
        });
      } else {
        res.json({
          type: 404,
          message: "Wrong username and password",
        });
      }
    })
    .catch((error) => {
      res.json({
        type: 404,
        message: error,
      });
    });
};
