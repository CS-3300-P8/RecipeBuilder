# Background
The RecipeBuilder application's concept began as an idea to use the power of GPT-4o to devise recipes using leftover ingredients and avoid food waste. Following an expansion of scope, the application also encompassed the management of ingredient lists (called pantries), the ability to search for new ingredients, the ability to apply dietary restrictions, style preferences, meal types, and preparation difficulties to generated recipes, and the ability to suggest additional ingredients if the given ones are not enough to cook something coherent. We aimed to implement all aspects of a web application that could perform these tasks quickly, cheaply, intuitively, and effectively. We also chose to limit our scope to a single user, with no login screen involved, to focus more on the features of the application.

Our next step in planning the project was choosing a management approach. As we had worked together on the first project and had no problems with the Agile method used previously, we decided that it would be best to use a similar methodology in this project. For each large task, each individual was assigned to a part of it, and we reconvened later in the week to discuss whether that portion of the task had been completed and merge the parts together, whether by reviewing a document or integrating code.

When we were considering our tech stack, we immediately chose to use React.js again when implementing our frontend, as we were all experienced with it and found it to be easy to use in Project 1. However, frustrations with implementing the backend with Springboot lead us to switch to Node.js and Express.js. We also identified the need for a database technology to store all of our ingredient lists as opposed to static on-server storage within a variable and chose MongoDB. In addition, we had to use the OpenAI API to generate recipes, as well as the Google Cloud Platform to deploy the application.

When looking at existing implementations of this rough idea, we found many sites implementing the same recipe generation function as we were. In fact, a large part of our choice to add MMF 4, the recipe tuning, was because we saw another site with the same types of options and decided it would be useful for our implementation as well. Our application mainly differs in its ability to store ingredients. The RecipeBuilder's virtual pantries differ from anything any other recipe generator has to offer.

# Technologies
### Tech Stack
The RecipeBuilder project utilized a strong technology stack designed to balance functionality, scalability, and user experience. Key technologies included React for the frontend, providing a responsive and interactive user interface, and Node.js for the backend, ensuring fast and efficient server-side operations. The project employed MongoDB as the database for flexible and scalable data storage, ideal for managing complex ingredient and recipe data. Deployment was handled through Google Cloud Platform (GCP) to ensure reliable hosting and seamless scalability. Version control was maintained using GitHub, facilitating collaboration and efficient project management.

### AI Integration
For AI integration, tools like Codeium and Postbot were selected to streamline development and testing processes. Codeium was employed for white-box testing, leveraging its automated test case generation and debugging capabilities, which significantly reduced the time spent on manual test creation. Postbot was used for black-box API testing, automating response validation and regression testing. These tools were chosen based on their proven ability to enhance productivity and coverage in previous projects. Additionally, the team incorporated design patterns such as Singleton for managing database connections, Factory for dynamic object creation, and Observer for event handling, ensuring adherence to software engineering best practices.

### Rationale
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
# Challenges/Innovations
# Outcomes
The RecipeBuilder project met its main goal of allowing users to manage virtual pantries and generate recipes based on available ingredients. The testing phase uncovered the strengths and weaknesses of the AI tools used. AI-assisted tools, such as Codeium and Postbot, were instrumental in speeing up test case generation and identifying edge cases overlooked by traditional methods. For example, AI testing yielded higher server-side test coverage (85.21% compared to 65.62% for traditional testing) and identified more issues in less time. However, AI-generated tests often lacked robustness in covering all edge cases and required manual intervention to align test cases with API functionality.

Despite achieving 100% coverage in black-box testing, the AI approach faced challenges like difficulty generating variations of specific test requests and dependency on pre-implemented functionality. On the other hand, traditional methods showed superior alignment with edge case handling but were time-intensive. Overall, combining traditional and AI-enhanced approaches provided a balanced testing framework, ensuring functional requirements were met and offering peeks into future testing optimization.
# Future Direction
Future enhancements to the RecipeBuilder project could include expanding the ingredient dataset to cater to a wider variety of cuisines and dietary restrictions, thus increasing the system's reach. Integrating more advanced AI tools, such as GPT style models fine tuned for recipe generation, could significantly improve the system’s ability to handle ambiguous inputs and generate creative suggestions. Additionally, incorporating real-time feedback mechanisms and error handling for invalid inputs would elevate user experience.

Research opportunities also exist in optimizing the ingredient-to-recipe mapping algorithm for faster performance and scalability. Exploring alternative AI tool like graph-based recommendation systems could yield better results. Finally, deploying the system with multilingual support would make it accessible to a global audience adding to its reach and expanding its user base.
