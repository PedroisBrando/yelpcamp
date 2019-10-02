var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
flash = require("connect-flash"),
passport = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride = require("method-override"),
Campground = require("./models/campground"),
Comment = require("./models/comment"),
User = require("./models/user"),
seedDB = require("./seeds")

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index"); //auth routes

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect("mmongodb+srv://yelpcamp:yelpcamp@yelpcamp-yalbo.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, { 
  useNewUrlParser: true , 
  useUnifiedTopology: true 
}).then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log('ERROR', err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); //Use methodOverride when find _method
app.use(flash());
app.set("view engine", "ejs");
//seedDB();

//passport configuration
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dogs!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){ //passing currentUser: req.user to all routes
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //all routes in campgrounds.js starts with "campgrounds". Appends "/campgrounds" to them"
app.use("/campgrounds/:id/comments", commentRoutes);//all routes in comments.js starts with "/campgrounds/:id/comments. Appends "/campgrounds/:id/comments" to them"


var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("The YelpCamp Server Has Started!!");
});