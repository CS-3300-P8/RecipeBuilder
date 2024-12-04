# Background
The RecipeBuilder application's concept began as an idea to use the power of GPT-4o to devise recipes using leftover ingredients and avoid food waste. Following an expansion of scope, the application also encompassed the management of ingredient lists (called pantries), the ability to search for new ingredients, the ability to apply dietary restrictions, style preferences, meal types, and preparation difficulties to generated recipes, and the ability to suggest additional ingredients if the given ones are not enough to cook something coherent. We aimed to implement all aspects of a web application that could perform these tasks quickly, cheaply, intuitively, and effectively. We also chose to limit our scope to a single user, with no login screen involved, to focus more on the features of the application.

Our next step in planning the project was choosing a management approach. As we had worked together on the first project and had no problems with the Agile method used previously, we decided that it would be best to use a similar methodology in this project. For each large task, each individual was assigned to a part of it, and we reconvened later in the week to discuss whether that portion of the task had been completed and merge the parts together, whether by reviewing a document or integrating code.

When we were considering our tech stack, we immediately chose to use React.js again when implementing our frontend, as we were all experienced with it and found it to be easy to use in Project 1. However, frustrations with implementing the backend with Springboot lead us to switch to Node.js and Express.js. We also identified the need for a database technology to store all of our ingredient lists as opposed to static on-server storage within a variable and chose MongoDB. In addition, we had to use the OpenAI API to generate recipes, as well as the Google Cloud Platform to deploy the application.

When looking at existing implementations of this rough idea, we found many sites implementing the same recipe generation function as we were. In fact, a large part of our choice to add MMF 4, the recipe tuning, was because we saw another site with the same types of options and decided it would be useful for our implementation as well. Our application mainly differs in its ability to store ingredients. The RecipeBuilder's virtual pantries differ from anything any other recipe generator has to offer.

# Technologies
## Tech Stack
The RecipeBuilder project utilized a strong technology stack designed to balance functionality, scalability, and user experience. Key technologies included React for the frontend, providing a responsive and interactive user interface, and Node.js for the backend, ensuring fast and efficient server-side operations. The project employed MongoDB as the database for flexible and scalable data storage, ideal for managing complex ingredient and recipe data. Deployment was handled through Google Cloud Platform (GCP) to ensure reliable hosting and seamless scalability. Version control was maintained using GitHub, facilitating collaboration and efficient project management.

## AI Integration
For AI integration, tools like Codeium and Postbot were selected to streamline development and testing processes. Codeium was employed for white-box testing, leveraging its automated test case generation and debugging capabilities, which significantly reduced the time spent on manual test creation. Postbot was used for black-box API testing, automating response validation and regression testing. These tools were chosen based on their proven ability to enhance productivity and coverage in previous projects. Additionally, the team incorporated design patterns such as Singleton for managing database connections, Factory for dynamic object creation, and Observer for event handling, ensuring adherence to software engineering best practices.

## Rationale
The rationale for selecting these technologies and tools centered on their compatibility with project requirements and their potential to increase learning results. React and Node.js provided a seamless development experience, while MongoDB’s flexibility supported the dynamic nature of ingredient and recipe data. The AI tools, particularly Codeium, were chosen for their ability to identify gaps in traditional testing methods and improve efficiency, aligning with the project’s goal of integrating advanced software engineering techniques. This combination of technologies and design patterns ensured a robust and maintainable solution.

# Requirements
## MMFs
For this project, we chose four Minimum Marketable Features (MMFs) to focus on, and based the vast majority of our development around polishing these. These were the basic features required to implement our application in any usable capacity.
1. An interactive virtual pantry that can list and categorize a user's ingredients.
This took the form of a page in which users were capable of creating new ingredient lists (pantries), viewing the ingredients within each one, adding and removing ingredients manually, and deleting a pantry itself.
2. An AI-powered ingredient search that can suggest ingredients based on a user's query.
This took the form of a page in which users could input the name of an ingredient and receive an AI-generated category for that ingredient as well as three related ingredients.
3. An AI-powered recipe generator that can derive a recipe from a user's available ingredients.
This took the form of a page that would send an engineered prompt to the OpenAI API from the backend that would query a recipe using a pantry's ingredients.
4. An interface to tune a recipe's generation based on dietary restrictions, style, meal type, and difficulty.
This took the form of several dropdowns on the recipe generation page that would add additional caveats to the engineered prompt on the backend.

## NFRs
Our project was not at a sufficient scale to require a formal consideration of non-functional requirements beyond basic "sanity checks". This meant the process of identifying these came largely down to common sense, and could be accomplished as long as we avoided any egregious inefficiencies in our code.
* Performance: Direct backend queries should not take more than 100 ms to execute
* Reliability: Application should be available during demo time
* Scalability: The project was built to handle one user, and therefore does not scale
* Compatibility: This application should support all modern browsers and all backend environments through containerization.
* Capacity: The user data stored in the database will, at most, be 1 MB in total, as text information is highly dense.

Once we had our requirements outlined, we mainly focused on the MMFs, as the NFRs were, as predicted, trivial to meet. However, we had the policy of prioritizing the NFRs, because if they were found to have gone unmet in any version of the code, it indicated a serious issue that needed urgent attention.

In terms of the MMFs, we completed the virtual pantry function first, as the other functions depended strictly on its existence to be implemented in a meaningful way. Once we had completed that, we were free to pursue the second MMF and the combination of the third and fourth in parallel. 
# Design
# Design Patterns
## Factory
The first pattern we decided to implement was the Factory pattern in our backend code. We made this decision when it became apparent that the AI-related code was significantly different from the pantry operations, and was causing a great deal of clutter. It enabled us to delegate the responsibility of handling endpoints that would query the OpenAI API to a specific object, letting the rest of the code focus more on pantry management. It also allowed us to streamline the assembly of API queries. This made the project's backend simpler to manage by way of keeping the focus of each file abundantly clear. If anyone wanted to adjust the AI's prompts, they would know exactly where to look, and would not have to alter the functionality of the base file.

![The factory's internal logic to determine what service to create](factory2.png "The factory's internal logic to determine what service to create")

*The factory's internal logic to determine what service to create.*

![The factory being created in the main backend file](factory3.png "The factory being created in the main backend file")

*The factory being created in the main backend file.*

![The API endpoint's use of the factory to generate an executable service](factory4.png "The API endpoint's use of the factory to generate an executable service")

*The API endpoint's use of the factory to generate an executable service.*
## Command
The next pattern that we implemented was the Command pattern in our backend code. We made this decision when it became apparent that our choice of MongoDB was ill-advised, and any extensions of this project would benefit from a switch to something else. It enabled us to separate our own API's endpoints from the execution of database operations. This meant that if we were to, for example, switch to another database management system or add another type of client with different reasons to perform the same database operation, we would not have to copy code. Instead, we could simply call the commands.

![Importing the commands from a folder into the main backend file](command1.png "Importing the commands from a folder into the main backend file")

*Importing the commands from a folder into the main backend file.*

![Using one of the commands in an API endpoint](command2.png "Using one of the commands in an API endpoint")

*Using one of the commands in an API endpoint.*
## Mediator
The final pattern to see implementation was the Mediator pattern on the frontend. We observed that if we wanted to alter the API request format on the frontend, we would have to perform shotgun surgery on every single potential request. Instead, we decided to localize these requests to a single mediator object that could be modified alone. This enabled us to modify API requests in one place. We also decided to implement this as a Singleton, as this would allow the class itself to initialize an instance with an environment variable of the expected API endpoint URL, enabling the rest of the code to more or less ignore context switches.

![](mediator1.png)

*One of the mediator's functions within its class file.*

![](mediator2.png)

*The mediator's function being used within an API call on the frontend.*

# Testing

### Whitebox Testing
- **Tools Used**: Jest for JavaScript testing, Codeium-Windsurf for AI-assisted testing
- **Approach**: Combined traditional unit testing with AI-enhanced testing methods
  - Traditional testing focused on internal components, routing logic, middleware, and state management
  - AI-assisted testing used Codeium to generate test cases and automate code updates
  - Focused on path testing, input validation, state transitions, and API integration
- **Results**:
  - Traditional Method:
    - Server coverage: 65.62%
    - Client coverage: 10.52%
    - Development time: 4 hours
    - Defect detection: 94% pass rate (16/17 test cases)
  - AI-Enhanced Method:
    - Server coverage: 85.21%
    - Client coverage: 49.74%
    - Development time: 2 hours
    - Defect detection: 79.3% pass rate (46/58 test cases)

### Blackbox Testing
- **Tools Used**: Selenium WebDriver for E2E testing, Postbot for API testing
- **Approach**: 
  - Systematic testing of UI components across all major features
  - Static UI verification followed by interactive element testing
  - API endpoint testing using Postman/Postbot
  - Focus on user-facing functionalities and system behaviors
- **Results**:
  - Traditional Method:
    - Development time: 10 hours
    - Test coverage: 100%
    - Required multiple iterations for edge case identification
  - AI-Enhanced Method (Postbot):
    - Development time: 3 hours
    - Test coverage: 100% (excluding OpenAI query endpoints)
    - Limited ability to generate variations of specific requests

### Test Cases

#### Blackbox Test Cases (Manual)

| Test ID | Description | Expected Result | Actual Result | Status |
|---------|-------------|-----------------|---------------|---------|
| BB-1.1 | Verify Ingredient Search page structure | Page displays with title "Find Ingredients" and search description | Page loaded with correct title and description | Pass |
| BB-1.2 | Verify search functionality components | Search bar with placeholder and enabled search button exist | Components present and properly configured | Pass |
| BB-1.3 | Verify recent searches display | Recent searches section shows default items | Default recent searches displayed correctly | Pass |
| BB-1.4 | Test search functionality | Search results or loading state appears | Search executed successfully | Pass |
| BB-2.1 | Verify Virtual Pantry initial state | Page displays with title and empty state message | Page loaded with correct initial state | Pass |
| BB-2.2 | Test pantry creation validation | Validation message shown, button enables, new pantry appears | Validation worked as expected | Pass |
| BB-2.3 | Test ingredient management | Add ingredient form appears, new ingredient shows in list | Ingredient added successfully | Pass |
| BB-2.4 | Test ingredient deletion | Ingredient removed from list | Deletion successful | Pass |
| BB-2.5 | Verify empty pantry handling | "No ingredients found" message displayed | Empty state handled correctly | Pass |
| BB-2.6 | Test ingredient form validation | Validation alert shown | Validation triggered correctly | Pass |
| BB-3.1 | Verify Recipe Generator page structure | Page shows preferences form and generate button | Recipe generator UI loaded correctly | Pass |
| BB-3.2 | Test dietary restrictions selection | Dropdown shows options, selection updates | Dietary preferences handled correctly | Pass |
| BB-3.3 | Test difficulty level selection | Dropdown shows options, selection updates | Difficulty selection working | Pass |
| BB-3.4 | Test recipe generation process | Recipe card displays with all sections | Recipe generated successfully | Pass |
| BB-3.5 | Verify error handling | Error message displays | Error handled properly | Pass |
| BB-3.6 | Test loading states | Button shows "Generating..." during process | Loading state visible | Pass |
| BB-3.7 | Verify recipe content structure | All sections present and properly formatted | Recipe structure correct | Pass |
| BB-3.8 | Verify recipe metadata display | All metadata items present with values | Metadata displayed correctly | Pass |

#### Blackbox Test Cases (AI-Generated)

| Test ID | Description | Expected Result | Actual Result | Status |
|---------|-------------|-----------------|---------------|---------|
| BBAI-4.1 | Verify default pantry | Name is "Default Pantry" with ingredients | Data valid | Pass |
| BBAI-4.2 | Verify adding to pantry | Only Tomatoes added once | Data valid | Pass |
| BBAI-4.3 | Verify removing from pantry | Default pantry returns to normal | Data valid | Pass |
| BBAI-5.1 | Verify pantry creation | New pantry named "foo" created | Data valid | Pass |
| BBAI-5.2 | Verify pantry switch | Successfully switched to "foo" | Data valid | Pass |
| BBAI-5.3 | Get pantries and names | Default pantry and empty foo returned | Data valid | Pass |

#### Whitebox Test Cases (Manual)

| Test ID | Description | Expected Result | Actual Result | Status |
|---------|-------------|-----------------|---------------|---------|
| WB-1.1 | Initial Pantry Check - Testing GET /api/current_pantry | Returns a pantry with name "Default Pantry" and list of ingredients | Returns "Salt, Sugar, and Rice" | Pass |
| WB-1.2 | Testing process of creating, setting, and storing ingredients | Pantry is created, set as current pantry, and ingredient "Spaghetti" is added and retrievable | Pantry created, ingredient stored, retrieved properly | Pass |
| WB-1.3 | Verifying behavior when accessing an empty pantry | The empty pantry is returned with no ingredients | Correctly returns the empty pantry with no ingredients | Pass |
| WB-2.1 | Testing addition of same ingredient multiple times | Duplicate ingredient is added and retrieved, though it should be prevented | No prevention of duplicates in the code, ingredient appears twice | Fail |
| WB-2.2 | Testing duplicate pantry name prevention | The second request should fail with a 400 error | Correctly returns a 400 error on the second request | Pass |
| WB-2.3 | Testing missing or misspelled fields in ingredient data | Returns a 400 error for missing or misspelled fields | Correctly returns a 400 error upon detecting a malformed field | Pass |
| WB-2.4 | Testing special characters in pantry names | The pantry is created successfully despite special characters | Pantry created successfully | Pass |
| WB-2.5 | Testing retrieval of non-existent pantry | Returns a 404 error and appropriate message | Correctly returns a 404 error with message "pantry not found" | Pass |
| WB-2.6 | Testing creation of many pantries (1000) | Returns 200 and creates 1000 pantries | As expected, returns 200 and creates 1000 pantries | Pass |
| WB-2.7 | Testing adding ingredient to 1000 pantries | Adds a unique ingredient to each of 1000 pantries correctly | Returns 200 and adds unique ingredient to each pantry | Pass |
| WB-2.8 | Testing data format for 1000 pantries with ingredients | Return pantry name and ingredients in formatted array for 1000 pantries | Some pantry names/ingredients were not output correctly | Fail |
| WB-2.9 | Testing ingredient deletion from 1000 pantries | Remove specified ingredient from each pantry and return 200 | Specified ingredients removed, returned 200 | Pass |

### AI-Generated Whitebox Test Cases

| Test ID | Description | Expected Result | Actual Result | Status |
|---------|-------------|-----------------|---------------|---------|
| WB_AI-1.1 | Testing recipe generation endpoint with valid ingredients | Returns 200 status with recipe data including title, ingredients, instructions | Returns recipe object with required fields | Pass |
| WB_AI-1.2 | Testing pantry creation with empty name | Should return 400 status with error message | Returns 400 with "Missing required field" | Pass |
| WB_AI-1.3 | Testing input validation for recipe prompts | Should throw error for empty prompt | Throws "Invalid prompt" error | Pass |
| WB_AI-1.4 | Testing pantry creation UI functionality | Should show validation error for empty pantry name | Shows "please provide a pantry name" error | Pass |
| WB_AI-1.5 | Testing ingredient search functionality | Should display search results for 'fruit' | Shows list of matching ingredients | Pass |
| WB_AI-2.1 | Testing input sanitization for security | Should remove dangerous characters | Removes script tags and unsafe characters | Pass |
| WB_AI-2.2 | Testing recipe response formatting with invalid JSON | Should throw error for invalid JSON | Throws parsing error as expected | Pass |
| WB_AI-2.3 | Testing CORS headers in responses | Should include CORS headers | Returns appropriate CORS headers | Pass |
| WB_AI-2.4 | Testing invalid JSON handling | Should return 415 status for invalid JSON | Returns 415 with error message | Pass |
| WB_AI-3.1 | Testing API error handling in recipe generation | Should display error message on API failure | Shows error message to user | Pass |
| WB_AI-3.2 | Testing network error handling in search | Should display network error message | Shows "network error" message | Pass |
| WB_AI-3.3 | Testing recipe generation with dietary restrictions | Should create service with dietary restrictions | Creates service with specified restrictions | Pass |
| WB_AI-3.4 | Testing ingredient deletion from pantry | Should remove ingredient from pantry | Successfully removes ingredient | Pass |
| WB_AI-3.5 | Testing empty search results handling | Should display "no ingredients found" message | Shows appropriate message for empty results | Pass |
| WB_AI-4.1 | Testing pantry creation error handling | Should display error message on failed creation | Shows "failed to create pantry" message | Pass |
| WB_AI-4.2 | Testing missing fields in recipe response | Should provide default values for missing fields | Returns default recipe structure | Pass |
| WB_AI-4.3 | Testing OpenAI API error handling | Should throw API error | Throws "API Error" | Pass |
| WB_AI-4.4 | Testing invalid service type handling | Should throw error for invalid service type | Throws error as expected | Pass |
| WB_AI-4.5 | Testing addition of duplicate ingredients | Should handle duplicate ingredient addition | Adds ingredient with proper validation | Pass |
| WB_AI-5.1 | Testing ingredient input validation | Should show validation error for empty fields | Shows "please provide both name and category" error | Pass |
| WB_AI-5.2 | Testing ingredient names with special characters | Should handle special characters in ingredient names | Successfully stores ingredient with special characters | Pass |
| WB_AI-5.3 | Testing initial pantry data loading | Should load pantries on component mount | Successfully loads and displays pantries | Pass |
| WB_AI-5.4 | Testing recipe generation with different difficulty levels | Should generate recipe matching difficulty level | Creates appropriate difficulty recipe | Pass |
| WB_AI-5.5 | Testing missing fields validation | Should return 400 for missing required fields | Returns appropriate error response | Pass |
| WB_AI-6.1 | Testing localStorage usage in pantry management | Should interact with localStorage correctly | Successfully manages pantry state | Pass |
| WB_AI-6.2 | Testing invalid ingredient format handling | Should convert non-array inputs to empty arrays | Returns proper array format | Pass |
| WB_AI-6.3 | Testing undefined route behavior | Should return 404 with "Not Found" message | Returns proper 404 response | Pass |
| WB_AI-6.4 | Testing unsupported HTTP methods | Should return 405 Method Not Allowed | Returns 405 with error message | Pass |
| WB_AI-6.5 | Testing search with empty input | Should handle empty search gracefully | Shows appropriate feedback | Pass |
| WB_AI-7.1 | Testing pantry switching functionality | Should update current pantry selection | Successfully switches pantries | Pass |
| WB_AI-7.2 | Testing non-string input validation | Should throw error for non-string inputs | Throws appropriate validation errors | Pass |
| WB_AI-7.3 | Testing multiple dietary restriction handling | Should handle multiple dietary restrictions | Generates compliant recipe | Pass |
| WB_AI-7.4 | Testing server error responses | Should handle server errors gracefully | Returns 500 with error message | Pass |
| WB_AI-7.5 | Testing ingredient category input | Should validate category input | Shows validation error | Pass |
| WB_AI-8.1 | Testing content type headers | Should return correct content type | Returns HTML content type | Pass |
| WB_AI-8.2 | Testing ingredient list formatting | Should properly format ingredient list | Returns formatted list | Pass |
| WB_AI-8.3 | Testing pantry name requirements | Should reject empty/whitespace names | Returns validation error | Pass |
| WB_AI-8.4 | Testing recipe generator interface | Should render all required elements | Shows complete interface | Pass |
| WB_AI-8.5 | Testing search result rendering | Should properly display search results | Shows formatted results list | Pass |

## AI Tool Analysis

### Codeium (Whitebox Testing)
- **Strengths**:
  - Reduced development time by 50%
  - Generated more comprehensive test suites
  - Automated code updates and test execution
  - Improved test coverage for both server and client
- **Challenges**:
  - Sometimes updated code without approval
  - Generated tests occasionally mismatched API endpoints
  - Required multiple prompts to fix errors
  - Lower pass rate compared to traditional testing

### Postbot (Blackbox Testing)
- **Strengths**:
  - Significantly reduced development time
  - Effective for regression testing
  - Good for testing response coherency
- **Limitations**:
  - Unable to create variations of specific requests
  - Required existing implementation for response format interpretation
  - Limited ability to generate new request types

### Performance Metrics
- **Test Generation Speed**:
 - AI tools: ~2-3 minutes per test case
 - Traditional: ~10-15 minutes per test case
 - Overall speedup: 70-80%

- **Coverage Statistics**:
 - Server-side:
   - Traditional: 65.62% coverage
   - AI-enhanced: 85.21% coverage
   - Improvement: 19.59%
 - Client-side:
   - Traditional: 10.52% coverage
   - AI-enhanced: 49.74% coverage
   - Improvement: 39.22%

- **Error Detection**:
 - Traditional method: 5/6 test suites passed (87%)
 - AI-enhanced: 4/8 test suites passed (50%)
 - Traditional test cases: 16/17 passed (94%)
 - AI-generated test cases: 46/58 passed (79.3%)

### Productivity Impact
- **Time Savings**:
 - Whitebox testing: 50% reduction in development time
 - Blackbox testing: 70% reduction in development time
 - Overall project timeline reduced by approximately 60%

- **Resource Utilization**:
 - Reduced manual test writing effort by 65%
 - Automated code updates saved ~4 hours of manual coding
 - Integration testing time reduced by 50%

- **Developer Experience**:
 - Less time spent on repetitive test case writing
 - More focus on edge cases and complex scenarios
 - Improved test maintenance through automated updates

### Quality Assessment
- **Code Quality Metrics**:
 - AI-generated tests showed higher complexity
 - Traditional tests were more maintainable
 - AI tests required more documentation

- **Edge Case Coverage**:
 - Traditional: Better handling of boundary conditions
 - AI-enhanced: Better at identifying unconventional scenarios
 - Combined approach achieved optimal coverage

- **Maintainability**:
 - Traditional tests: More intuitive and easier to modify
 - AI-generated tests: Required more review and refinement
 - Documentation quality varied significantly between approaches


# Challenges/Innovations
# Outcomes
The RecipeBuilder project met its main goal of allowing users to manage virtual pantries and generate recipes based on available ingredients. The testing phase uncovered the strengths and weaknesses of the AI tools used. AI-assisted tools, such as Codeium and Postbot, were instrumental in speeing up test case generation and identifying edge cases overlooked by traditional methods. For example, AI testing yielded higher server-side test coverage (85.21% compared to 65.62% for traditional testing) and identified more issues in less time. However, AI-generated tests often lacked robustness in covering all edge cases and required manual intervention to align test cases with API functionality.

Despite achieving 100% coverage in black-box testing, the AI approach faced challenges like difficulty generating variations of specific test requests and dependency on pre-implemented functionality. On the other hand, traditional methods showed superior alignment with edge case handling but were time-intensive. Overall, combining traditional and AI-enhanced approaches provided a balanced testing framework, ensuring functional requirements were met and offering peeks into future testing optimization.
# Future Direction
Future enhancements to the RecipeBuilder project could include expanding the ingredient dataset to cater to a wider variety of cuisines and dietary restrictions, thus increasing the system's reach. Integrating more advanced AI tools, such as GPT style models fine tuned for recipe generation, could significantly improve the system’s ability to handle ambiguous inputs and generate creative suggestions. Additionally, incorporating real-time feedback mechanisms and error handling for invalid inputs would elevate user experience.

Research opportunities also exist in optimizing the ingredient-to-recipe mapping algorithm for faster performance and scalability. Exploring alternative AI tool like graph-based recommendation systems could yield better results. Finally, deploying the system with multilingual support would make it accessible to a global audience adding to its reach and expanding its user base.
