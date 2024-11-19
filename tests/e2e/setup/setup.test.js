// tests/e2e/setup/setup.test.js

const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

describe("Selenium Setup Test", () => {
  let driver;

  beforeAll(async () => {
    try {
      const options = new chrome.Options();
      // options.addArguments('--headless'); // Optional: run in headless mode

      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
    } catch (error) {
      console.error("Error setting up WebDriver:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (driver) {
      try {
        await driver.quit();
      } catch (error) {
        console.error("Error closing WebDriver:", error);
      }
    }
  });

  test("should load the application", async () => {
    try {
      await driver.get("http://localhost:5173"); // Make sure your app is running on this port
      const title = await driver.getTitle();
      console.log("Page title:", title);
      expect(title).toBeDefined();
    } catch (error) {
      console.error("Error in test:", error);
      throw error;
    }
  });
});
