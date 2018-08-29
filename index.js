var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");

    mongoose.connect("mongodb://localhost/yelp",{ useNewUrlParser: true});

// body-parser
app.use(bodyParser.urlencoded({extended: true}));

// ejs engine
app.set("view engine","ejs");

// start server
app.listen(3000,function(){
    console.log("Parking Pal Server Started");
});

// home page
app.get("/",function(req,res){
 res.render("home");
});


// login page
app.get("/login",function(req,res){
    res.render("login");
});

// SignUp page
app.get("/signup",function(req,res){
    res.render("signup");
});