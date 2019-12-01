const jwt = require('jsonwebtoken');

/**
 * ===================
 * Verificar token
 * ===================
 */


let verificaToken = (req, res, next) => {

    let token = req.get('token');

    /**
     * Usamos la funcion verify de jwt para la verificacion del token
     */

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        /**
         * Si da error, devolverá un error 401 que es un no autorizado
         */

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

/**
 * =====================
 * Verificar admin role
 * =====================
 */

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}