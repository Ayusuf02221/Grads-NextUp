const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ],
});

exports.log = (level, message, meta = {}) => {
    console.log(`[${level}]`, message, meta);
    logger.log({ level, message, ...meta });
};

exports.logger = logger;
