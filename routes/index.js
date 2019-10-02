var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//Root Route
router.get("/", function(req, res){
  res.render("landing");
});

//Show register form
router.get("/register", function(req, res){
  res.render("register");
})

//Handle Sign up logic
router.post("/register", function(req, res){
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      //req.flash("error", err.message); //the message comes from passport (ex: username can't be balnk)
      return res.render("register", { "error": err.message });
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to Yelpcamp " + user.username);
      res.redirect("/campgrounds"); 
    });
  });
});

//Show login form
router.get("/login", function(req, res){
  res.render("login");
})

//Handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){
});

//Logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds");
});

module.exports = router;