// tests/e2e/ingredient-search.test.js

const { Builder, By, until } = require("selenium-webdriver");
const { setupDriver } = require("./setup/testConfig");

describe("Ingredient Search Functionality - Black Box Testing", () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver();
    await driver.get("http://localhost:5173/ingredient-search");
    // Wait for page title to load
    await driver.wait(
      until.elementLocated(By.xpath("//h1[text()='Find Ingredients']")),
      5000,
      "Page title not found"
    );
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  // Test Case 1: Verify Page Structure
  it("should display correct page title and description", async () => {
    const title = await driver.findElement(By.xpath("//h1")).getText();
    expect(title).toBe("Find Ingredients");

    const description = await driver
      .findElement(By.xpath("//p[contains(text(), 'Search for ingredients')]"))
      .getText();
    expect(description).toBe(
      "Search for ingredients to add to your virtual pantry"
    );
  });

  // Test Case 2: Search Bar Functionality
  it("should have a functional search bar and button", async () => {
    const searchInput = await driver.findElement(
      By.css('input[placeholder="Search ingredients..."]')
    );
    expect(await searchInput.getAttribute("placeholder")).toBe(
      "Search ingredients..."
    );

    const searchButton = await driver.findElement(
      By.xpath("//button[text()='Search']")
    );
    expect(await searchButton.isEnabled()).toBe(true);
  });

  // Test Case 3: Recent Searches Display
  it("should display default recent searches correctly", async () => {
    const recentSearchesTitle = await driver
      .findElement(By.xpath("//h2[text()='Recent Searches']"))
      .getText();
    expect(recentSearchesTitle).toBe("Recent Searches");

    const defaultSearches = ["Tomatoes", "Chicken", "Rice", "Eggs"];
    for (const search of defaultSearches) {
      const searchElement = await driver.findElement(
        By.xpath(`//*[text()='${search}']`)
      );
      expect(await searchElement.isDisplayed()).toBe(true);
    }
  });

  // Test Case 4: Results Section
  it("should display results section with initial message", async () => {
    const resultsTitle = await driver
      .findElement(By.xpath("//h2[text()='Results']"))
      .getText();
    expect(resultsTitle).toBe("Results");

    const initialMessage = await driver
      .findElement(By.xpath("//*[contains(text(), 'Start typing to search')]"))
      .getText();
    expect(initialMessage).toBe("Start typing to search for ingredients");
  });

  // Test Case 5: Search Functionality
  it("should perform search and display results", async () => {
    const searchInput = await driver.findElement(
      By.css('input[placeholder="Search ingredients..."]')
    );
    await searchInput.sendKeys("tomato");

    const searchButton = await driver.findElement(
      By.xpath("//button[text()='Search']")
    );
    await searchButton.click();

    // Wait for results to appear (either loading state or results)
    await driver.wait(
      async () => {
        const bodyText = await driver.findElement(By.css("body")).getText();
        return (
          bodyText.includes("Searching...") || bodyText.includes("Results")
        );
      },
      5000,
      "No response to search"
    );
  });

  // Test Case 6: Navigation Links
  it("should have working navigation links", async () => {
    const virtualPantryLink = await driver.findElement(
      By.xpath("//a[text()='Virtual Pantry']")
    );
    expect(await virtualPantryLink.isDisplayed()).toBe(true);

    const ingredientSearchLink = await driver.findElement(
      By.xpath("//a[text()='Ingredient Search']")
    );
    expect(await ingredientSearchLink.isDisplayed()).toBe(true);
  });

  // Test Case 7: Recent Search Interaction
  it("should allow clicking on recent searches", async () => {
    const recentSearch = await driver.findElement(
      By.xpath("//*[text()='Tomatoes']")
    );
    await recentSearch.click();

    // Verify the search input is updated
    const searchInput = await driver.findElement(
      By.css('input[placeholder="Search ingredients..."]')
    );
    const inputValue = await searchInput.getAttribute("value");
    expect(inputValue.toLowerCase()).toBe("tomatoes");
  });
});
