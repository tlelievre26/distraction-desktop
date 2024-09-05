//Integration tests
import { test, _electron as electron } from "@playwright/test";
import path from "path";


test('launch app', async() => {
  const electronApp = await electron.launch({ args: [path.join("electron","main.js")] })

  await electronApp.close()
})