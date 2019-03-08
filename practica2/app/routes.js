var express = require("express");

var router = express.Router();

var bodyParser = require('body-parser')

router.post("/login",function(req,res){

    // res.send("Hola Mundo.");
    console.log(req.body.email);

    if(req.body.email == "admin@admin.com" && req.body.password == 123){
        res.render("dashboard");
    }else{
        res.render("index");
    }

     
 });

 router.use(bodyParser.json())

 module.exports = router;