require('dotenv').config();
const logger = require('./config/winston');
const morganMiddleware = require("./config/morgan.middleware");
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const errorMiddlewares = require('./middleware/error');
const apiResponseMiddleware = require('./middleware/response');
const v1 = require('./api');
const app = express();

// Middleware para obtener la dirección IP real desde el encabezado X-Forwarded-For
app.set('trust proxy', true);

app.use(express.urlencoded({
    extended: true
}))

app.use(morganMiddleware);

app.use(cors({
}));

app.use(express.json({ limit: '100mb' }));//to accept json

const PORT = process.env.PORT || 6065;


app.use(apiResponseMiddleware());

app.use(function (req, res, next) {
    req._requestid = uuidv4();
    next();
});


app.use('/api', v1)
app.get('/', (req, res) => res.send('Welcome to HSM API '));


app.use(errorMiddlewares.notFound);
app.use(errorMiddlewares.errorHandler);

app.listen(PORT, '0.0.0.0', () => {});

logger.info(`System launch API-HSM on port ${PORT}`);