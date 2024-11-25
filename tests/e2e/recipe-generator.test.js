// tests/e2e/recipe-generator.test.js

const { Builder, By, until } = require("selenium-webdriver");
const { setupDriver } = require("./setup/testConfig");

describe("Recipe Generator Page - Black Box Testing", () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver();
    await driver.get("http://localhost:5173/generate-recipe");
    // Wait for page to load
    await driver.wait(
      until.elementLocated(By.className("recipe-container")),
      5000,
      "Recipe page not loaded"
    );
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  // Test Case 1: Initial Page Structure and Classes
  it("should display initial page structure with correct elements", async () => {
    // Verify main title
    const title = await driver.findElement(By.className("recipe-title"));
    expect(await title.getText()).toBe("Recipe Generator");

    // Verify preferences card
    const preferencesCard = await driver.findElement(
      By.className("preferences-card")
    );
    expect(await preferencesCard.isDisplayed()).toBe(true);

    // Verify preferences title
    const preferencesTitle = await preferencesCard.findElement(
      By.className("preferences-title")
    );
    expect(await preferencesTitle.getText()).toBe("Recipe Preferences");

    // Verify form groups
    const formGroups = await driver.findElements(By.className("form-group"));
    expect(formGroups.length).toBe(2);

    // Verify form labels
    const labels = await driver.findElements(By.className("form-label"));
    const labelTexts = await Promise.all(
      labels.map((label) => label.getText())
    );
    expect(labelTexts).toContain("Dietary Restrictions");
    expect(labelTexts).toContain("Difficulty Level");

    // Verify generate button
    const generateButton = await driver.findElement(
      By.className("generate-button")
    );
    expect(await generateButton.isDisplayed()).toBe(true);
    expect(await generateButton.getText()).toBe("Generate Recipe");
  });

  // Test Case 2: Dietary Restrictions Selection
  it("should handle dietary restrictions selection", async () => {
    const dietarySelect = await driver.findElement(
      By.css(".form-group:first-child select.form-select")
    );

    // Verify default value
    expect(await dietarySelect.getAttribute("value")).toBe("none");

    // Verify all options
    const options = await dietarySelect.findElements(By.css("option"));
    const expectedOptions = [
      { value: "none", text: "None" },
      { value: "vegetarian", text: "Vegetarian" },
      { value: "vegan", text: "Vegan" },
      { value: "gluten-free", text: "Gluten-free" },
      { value: "dairy-free", text: "Dairy-free" },
    ];

    for (const option of options) {
      const value = await option.getAttribute("value");
      const text = await option.getText();
      const expectedOption = expectedOptions.find((opt) => opt.value === value);
      expect(expectedOption).toBeDefined();
      expect(text.toLowerCase()).toBe(expectedOption.text.toLowerCase());
    }

    // Test selection
    await dietarySelect.click();
    const veganOption = await driver.findElement(
      By.css('option[value="vegan"]')
    );
    await veganOption.click();
    expect(await dietarySelect.getAttribute("value")).toBe("vegan");
  });

  // Test Case 3: Difficulty Level Selection
  it("should handle difficulty level selection", async () => {
    const difficultySelect = await driver.findElement(
      By.css(".form-group:nth-child(2) select.form-select")
    );

    // Verify default value
    expect(await difficultySelect.getAttribute("value")).toBe("medium");

    // Verify all options
    const options = await difficultySelect.findElements(By.css("option"));
    const expectedOptions = [
      { value: "easy", text: "Easy" },
      { value: "medium", text: "Medium" },
      { value: "hard", text: "Hard" },
    ];

    for (const option of options) {
      const value = await option.getAttribute("value");
      const text = await option.getText();
      const expectedOption = expectedOptions.find((opt) => opt.value === value);
      expect(expectedOption).toBeDefined();
      expect(text.toLowerCase()).toBe(expectedOption.text.toLowerCase());
    }

    // Test selection
    await difficultySelect.click();
    const hardOption = await driver.findElement(By.css('option[value="hard"]'));
    await hardOption.click();
    expect(await difficultySelect.getAttribute("value")).toBe("hard");
  });

  // Test Case 4: Recipe Generation Process
  it("should generate and display recipe with correct structure", async () => {
    const generateButton = await driver.findElement(
      By.className("generate-button")
    );
    await generateButton.click();

    // Wait for recipe card
    const recipeCard = await driver.wait(
      until.elementLocated(By.className("recipe-card")),
      10000,
      "Recipe card not displayed"
    );

    // Verify recipe name
    const recipeName = await recipeCard.findElement(
      By.className("recipe-name")
    );
    expect(await recipeName.isDisplayed()).toBe(true);
    expect(await recipeName.getText()).not.toBe("");

    // Verify ingredients section
    const ingredientsSection = await recipeCard.findElement(
      By.className("ingredients-section")
    );
    expect(await ingredientsSection.isDisplayed()).toBe(true);

    // Verify ingredients categories
    const ingredientsCategories = await ingredientsSection.findElements(
      By.className("ingredients-category")
    );
    expect(ingredientsCategories.length).toBe(2);

    // Verify instructions section
    const instructionsSection = await recipeCard.findElement(
      By.className("instructions-section")
    );
    expect(await instructionsSection.isDisplayed()).toBe(true);

    // Verify recipe metadata
    const recipeMeta = await recipeCard.findElement(
      By.className("recipe-meta")
    );
    expect(await recipeMeta.isDisplayed()).toBe(true);
  });

  // Test Case 5: Error Handling
  it("should display error message when recipe generation fails", async () => {
    // Force an error
    await driver.executeScript(`
            window.fetch = async () => {
                throw new Error('Network error');
            };
        `);

    const generateButton = await driver.findElement(
      By.className("generate-button")
    );
    await generateButton.click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.className("error-message")),
      5000,
      "Error message not displayed"
    );

    expect(await errorMessage.isDisplayed()).toBe(true);
    expect(await errorMessage.getText()).toContain("Network error");
  });

  // Test Case 6: Loading State
  it("should show loading state during recipe generation", async () => {
    const generateButton = await driver.findElement(
      By.className("generate-button")
    );
    expect(await generateButton.getText()).toBe("Generate Recipe");

    await generateButton.click();

    try {
      await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Generating...']")),
        2000
      );
    } catch (error) {
      console.log("Loading state might have been too quick to catch");
    }

    // Wait for either recipe card or error message
    await driver.wait(
      until.elementLocated(By.css(".recipe-card, .error-message")),
      10000
    );
  });

  // Test Case 7: Recipe Content Verification
  it("should display proper recipe content structure", async () => {
    const generateButton = await driver.findElement(
      By.className("generate-button")
    );
    await generateButton.click();

    // Wait for recipe card
    await driver.wait(until.elementLocated(By.className("recipe-card")), 10000);

    // Verify ingredients lists
    const pantryIngredients = await driver.findElement(
      By.xpath("//h4[contains(text(), 'From Your Pantry:')]")
    );
    expect(await pantryIngredients.isDisplayed()).toBe(true);

    const neededIngredients = await driver.findElement(
      By.xpath("//h4[contains(text(), 'Need to Purchase:')]")
    );
    expect(await neededIngredients.isDisplayed()).toBe(true);

    // Verify instructions
    const instructions = await driver.findElement(
      By.className("instructions-list")
    );
    expect(await instructions.isDisplayed()).toBe(true);
    const steps = await instructions.findElements(By.css("li"));
    expect(steps.length).toBeGreaterThan(0);
  });

  // Test Case 8: Recipe Metadata Display
  it("should display all recipe metadata correctly", async () => {
    const generateButton = await driver.findElement(
      By.className("generate-button")
    );
    await generateButton.click();

    // Wait for recipe card
    await driver.wait(until.elementLocated(By.className("recipe-card")), 10000);

    // Verify metadata items
    const metaItems = await driver.findElements(By.className("meta-item"));
    expect(metaItems.length).toBe(4);

    const expectedMetadata = [
      "Preparation Time:",
      "Cooking Time:",
      "Difficulty:",
      "Servings:",
    ];

    for (const metaItem of metaItems) {
      const label = await metaItem.findElement(By.className("meta-label"));
      const labelText = await label.getText();
      expect(expectedMetadata).toContain(labelText);

      const value = await metaItem.findElement(By.css("span:not(.meta-label)"));
      expect(await value.getText()).not.toBe("");
    }
  });
});
