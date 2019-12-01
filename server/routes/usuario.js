const express = require('express');

const bcrypt = require('bcrypt');

/**
 * El estandar de uso del underscore es un guión bajo
 */

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', (req, res) => {

    /**
     * Esta búsqueda traerá todos los registros que hay en la bbdd
     * Existen varias funciones para poder filtrar los datos.
     * La funcion limit() solo devuelve el número de registros indicados
     * La función skip() empezará a mostrar registro a partir del número 
     * indicado, es decir, si se le pone 5, saltará los 5 primeros y mostrará
     * a partir del 6
     * Le podemos añadir parámetros opcionales en la url para poder elegir
     * a partir de que registro quiere ver y cuantos quiere ver.
     * Los parámetros opcionales están el en objeto request.query
     * Colocamos el desde en el skip y luego lo añadimos a la url
     * {{}}/usuario?desde=10 Esto mostrará los cinco siguientes a partir
     * del 10, osea 11, 12 13 14 y 15
     * Con el limit se puede hacer igualmente
     */

    return res.json({
        usuario: req.usuario
    })

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limit = req.query.limit || 5;
    limit = Number(limit);
    /**
     * En el segundo argumento del find podemos indicar los campos que queremos
     * que se muestren introduciendolos en un string
     */
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .limit(limit)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            /**
             * Es interesante retornar también la cantidad total de registros
             * Con la funcion countDocuments se recogen y se muestran en la respuesta json
             */

            Usuario.count({ estado: true }, (err, cantidad) => {

                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                });
            })


        })
});

/**
 * El post se usa para crear nuevos registros y hacer peticiones
 * y mandar información
 */

app.post('/usuario', verificaAdmin_Role, function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});

/**
 * El put es muy utilizado cuando queremos enviar datos y actualizar registros
 * Para que la petición put acepte un id en la url hay que indicarlo de la
 *  siguiente manera: 
 * Primero hay que especificar el path (usuario/:id)
 * Este será el parámetro que recibiremos en la url
 */
app.put('/usuario/:id', verificaAdmin_Role, function(req, res) {

    /**
     * Para obtener el parámetro:
     * La variable id no es la que tiene que hacer match con el id de la url
     * El que hace match con :id es el id de req.params.id
     */

    let id = req.params.id;

    /**
     * Obtenemos el body igual que en una petición POST
     * Usamos la función pick de underscore para indicar
     * cuales son las propiedades que se podrán actualizar
     */

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    /**
     * Realizamos la actualización.
     * Usamos el modelo Usuario y las funciones de mongoose,
     * en este caso la funcion findByIdAndUpdate()
     */

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        /**
         * En la salida (res) crearemos un objeto de la siguiente manera:
         */
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


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

app.delete('/usuario/:id', verificaAdmin_Role, function(req, res) {

    let id = req.params.id;

    /**
     * Eliminacion total del usuario, se borrará físicamente de la base de datos
     */

    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 err
             });
         };

         if (!usuarioBorrado) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'Usuario no encontrado'
                 }
             });
         }

         res.json({
             ok: true,
             usuario: usuarioBorrado
         });
     });
     */

    /**
     * Pasar el estado del usuario a false para evitar su eliminación física de la BBDD
     */

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        /**
         * En la salida (res) crearemos un objeto de la siguiente manera:
         */
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

module.exports = app;