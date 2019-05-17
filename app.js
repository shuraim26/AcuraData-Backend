//Import modules
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash=require("connect-flash");

const app = express();

const index = require("./routes/index");
const login = require("./routes/login");

//DB Config
const db=require("./config/database");

//Connect to Mongoose
mongoose
  .connect("mongodb://temp:temp123@ds125526.mlab.com:25526/proj_temp", { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {},
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Mthod-override middleware
app.use(methodOverride("_method"));

//Cookie-parser middleware
app.use(cookieParser());

//Express-session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(flash());

// Map global promises
mongoose.Promise = global.Promise;

//Global variables
app.use(function(req,res,next){
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    res.locals.user=req.user || null;
    next();
});

//Use routes
app.use("/", index);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server started on port " + port);
});
