import log4js from 'log4js';
import config from '../config/config.js';

log4js.configure({
  appenders: {
    // consola: { type: 'console' },
    archivoEventos: { type: 'file', filename: 'evento.log' },
    archivoErrores: { type: 'file', filename: 'error.log' },
    archivoWarning: { type: 'file', filename: 'warning.log' },
    loggerArchivoEventos: {
      //loggerConsola: {  
      type: 'logLevelFilter',
      appender: 'archivoEventos',
      //appender: 'consola',
      level: 'info',
    },
    loggerArchivoWarning: {
      type: 'logLevelFilter',
      appender: 'archivoWarning',
      level: 'warn',
    },
    loggerArchivoErrores: {
      type: 'logLevelFilter',
      appender: 'archivoErrores',
      level: 'error',
    }
  },
  categories: {
    default: {
      appenders: ['loggerArchivoEventos', 'loggerArchivoErrores', 'loggerArchivoWarning'],
      level: 'all',
    },
    prod: {
      appenders: ['loggerArchivoEventos', 'loggerArchivoErrores', 'loggerArchivoWarning'],
      level: 'all',
    },
  },
})

let logger = null

if (config.NODE_ENV === 'production') {
  logger = log4js.getLogger('prod')
} else {
  logger = log4js.getLogger()
}


export default logger;