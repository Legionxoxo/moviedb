const winston = require("winston");
const { combine, timestamp, errors, json, prettyPrint } = winston.format;

/**
 * Available loggers:
 * @enum {string}
 */
const loggerTypes = {
    default: "default",
};

/**
 * Create a logger instance for the default logger
 * @type {winston.Logger}
 */
winston.loggers.add(loggerTypes.default, {
    level: "debug",
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: `.logs/all.log`,
            level: "error",
        }),
    ],
    defaultMeta: { service: loggerTypes.default },
});

module.exports = loggerTypes;
