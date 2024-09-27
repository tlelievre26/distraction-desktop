//Just including this file as an example so that git tracks the directory structure
const log = require('../util/logger');

exports.beginSession = (_event, _time) => {
  log.debug("Beginning data gathering");
};

exports.endSession = (_event) => {
  log.debug("Ending data gathering");
};
