const log = require('electron-log/main');

const logLevel = process.env.LOG_LEVEL ?? 'info';

log.transports.console.level = logLevel;
log.transports.console.format = '*** [{h}:{i}:{s}.{ms}] [{level}]:   {text}';  

module.exports = log;