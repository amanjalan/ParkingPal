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
        User.findOne({username: req.body.username}, (err, user) => {
            if (err)
                handleError(res, err.message, 'No User Found');
            else if(user!=null) {
                bcrypt.compare(req.body.password, user.password_hash, (error, result) => {
                    if (error) {
                        handleError(res, error.message, 'Invalid Password');
                    }
                    else if(result==true)
                        res.status(200).json(user);
                });
            }
            else res.sendStatus(400);
        });
    });

    // SignUp with new User 
    app.post('/signup', (req, res) => {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            if(!err) {
                let user = new User({
                    username: req.body.username,
                    password_hash: hash,
                    email_id: req.body.email_id,
                    phone_number: req.body.phone_number,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    // TODO: Change date format and make it universal. it takes one less day right now
                    dob: new Date(req.body.dob),
                    address: req.body.address
                });
                user.save().then(user => {
                    res.status(200).json(user);
                }).catch(error => {
                    handleError(res, error.message, 'Failed to save new User');
                });
            }
            else {
                res.status(400);
            }
        });
    });

    app.delete('/deleteUser', (req, res) => {
        User.findOne({username: req.body.username}, (err, user) => {
            if (err)
                handleError(res, err.message, 'No User Found');
            else {
                bcrypt.compare(req.body.password, user.password_hash, (error, result) => {
                    if (error) {
                        handleError(res, error.message, 'Invalid Password');
                    }
                    else if(result==true) {
                        User.deleteOne({username: req.body.username}, (err => {
                            if (err)
                                console.log(err);
                            else {
                                console.log('User Removed');
                                res.sendStatus(200);
                            }
                        }));
                    }
                });
            }
        });
    });

    app.put('/addNewVehicle', (req, res) => {
        let vehicle = {
            type: req.body.type,
            color: req.body.color,
            number: req.body.number,
            make: req.body.make,
            model: req.body.model
        };
        User.findOneAndUpdate(
            {username: req.body.username},
            {
                $push: {
                    vehicles: vehicle
                }
            },
            (err, result) => {
                if (err)
                    handleError(res, err.message, 'Failed to add new vehicle.');
                else {
                    res.json(result);
                    console.log(result);
                }
            }
        );
    });
});
