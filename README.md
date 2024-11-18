---
# **Recipe Finder with AI-Powered Ingredient Matching**

This web application allows users to input ingredients they have at home and receive potential recipes that can be made. If all the ingredients are not available for an exact match, the system suggests "near" recipes and provides AI-powered ingredient substitutions.
---

## **Features**

1. **Ingredient Input & Recipe Matching**

   - Enter ingredients you have at home.
   - Receive recipes that match those ingredients.

2. **Near Recipe Suggestions**

   - Get alternative "near" recipes if you’re missing some ingredients.
   - View AI-generated ingredient substitutions based on availability.

3. **Recipe Filtering**

   - Filter recipes by cuisine type, dietary restrictions, or preparation time.

4. **AI-Powered Ingredient Substitutions**
   - Suggests substitutions for missing ingredients based on similarity.
   - Example: Use yogurt as a substitute for sour cream.

---

## **Technology Stack**

- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **AI Tool:** TensorFlow (for AI-powered ingredient substitutions)
- **Version Control:** GitHub
- **Deployment:** Google Cloud Platform (GCP)

---

## **Project Setup**

To run the project:

1. **Install Dependencies**  
   Ensure you have Node.js installed. Navigate to both the `client` and `server` directories, and run the following command in each to install the necessary dependencies:  
   ```bash
   npm install
   ```
   ```bash
   npm install express
   ```

2. **Start Development Servers**  
   After installing dependencies, start the development servers:
   In the server directory, run:
   
   ```bash
   npm run dev
   ```

   In the client directory, run:
   ```bash
   npm run dev
   ```

3. **Set Up API Key**  
   The client application requires an OpenAI API key to function. In the IngredientSearchPage.jsx file, ensure the apiKey is set to your personal OpenAI token on this line:
   ```bash
   apiKey: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,
   ```
   Replace import.meta.env.VITE_REACT_APP_OPENAI_API_KEY with your actual API key if not using environment variables.
   
   Note: The client will display a blank page until a valid API key is provided.



---

## **Design Patterns**

- **Factory Pattern:** Used to dynamically create recipe objects based on user input.
- **Observer Pattern:** Notifies users when no exact recipe matches are found, prompting "near" recipes.
- **Strategy Pattern:** Applies filters (e.g., dietary restrictions, cuisine type) to recipe searches.

---

## **Testing Strategy**

The project includes comprehensive testing:

- **Unit Testing:** For individual functions, using Jest and Mocha.
- **Integration Testing:** Ensures frontend and backend work together, using Postman and Supertest.
- **System Testing:** Verifies complete functionality, using Selenium for browser-based tests.
- **AI Integration for Testing:**
  - **Blackbox Testing:** Uses AI tools like Functionize to test user input/output behavior.
  - **Whitebox Testing:** Tests internal logic, especially for AI-powered substitutions, using GitHub Copilot and TensorFlow debugging features.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

---

## **License**

This project is licensed under the MIT License.

---
