import { createLogger, format, transports } from 'winston';

import { AppConfig } from '../config';

const { LOG_PATH, LOG_ERROR_PATH, SERVICE_NAME } = AppConfig;
const PIPE_SEPARATOR = '|';
export const PIPE_SEPARATOR_WITH_SPACES = ` ${PIPE_SEPARATOR} `;
const COLON_SEPARATOR = ':';
const { colorize, combine, printf, timestamp } = format;

const logFormat = printf(({ level, message, module, timestamp }) => {
  const name = [SERVICE_NAME, module].filter(Boolean).join(COLON_SEPARATOR);
  return `${timestamp} [${name}] ${level}: ${message}`;
});

const transportError = new transports.File({
  filename: LOG_ERROR_PATH,
  level: 'error',
});
const transportCombined = new transports.File({
  filename: LOG_PATH,
});
const transportConsole = new transports.Console({
  format: combine(colorize(), timestamp(), logFormat),
});

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), format.json()),
  transports: [transportError, transportCombined],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(transportConsole);
}
