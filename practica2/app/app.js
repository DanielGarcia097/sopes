/**
 * Express es un framework minimalista de NodeJs que contiene funcionalidades
 * integradas.
 * 
 * require:peticiones
 * res: respuestas.
 */

var express = require("express");

var app = express();

app.set("view engine","jade"); //definicion del motor de vistas

app.get("/login",function(req,res){

   // res.send("Hola Mundo.");
    res.render("index");
});

app.listen(8000);
