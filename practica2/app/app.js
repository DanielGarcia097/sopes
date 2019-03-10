/**
 * Express es un framework minimalista de NodeJs que contiene funcionalidades
 * integradas.
 * 
 * require:peticiones
 * res: respuestas.
 */
var routers = require("./routes.js");

var express = require("express");

var app = express();

const path = require('path');

var bodyParser = require('body-parser')

var userid = require('userid');

const fs = require('fs');

app.set("view engine", "jade"); //definicion del motor de vistas

app.get("/login", function (req, res) {

  // res.send("Hola Mundo.");
  res.render("index");
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use("/", routers);


//var getUsage = function(){
//    fs.readFile("/proc/" + process.pid + "/stat", function(err, data){
//        console.log(data.toString());
//    });
//}

//getUsage();

var ocioso = 0, detenido = 0, corriendo = 0, zombie = 0, suspendido = 0;

const testFolder = '/proc/';

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    if (!isNaN(file)) {
      file = testFolder + file;
      fs.readFile(file + "/status", function (err, data) {
        var elems = data.toString().split('\n');
        var estado = elems[2];
        var user = elems[8];
        var state = estado.split('	')[1].split(' ');
        var id_user = user.split('	');
        console.log("uid name is:", userid.username(parseInt(id_user[1])));
        console.log(id_user[1]);


        if (state[0] == "S") {
          suspendido += 1;
        } else if (state[0] == "I") {
          ocioso += 1;
        } else if (state[0] == "T") {
          detenido += 1;
        } else if (state[0] == "R") {
          corriendo += 1;
        } else if (state[0] == "Z") {
          zombie += 1;
        }

        console.log("REPORTE");
        console.log("Suspendidos: " + suspendido);
        console.log("Ociosos: " + ocioso);
        console.log("Detenido: " + detenido);
        console.log("Corriendo: " + corriendo);

      });

      fs.readFile(file + "/statm", function (err, data) {
        var elems = data.toString().split(' ');
        var memoria = elems[1];
        console.log("Cantidad memoria: "+memoria+"Porcentaje: "+memoria/1000+"%");

      });


    }
  });

});

app.listen(8000);
