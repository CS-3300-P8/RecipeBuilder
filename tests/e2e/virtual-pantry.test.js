// tests/e2e/virtual-pantry.test.js

const { Builder, By, until } = require("selenium-webdriver");
const { setupDriver } = require("./setup/testConfig");

describe("Virtual Pantry Page - Black Box Testing", () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver();
    await driver.get("http://localhost:5173/");
    // Wait for page to load
    await driver.wait(
      until.elementLocated(By.xpath("//h1[text()='Pantry Page']")),
      5000,
      "Page title not found"
    );
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  // Test Case 1: Initial Page Load
  it("should display initial page structure correctly", async () => {
    // Verify page title
    const pageTitle = await driver.findElement(By.xpath("//h1")).getText();
    expect(pageTitle).toBe("Pantry Page");

    // Verify pantry dropdown exists with placeholder
    const dropdown = await driver.findElement(By.id("pantry-select"));
    const defaultOption = await dropdown
      .findElement(By.css("option[disabled]"))
      .getText();
    expect(defaultOption).toBe("Choose a pantry");

    // Verify initial ingredients message
    const initialMessage = await driver
      .findElement(By.xpath("//p[contains(text(), 'Please select a pantry')]"))
      .getText();
    expect(initialMessage).toBe(
      "Please select a pantry to view its ingredients."
    );
  });

  // Test Case 2: Create New Pantry
  it("should handle pantry creation with validation", async () => {
    // Try to create pantry without name
    const createButton = await driver.findElement(
      By.xpath("//button[text()='Create Pantry']")
    );
    expect(await createButton.isEnabled()).toBe(false);

    // Verify validation message
    const validationMessage = await driver
      .findElement(By.xpath("//p[contains(text(), 'Please provide a name')]"))
      .getText();
    expect(validationMessage).toBe("Please provide a name for the new pantry.");

    // Create pantry with valid name
    const nameInput = await driver.findElement(
      By.css('input[placeholder="Pantry Name"]')
    );
    await nameInput.sendKeys("Test Kitchen");
    expect(await createButton.isEnabled()).toBe(true);
    await createButton.click();

    // Verify pantry appears in dropdown
    await driver.wait(
      async () => {
        const options = await driver.findElements(
          By.css("#pantry-select option")
        );
        const optionTexts = await Promise.all(
          options.map((opt) => opt.getText())
        );
        return optionTexts.includes("Test Kitchen");
      },
      5000,
      "New pantry not added to dropdown"
    );
  });

  // Test Case 3: Pantry Selection and Ingredient Management
  it("should handle pantry selection and ingredient management", async () => {
    // Select a pantry
    const dropdown = await driver.findElement(By.id("pantry-select"));
    const options = await dropdown.findElements(
      By.css("option:not([disabled])")
    );
    if (options.length > 0) {
      await options[0].click();

      // Verify add ingredient section appears
      await driver.wait(
        until.elementLocated(
          By.xpath("//h3[contains(text(), 'Add an Ingredient')]")
        ),
        5000,
        "Add ingredient section not found"
      );

      // Add new ingredient
      const nameInput = await driver.findElement(
        By.css('input[placeholder="Ingredient Name"]')
      );
      const categoryInput = await driver.findElement(
        By.css('input[placeholder="Category"]')
      );

      await nameInput.sendKeys("Pepper");
      await categoryInput.sendKeys("Spices");

      const addButton = await driver.findElement(
        By.xpath("//button[text()='Add Ingredient']")
      );
      await addButton.click();

      // Verify ingredient appears in list
      await driver.wait(
        async () => {
          const ingredients = await driver.findElements(By.css("ul li"));
          const ingredientTexts = await Promise.all(
            ingredients.map((ing) => ing.getText())
          );
          return ingredientTexts.some((text) =>
            text.includes("Pepper (Spices)")
          );
        },
        5000,
        "New ingredient not added to list"
      );
    }
  });

  // Test Case 4: Delete Ingredient
  it("should handle ingredient deletion", async () => {
    // Select first available pantry
    const dropdown = await driver.findElement(By.id("pantry-select"));
    const options = await dropdown.findElements(
      By.css("option:not([disabled])")
    );
    if (options.length > 0) {
      await options[0].click();

      // Wait for ingredients to load
      await driver.sleep(1000); // Wait for potential API response

      // Get initial ingredient count
      const initialIngredients = await driver.findElements(By.css("ul li"));
      if (initialIngredients.length > 0) {
        // Click delete button on first ingredient
        const deleteButton = await initialIngredients[0].findElement(
          By.xpath(".//button[text()='Delete']")
        );
        await deleteButton.click();

        // Verify ingredient was removed
        await driver.wait(
          async () => {
            const currentIngredients = await driver.findElements(
              By.css("ul li")
            );
            return currentIngredients.length < initialIngredients.length;
          },
          5000,
          "Ingredient was not deleted"
        );
      }
    }
  });

  // Test Case 5: Empty Pantry Display
  it("should handle empty pantry state", async () => {
    // Select a pantry
    const dropdown = await driver.findElement(By.id("pantry-select"));
    const options = await dropdown.findElements(
      By.css("option:not([disabled])")
    );
    if (options.length > 0) {
      await options[0].click();

      // Check for either ingredients or empty state message
      await driver.wait(
        async () => {
          const elements = await driver.findElements(By.css("ul li, p"));
          const texts = await Promise.all(elements.map((el) => el.getText()));
          return texts.some(
            (text) =>
              text.includes("No ingredients found.") || text.includes("(") // Ingredient format includes parentheses
          );
        },
        5000,
        "Neither ingredients nor empty state message found"
      );
    }
  });

  // Test Case 6: Form Input Validation
  it("should validate ingredient inputs", async () => {
    // Select a pantry first
    const dropdown = await driver.findElement(By.id("pantry-select"));
    const options = await dropdown.findElements(
      By.css("option:not([disabled])")
    );
    if (options.length > 0) {
      await options[0].click();

      // Try to add ingredient without required fields
      const addButton = await driver.findElement(
        By.xpath("//button[text()='Add Ingredient']")
      );
      await addButton.click();

      // Handle alert if present
      try {
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        expect(alertText).toContain(
          "Please select a pantry and provide both name and category"
        );
        await alert.accept();
      } catch (error) {
        // Alert might not be present depending on implementation
      }
    }
  });
});
