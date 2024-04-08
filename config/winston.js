"use strict";
const { createLogger, format, transports } = require("winston");
require('winston-daily-rotate-file');
const logdnaWinston = require('logdna-winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

const logtail = new Logtail('U5pk3cU3TvM2M87raX6sUR3V');

const levels = {
    error: 0,   //error on catch exception
    warn: 1,    //error on request from api
    info: 2,    //input and output on request + requests to our api  
    debug: 3,   //queries on trigger functions
}

const env = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || "debug";
const logDisk = process.env.LOG_DISK === "true";

//options to logDNA
const options = {
    key: "f0461f53dc8f6f74bbcbd24725bfd9ee",
    app: `api_minierp_${env}`,
    env: env,
    level: logLevel, // Default to debug, maximum level of log, doc: https://github.com/winstonjs/winston#logging-levels
    indexMeta: true // Defaults to false, when true ensures meta object will be searchable
}

const logger = createLogger({
    levels,
    level: logLevel,
    format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), format.json()),
    transports: [
        new transports.Console(),
        new LogtailTransport(logtail),
        ...(logDisk ? [
            new transports.DailyRotateFile({ dirname: './logs', filename: "all-%DATE%.log", datePattern: 'YYYY-MM-DD' }),
            new transports.DailyRotateFile({ dirname: './logs', filename: "err-%DATE%.log", datePattern: 'YYYY-MM-DD', level: "error" }),
        ] : []),
    ],
    ...(logDisk ? {
        exceptionHandlers: [new transports.DailyRotateFile({ dirname: './logs', filename: "exceptions-%DATE%.log", datePattern: 'YYYY-MM-DD' })],
        rejectionHandlers: [new transports.DailyRotateFile({ dirname: './logs', filename: "rejections-%DATE%.log", datePattern: 'YYYY-MM-DD' })],
    } : {}),
    exitOnError: false
});

// if (env !== "development") {
//     logger.add(new logdnaWinston(options));
// }

module.exports = logger;