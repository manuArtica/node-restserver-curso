const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    /**
     * Obtenemos el body, que, en este caso, será lo que introducimos en el Postman.
     * Para este ejemplo el email y el password
     */

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'USUARIO (¡¡¡NUNCA HACER ESTO EN PRODUCCION!!!) o contraseña incorrectos'
                }
            });
        }

        /**
         * La función bcrypt.compareSync() comprueba si la contraseña introducida 
         * hace match con la contraseña de la BBDD
         */

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o CONTRASEÑA (¡¡¡NUNCA HACER ESTO EN PRODUCCION!!!) incorrectos'
                }
            });
        }

        let token = jwt.sign({
                usuario: usuarioDB
            },
            process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
});

module.exports = app;