//Integration tests
const { test, _electron: electron } = require("@playwright/test");
const path = require("path");


test('launch app', async() => {
  const electronApp = await electron.launch({ args: [path.join("electron","main.js")] })

  await electronApp.close()
})