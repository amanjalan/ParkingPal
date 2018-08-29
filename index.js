const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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


    app.post('/login', (req, res)=>{
        User.find({username: req.body.username}, (err, user) => {
            if (err)
                handleError(res, err.message, 'Failed to get user');
            res.status(200).json(user);
        });
    });
});
