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
