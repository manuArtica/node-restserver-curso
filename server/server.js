const express = require('express');
const app = express();

require('./config/config');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

/**
 * El post se usa para crear nuevos registros y hacer peticiones
 * y mandar información
 */

app.post('/usuario', function(req, res) {

    let body = req.body;
    res.json({
        body
    });
});

/**
 * El put es muy utilizado cuando queremos enviar datos y actualizar registros
 * Para que la petición put acepte un id en la url hay que indicarlo de la
 *  siguiente manera: 
 * Primero hay que especificar el path (usuario/:id)
 * Este será el parámetro que recibiremos en la url
 */
app.put('/usuario/:id', function(req, res) {

    /**
     * Para obtener el parámetro:
     * La variable id no es la que tiene que hacer match con el id de la url
     * El que hace match con :id es el id de req.params.id
     */

    let id = req.params.id;

    /**
     * En la salida (res) crearemos un objeto de la siguiente manera:
     */
    res.json({
        id
    });
});

/**
 * El patch es muy similar al put
 */

app.patch('/usuario', function(req, res) {
    res.json('patch Usuario');
});

/**
 * El delete se usa para cambiar el estado de algo para que ya no esté disponible
 */

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});