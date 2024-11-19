// tests/e2e/setup/testConfig.js
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function setupDriver() {
  // Configure Chrome options
  const options = new chrome.Options();

  // Add any needed Chrome options
  // options.addArguments('--headless'); // Uncomment to run in headless mode
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  // Create and return the driver
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}

module.exports = {
  setupDriver,
};
