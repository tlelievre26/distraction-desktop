const log = require('electron-log/main');

const logLevel = process.env.LOG_LEVEL ?? 'info';

log.transports.console.level = logLevel;
log.transports.console.format = ({ data, level, message }) => {
  const text = data.map((text) => JSON.stringify(text, null, " ")).join('\n');
    
  return [
    `*** ${message.date.toISOString().slice(11, -1)}`,
    `[${level}]`,
    text
  ];
};
  
module.exports = log;