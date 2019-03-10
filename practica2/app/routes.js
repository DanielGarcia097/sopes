var express = require("express");

var router = express.Router();

var bodyParser = require('body-parser')

var ocioso = 0, detenido = 0, corriendo = 0, zombie = 0, suspendido = 0;

var info_pocess, info_mem = new Array(), estados_cant = new Array();

var userid = require('userid');

const fs = require('fs');

const testFolder = '/proc/';

router.post("/login", function (req, res) {

    // res.send("Hola Mundo.");
    console.log(req.body.email);

    if (req.body.email == "admin@admin.com" && req.body.password == 123) {
        getProcessData();
        res.render("dashboard", { data1: estados_cant });
    } else {
        res.render("index");
    }
});


function getProcessData() {
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            if (!isNaN(file)) {
                var pid = file;
                file = testFolder + file;
                fs.readFile(file + "/status", function (err, data) {
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

                    estados_cant.push(suspendido);
                    estados_cant.push(ocioso);
                    estados_cant.push(detenido);
                    estados_cant.push(corriendo);
                    estados_cant.push(zombie);
                    
                    info_pocess.push(pid);
                    info_pocess.push(userid.username(parseInt(id_user[1])));
                    info_pocess.push(state[0]);
                    info_pocess.push(name[1]);

                });

                /**
                 * Lectura del porcentaje de memoria utilizada por un proceso en el archivo /statm
                 */

                fs.readFile(file + "/statm", function (err, data) {
                    var elems = data.toString().split(' ');
                    var memoria = elems[1];
                    console.log(file + " Cantidad memoria: " + memoria + "Porcentaje: " + memoria / 10000 + "%");
		    
		         /**
                  * Almacenamiento de información en arraylist:
                  * id, user, state, %RAM, name
                  */
                
                   info_mem.push(memoria / 10000 + "%");
                });                

            }
        });

    });
}


router.use(bodyParser.json())

module.exports = router;
