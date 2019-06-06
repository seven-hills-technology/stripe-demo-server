import winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

import {config} from './config';

const consoleErrorStackFormat = winston.format.printf(info => {
    const properties = Object.getOwnPropertyNames(info);
    const ignoredProperties = ['timestamp', 'level', 'message', '_object', 'annotate', 'reformat', 'data', 'isBoom', 'isServer', 'isJoi'];
    const objectProperties = ['details', 'output'];

    if (info.message as string | object instanceof Object) {
        return `${info.timestamp} ${info.level} ${JSON.stringify(info.message)} : ${info.stack || ''}`;
    } else {
        let output = `${info.timestamp} ${info.level} ${info.message}`;
        for (const prop of properties) {
            if (ignoredProperties.includes(prop)) {
                continue;
            }

            if (objectProperties.includes(prop)) {
                output += ` ${prop}: ${JSON.stringify(info[prop])}`;
            } else {
                output += ` ${prop}: ${info[prop]}`;
            }
        }
        return output;
    }
});

export const appLogger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(
            {
                level: config.logLevel,
                format: winston.format.combine(
                    winston.format.colorize(),
                    consoleErrorStackFormat
                )
            }
        ),
        new WinstonDailyRotateFile(
            {
                filename: `${config.logDirectory}/app-%DATE%.log`,
                datePattern: 'YYYY-MM-DD'
            }
        )
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});