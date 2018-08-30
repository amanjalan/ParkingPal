const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const app = express();

const User = require('./models/user');

// body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// ejs engine
app.set('view engine', 'ejs');

mongoose.connect(
    'mongodb://localhost:27017/ParkingPal',
    {useNewUrlParser: true}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Mongo Connection Successful');

    const server = app.listen(process.env.port || 3000, () => {
        const port = server.address().port;
        console.log("App Now Running on port " + port);
    });

    function handleError(res, reason, message, code) {
        console.log("Error: " + reason);
        res.status(code || 500).json({"error": message});
    }

    // Home Page
    app.get("/", function(req,res){
        res.render("home");
    });

    // Login Page
    app.get("/login", function(req,res){
        res.render("login");
    });

    // SignUp Page
    app.get("/signup",function(req,res){
        res.render("signup");
    });

    // Login Credentials Check
    app.post('/login', (req, res)=>{
        User.find({username: req.body.username}, (err, user) => {
            if (err)
                handleError(res, err.message, 'Failed to get user');
            else {
                bcrypt.compare(req.body.password, user.password_hash, (err, result) => {
                    if (err)
                        handleError(res, err.message, 'Invalid Password');
                    else if(result==true)
                        res.status(200).json(user);
                });
            }
        });
    });

    // SignUp with new User 
    app.post('/signup', (req, res) => {
        console.log('In Signup');
        const pass = bcrypt.hash(req.body.password, 10, (err, result) => {
        console.log('Finihsed bcrypt');
            if(result==true) {
                console.log('In result true');
                let user = new User({
                    username: req.body.username,
                    password_hash: pass,
                    email_id: req.body.email_id,
                    phone_number: req.body.phone_number,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    address: req.body.address
                });
                user.save().then(user => {
                    res.status(200).json(user);
                }).catch(err => {
                    handleError(res, err.message, 'Failed to save new User');
                });
            }
            else {
                console.log('In result false');
                res.status(400);
            }
        });
    });
});
