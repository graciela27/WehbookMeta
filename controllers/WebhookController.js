const logger = require('../config/winston');
const axios = require('axios')


exports.verifyToken = async (req, res) => {

    logger.child({ _requestid: req._requestid, body: req.body }).info(`verifyToken.body`);

    const mode = req.query["hub.mode"]
    const challenge = req.query["hub.challenge"]
    const verify_token = req.query["hub.verify_token"]

    if (verify_token === process.env.VERIFY_TOKEN) {
        return res.send(challenge)
    }
    else {
        return res.send("Fail")
    }
}


async function getAuthTokenDirectus() {
    try {
        const response = await axios.post(`${process.env.URL_DIRECTUS}/auth/login`, {
            email: process.env.EMAIL_DIRECTUS,
            password: process.env.PASSWORD_DIRECTUS
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data
    } catch (error) {
        console.error('Error al obtener el token:', error);
    }
}

async function getDataWithToken(celular, estado_envio, id_mensaje, fecha, descripcion_error, error) {
    const tokenData = await getAuthTokenDirectus();
    const token = tokenData.data.access_token;

    try {
        const dataResponse = await axios.patch(`${process.env.URL_DIRECTUS}/items/HSM`, {
            "query": {
                "filter": {
                    "Number": {
                        "_eq": celular
                    }
                }
            },
            "data": {
                "Estado": estado_envio,
                "messages_id":id_mensaje,
                "F_Envio": fecha,
                "descripcion_error":descripcion_error,
                "Log": error
            }

        },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
        console.log(dataResponse.data)

    } catch (error) {
        console.error('Error al realizar la solicitud con el token:', error);
    }
}

exports.events = async (req, res) => {

    logger.child({ _requestid: req._requestid, body: req.body }).info(`events.body`);

    const data = req.body

    const responseBotpress = await axios.post(`${process.env.URL_BOTPRESS}`, data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const estado = data.entry[0].changes[0].value.statuses;
    if (estado) {
        const estado_envio = estado[0].status
        const celular = estado[0].recipient_id
        const id_mensaje = estado[0].id
        const fecha = estado[0].timestamp
        const error = estado[0].errors[0].code
        const descripcion_error = estado[0].errors[0].error_data.details 

        if (estado_envio === "sent" ){
            getDataWithToken(celular, estado_envio, id_mensaje, fecha);
        }
        if (estado_envio === "failed" ){
            getDataWithToken(celular, estado_envio, id_mensaje, fecha, error, descripcion_error);
        }
    }
    return res.json({ data: null, error: false, input: "Events", responseBotpress: responseBotpress.data })
}