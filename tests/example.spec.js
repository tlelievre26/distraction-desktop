//Integration tests
import { test, _electron as electron } from "@playwright/test";


test('launch app', async() => {
  const electronApp = await electron.launch({ args: ["electron/main.js"] })

  await electronApp.close()
})