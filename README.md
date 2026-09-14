# To-Do-List Application

## Project Description
This repository contains files that will start a To-Do Application. It is made in JavaScript and the front-end framework React.js. The user can add todo items to their list they can make, and then can either sort the items in alphabetical order or when they were created in history, from oldest to newest or newest to oldest. The list can also be sorted to show all items, or filter out to show only completed items or items that need to be completed. There are many options on the todo app that allow these options for the user to edit and change their list.

## Features List
The todo app is capable of sorting its items by doing the following:
* "Created By" or "Title": Categorizes items from when they were created in time or by title or their wording
* Order in DESCENDING or ASCENDING: Categorize items in alphabetical order
* Search Todos: There is a text box that if a user types in a letter or an exact word, it will filter the todos that either contain the letter or word that was typed in
* Show: Gives the user an option to show every todo, or only todos that are completed or todos that are not completed. 
* Todo: This text box allows users to add todos to the list. When todos are added, the user can click on the todo text to modify the text.

## Technologies Used
* JavaScript
* React.js
* HTML
* CSS

## Getting Started
To get started running this application, the sections below "Available Scripts" explains what additional files was added to the basic React.js template to make this application functional, and "Downloading this Repository's Files" explains how to download this entire repository's files and code in order to run it.  

## Available Scripts
In this repository, the basic files from running the React commands to download the basic template of React, is used to run this application. Furthermore, additional files or scripts have been added in the src folder. Within the src folder, there are more added folders: components, contexts, features, pages, reducers, shared, and utils. 
<br> <br>
In the components and contexts folders have the RequireAuth.jsx and AuthContext.jsx files respectively, and they are used to provide authenciation when a user signs in into the todo app.   
<br> <br>
The features directory has the Logoff.jsx, where that file implements a "Logout" button on the website for when the user wants to log out of their todo list when finished. There is a "Todos" directory that has TodoForm.jsx and a "TodoList" directory. The TodoForm.jsx receives components from other files, including TextInputWithLabel.jsx and todoValidation.js to display a function todo form for users to interact with. In the TodoList directory, has files "TodoListItem.jsx" and "TodoList.jsx". "TodoListItem.jsx" adds items and sends it over to "TodoList.jsx".
<br> <br>
The pages directory has more .jsx files that displays to the HTML todo application's UI: "AboutPage.jsx", "HomePage.jsx", "LoginPage.jsx", "NotFoundPage.jsx", "ProfilePage.jsx" and "TodosPage.jsx". When first opening the website, the user is automatically directed to the homepage, which is the "HomePage.jsx". The "LoginPage.jsx" is structured the sameway as "HomePage.jsx". The "AboutPage.jsx" shows a description of this application and how to use it. These pages can be accessed through the header links by either clicking "HOME", "ABOUT" or "LOGIN" for which page the user wants.
<br> <br>

When the user logs into the application, their todolist is now shown and this is displayed from the "TodosPage.jsx". The header now shows: "HOME", "ABOUT", "TODOS", or "PROFILE". When the "HOME" link is now clicked, it also now shows this todolist page as well. The "ABOUT" page still shows a description of the application and how to use it and the "PROFILE" page shows percentage statistics of completed and uncompleted items to the total items on the list. There is also a "Logout" button at the top to sign out when the user is finished using the todo app.

## Downloading this Repository's Files
To replicate this project on your local machine, have the npm package installed already, which can be downloaded from the Node.js website (1). There are also specific instructions to download Node.js for each operating system. The files code in this directory has been modified to display a To-Do app instead of showing the standard React and Vite documentation. 

To run the files from this repository to display the To-Do app, navigate to an empty folder or directory on the local machine and run the following command to first download these files:

```
git clone https://github.com/AndrewDass1/starting-react-project.git
```
The command above will download all the files onto a local machine's repository to display the To-Do App. Take note of the directory where the files was downloaded to, and if needed use the `cd` command to change directories on the local machine where the source code was downloaded. After successfully downloading the source, now run the following command:

```
npm install
```

npm install runs all required dependencies to run the source code for the To-Do app. 

If needed, go to the official React (2) website for further instructions to download React.js.

## Running the Application
After downloading the code it will be asked to run the application after completing installation from running the code in the terminal. If the server is exited after the initial installation, to rerun the program at any time in the terminal, use the following code:

```
npm run dev
```
Below shows the homepage or the login page, of the application:
<img src="./todo_app_homepage.png" />

## Screenshots
Below shows other pages of the application <br>

### About Page
<img src="./about.png" />
This page shows a description of the todo app and how it can be used.
<br>

### Todo Page
<img src="./todospage.png" />
<br>
The todo page can show all the todos that were or are on the list that was or need to completed respectively. There are different options to either show all items, only completed items or only the items that need to be completed. 

### Profile Page
<img src="./profile.png" />
This page shows the amount of total items on the list, and the ones that are either completed or need to be completed.

## Live Demo Link
I created a short video, showing how the application works and it can be accessed through this link: https://youtu.be/10q-GLYtoqI

## Design Decisions
This application is meant to have a simple UI, where the user can see and navigate this application easily when they run it. When they first run the application, they are prompted to enter their login credentials. If they want to explore other parts of the website, the header is included at the top to show or navigate through other webpages.

## Future Improvements
Improvements that can be done to this app, is, next time, I'll implement more features such as displaying the time and date of when a particular todo item was added to the list. Also, when an item is checked marked, I would implement for it to be unchecked and if an item needs to be removed or deleted, I would implement that as well. 

## Contact Information
Below is my LinkedIn, if you want to contact me:
https://www.linkedin.com/in/andrewdass/

## Sources
https://nodejs.org/en/download (1)

https://react.dev/learn/installation (2)

## License Information
https://github.com/react/react/blob/main/LICENSE (3)