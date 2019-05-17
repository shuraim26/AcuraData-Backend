const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");
const passport=require("passport");

//Load User model
require("../models/User");
const User=mongoose.model("users");

router.get("/", (req, res) => {
  res.render("index/welcome");
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

router.get("/contact", (req, res) => {
  res.render("index/contact");
});

router.get("/login", (req, res) => {
  res.render("index/login");
});

router.get("/signup", (req, res) => {
  res.render("index/signup");
});

router.post("/signup", function(req, res) {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }

  if (req.body.password.length < 4)
    errors.push({ text: "Password should contain at least 4 characters" });

  if (errors.length > 0)
    res.render("index/signup", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/login");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
              req.flash(
                "success_msg",
                "You are now registered and can login in"
              );
              res.redirect("/login");
            });
          });
        });
      }
    });
  }
});

//Login form POST
router.post("/login",function(req,res,next){
  passport.authenticate("local",{
      successRedirect: "/dash",
      failureRedirect: "/login",
      failureFlash: true
  })(req,res,next);
});

module.exports = router;
