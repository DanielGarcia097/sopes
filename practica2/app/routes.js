var express = require("express");

var router = express.Router();

var bodyParser = require('body-parser')

var ocioso = 0, detenido = 0, corriendo = 0, zombie = 0, suspendido = 0;

var info_pocess, info_total = new Array(), estados_cant = [];

var userid = require('userid');

const fs = require('fs');

const testFolder = '/proc/';

const os = require('os');

/**
 * CODIGO POST
 * Información de los procesos son enviados mediante el render.
 */


router.post("/login", function (req, res) {

    // res.send("Hola Mundo.");
    console.log(req.body.email);
    if (req.body.email == "admin@admin.com" && req.body.password == 123) {
        getProcessData();
        res.render("dashboard", { data1: estados_cant, data2: info_total });
    } else {
        res.render("index");
    }
});

/**
 * SE OBTIENE LA INFORMAICÓN DE LOS PROCESOS:
 * Se hace la lectura de archivos de forma sincrona para obtener información
 * de procesos.
 */

let files;
getProcessData = function () {
    files = fs.readdirSync(testFolder);
    for (var file in files) {
        if (!isNaN(files[file])) {
            var pid = files[file];
            dir_file = testFolder + files[file];
            var data = fs.readFileSync(dir_file + "/status");
            info_pocess = new Array();
            /**
             * Información extraída del archivo /status
             * 2: Contiene el estado del proceso
             * 8: Contiene el id del usuario que inicio el proceso
             * 0: Contiene el nombre del proceso.
             * */
            var elems = data.toString().split('\n');
            var estado = elems[2];
            var user = elems[8];
            var state = estado.split('	')[1].split(' ');
            var id_user = user.split('	');
            var name = elems[0].split('	');
            console.log("uid name is:", userid.username(parseInt(id_user[1])));
            console.log(id_user[1]);
            console.log("name process: " + name[1]);
            console.log("PID: " + pid);

            /**
             * Cantidad de procesos según su estado:
             * S: Sleeping, I: Idlee, T: Stoped, R: Running, Z: Zombie
             * Se almacenan los contadores en un array.
             */

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

            estados_cant[0] = suspendido;
            estados_cant[1] = ocioso;
            estados_cant[2] = detenido;
            estados_cant[3] = corriendo;
            estados_cant[4] = zombie;

            info_pocess.push(pid);
            info_pocess.push(userid.username(parseInt(id_user[1])));
            info_pocess.push(state[0]);
            info_pocess.push(name[1]);


            /**
             * Lectura del porcentaje de memoria utilizada por un proceso en el archivo /statm
             */

            data = fs.readFileSync(testFolder + files[file] + "/statm");
            var elems = data.toString().split(' ');
            var memoria = elems[1];
            console.log(file + " Cantidad memoria: " + memoria + "Porcentaje: " + memoria / 10000 + "%");

            /**
             * Almacenamiento de información en arraylist:
             * id, user, state, %RAM, name
             */

            info_pocess.push(memoria / 10000 + "%");
            info_total.push(info_pocess);
        }
    }
}

var cpuStat = require('cpu-stat');

setInterval(function () {
cpuStat.usagePercent(function(err, percent, result) {
    if (err) {
      return console.log(err);
    }

    //the percentage cpu usage over all cores
    console.log("%"+percent);

    //the approximate number of seconds the sample was taken over
    console.log(result);
});

},1000);

/*var cpus = os.cpus();

setInterval(function () {
    for (var i = 0, len = cpus.length; i < len; i++) {
        console.log("CPU %s:", i);
        var cpu = cpus[i], total = 0.000;

        for (var type in cpu.times) {
            total += cpu.times[type];
        }

        for (type in cpu.times) {
            console.log("\t", type, Math.round(100 * cpu.times[type] / total));
        }
    }
},1000);
*/
/**
 * PETICIÓN GET PARA LA VISTA DE INFORMACIÓN CPU
 */

router.get("/CPU", function (req, res) {

        res.render("cpuinfo");
    });



router.use(bodyParser.json())

module.exports = router;
