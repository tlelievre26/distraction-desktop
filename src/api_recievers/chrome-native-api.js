const readline = require('readline');

// Helper function to send a message back to the Chrome extension
const sendMessage = (message) => {
  const jsonMessage = JSON.stringify(message);
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(Buffer.byteLength(jsonMessage), 0);
  process.stdout.write(lengthBuffer);
  process.stdout.write(jsonMessage);
};

// Set up reading from stdin (input from Chrome extension)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Listen for incoming messages
rl.on('line', (input) => {
  // const length = input.length;
  console.log("IM WORKING!");
  const message = JSON.parse(input.toString());
  console.log('Received message:', message);

  // Respond with a simple message
  sendMessage({ response: "Hello from Node.js native app", data: message });
});

// Handle process termination
rl.on('close', () => {
  console.log('Native app exiting...');
  process.exit(0);
});
