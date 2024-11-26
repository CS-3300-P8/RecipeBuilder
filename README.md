# **Recipe Finder with AI-Powered Ingredient Matching**

This web application allows users to input ingredients they have at home and receive potential recipes that can be made. If all the ingredients are not available for an exact match, the system suggests "near" recipes and provides AI-powered ingredient substitutions.

---
## ** Website Link**

https://client-dot-round-office-437918-e3.ue.r.appspot.com/

## **Release Notes**

### **New Features**

- **Ingredient Input & Recipe Matching**: Users can input available ingredients and receive recipes with exact matches.
- **AI-Powered Substitutions**: Automatically suggests replacements for missing ingredients.
- **Near Recipe Suggestions**: Suggests recipes even when not all ingredients are available.
- **Recipe Filtering**: Enables filtering by cuisine, dietary restrictions, and preparation time.

### **Bug Fixes**

- Fixed an issue where certain recipe matches returned incorrect results.
- Resolved API timeout issues with the OpenAI integration.
- Addressed a bug where recipe filtering did not apply properly to dietary restrictions.

### **Known Bugs and Defects**

- Some substitutions may not account for dietary restrictions.
- Rare cases where duplicate "near" recipes are displayed.
- Limited recipes for niche dietary requirements (e.g., keto).

**Planned Improvements**:

- Expand substitution database for more dietary-specific recommendations.
- Implement user feedback for recipe accuracy.

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

### **Prerequisites**

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB server

### **Dependencies**

The following libraries are required:

- React.js
- Express.js
- TensorFlow.js

### **Download & Build Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/CS-3300-P8/RecipeBuilder.git
   ```
2. Navigate to the project directory:
   ```bash
   cd RECIPEBUILDER
   ```

### **Install Dependencies**

Install required packages for both client and server:

```bash
cd client
npm install
cd ../server
npm install
```

### **Application Installation & Run**

1. Start the development servers:
   - In the `server` directory:
     ```bash
     npm run dev
     ```
   - In the `client` directory:
     ```bash
     npm run dev
     ```
2. Set up API Key:  
   Add your OpenAI API key in the `.env` file under `client`:
   ```bash
   VITE_REACT_APP_OPENAI_API_KEY=your-key-here
   ```

---

## **Troubleshooting**

### **Common Issues & Solutions**

1. **Blank Screen in Client App**:

   - Ensure the OpenAI API key is configured correctly in `.env`.
   - Restart the client after changes using:
     ```bash
     npm run dev
     ```

2. **Server Crashing**:

   - Confirm MongoDB is running locally or provide a valid connection string in the `.env` file.

3. **Missing Dependencies**:
   - Reinstall dependencies with:
     ```bash
     npm install
     ```

### **FAQs**

- **Q:** Can I use this without an OpenAI API key?  
  **A:** No, the AI-powered substitution feature requires a valid API key.

- **Q:** How can I report a bug?  
  **A:** Open an issue on our GitHub repository.

---

## **Design Patterns**

- **Factory Pattern**: Dynamically creates recipe objects based on user input.
- **Observer Pattern**: Notifies users when no exact recipe matches are found.
- **Strategy Pattern**: Applies filters (e.g., dietary restrictions, cuisine type) to recipe searches.

---

## **Testing Strategy**

The project includes comprehensive testing:

- **Unit Testing**: For individual functions, using Jest and Mocha.
- **Integration Testing**: Ensures frontend and backend work together, using Postman and Supertest.
- **System Testing**: Verifies complete functionality, using Selenium for browser-based tests.

**AI-Specific Testing**

- **Blackbox Testing**: Tests input/output behavior of AI-powered substitutions.
- **Whitebox Testing**: Debugs internal logic for substitutions using TensorFlow.

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
