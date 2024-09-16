const log = require('electron-log/main')
const util = require('node:util')

const log_level = process.env.LOG_LEVEL ?? 'info'

log.transports.console.level = log_level
log.transports.console.format = ({ data, level, message }) => {
    let text;
    if(data.length > 1) {
        text = `${data[0]}\n${JSON.stringify(data[1], null, " ")}`
    }
    else {
        text = util.format(...data)
    }
    
    return [
      `*** ${message.date.toISOString().slice(11, -1)}`,
      `[${level}]`,
      text
    ];
  };
  
module.exports = log