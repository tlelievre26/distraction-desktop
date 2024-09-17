//Integration tests
const path = require("path");

const { test, _electron: electron } = require("@playwright/test");


test('launch app', async() => {
  const electronApp = await electron.launch({ args: [path.join("src","main.js")] });

  await electronApp.close();
});