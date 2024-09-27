const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const message = JSON.parse(input.toString());
  console.log('Received message:', message);
  
  // Respond with a simple message
//   sendMessage({ response: "Hello from Node.js native app", data: message });
});

rl.on('close', () => {
  console.log('Native app exiting...');
  process.exit(0);
});