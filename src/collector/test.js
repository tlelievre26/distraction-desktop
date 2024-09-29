const getCurrentAppName = require('./collector.js');
const setCallback = require('./focus-event.js');

while(1)
{
  //console.log("Return val: " + setCallback());
  setCallback();
}