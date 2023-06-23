const dotenv = require("dotenv")
dotenv.config()
const express = require('express');
const bodyparser = require('body-parser');
const encrypt = require('mongoose-encryption');
const ejs = require("ejs");

var app = express();
const port = process.env.PORT || 5000; 
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));



const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/secrets");

const trySchema = new mongoose.Schema({
    email: String,
    password: String
});



//data encryption
const secret = "thisislittlesecret";
trySchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const item = mongoose.model("second",trySchema);
app.get("/",function(req,res){
    res.render("home");
});

app.post("/register", function(req, res){
    const newUser = new item({
        email: req.body.username,     
        password: req.body.password
    });
    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
});


app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    item.findOne({email:username})
        .then((foundUser)=>{
            if(foundUser){
                if(foundUser.password == password){
                    res.render("secrets");
                }
            }
        })
        .catch((err)=>{
            console.log(err);

        });
});

app.post("/submit",function(){
    
});



app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});
app.get("/secrets",function(req,res){
    res.render("secrets");
});
app.get("/submit",function(req,res){
    res.render("submit");
});

app.listen(port,function(){
    console.log(`server started on port ${port}`);
});


//vercel