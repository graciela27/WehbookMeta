const jwt = require("jsonwebtoken");
const tf = require('../config/triggerfunctions');;
const { getErrorCode } = require('../config/helpers');;

module.exports = async function (req, res, next) {
    let token = "";

    //web
    if(req.headers['authorization'] ){
        const authHeader = String(req.headers['authorization'] || '');
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7, authHeader.length);
        }
    }

    //mobile
    if(req.headers['x-auth-token']){
         token = String(req.headers['x-auth-token'] || '');
    }

    if (!token)
        return res.status(401).json({ message: "permiso no valido" });

    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        let cifradoUser = "";

        //web
        req.user = cifrado.user;
        cifradoUser = cifrado.user

        //mobile
        if (!cifradoUser) {
            req.user = cifrado.usertoken;
            cifradoUser = cifrado.usertoken
        }
        

        // const result = await tf.executesimpletransaction("UFN_USERTOKEN_SEL", cifradoUser);

        // if (result && result instanceof Array && result.length > 0) {
        //     if (result[0].status !== 'ACTIVO') {
        //         if (result[0].status === 'INACTIVO')
        //             return res.status(401).json({ message: 'Su usuario ha sido logeado en otra PC', code: 'USER_CONNECTED_OTHER_PC' });
        //         else
        //             return res.status(401).json({ message: 'Su sesión ha sido expirada', code: 'SESION_EXPIRED' });
        //     }
        // } else {
        //     return res.status(401).json({ message: 'Token no valido' });
        // }
        next();
    } catch (exception) {
        return res.status(401).json({
            ...getErrorCode(null, exception, "Exception on auth middleware "),
            message: "Token no valido"
        });
    }
}