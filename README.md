# Todo App

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Using the Application](#using-the-application)

## Introduction

TodoApp is an application for managing tasks and tracking work hours. It consists of two main parts: the backend, which handles business logic, and the frontend, which provides the user interface.

## Requirements

### Backend

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Frontend

- [Node.js](https://nodejs.org/) (with npm)

## Installation

Clone the repository:

```bash
git init
git clone https://github.com/kamilue/todo-app.git
```

### Backend

Navigate to the backend directory and restore the dependencies:

```bash
cd todo-app-backend
dotnet restore
```

### Frontend

Navigate to the frontend directory and install the dependencies:

```bash
cd todo-app-frontend
npm install
```

## Running the Application

### Backend

To run the backend, navigate to the todo-app-backend directory and execute:

```bash
dotnet run
```

Alternatively, you can start the backend from Visual Studio 2022 by clicking the play icon.

### Frontend

To run the frontend, navigate to the todo-app-frontend directory and execute:

```bash
npm run start
```

## Running Tests

### Backend

To run the tests for the backend, navigate to the todo-app-backend.Tests directory and execute:

```bash
cd todo-app-backend.Tests
dotnet test
```

Alternatively, you can right-click on the todo-app-backend.Tests project in Visual Studio 2022 and select "Run Tests".

### Frontend

First, ensure the backend is running.

#### Unit tests

To run the unit tests for the frontend, execute:

```bash
npm test
```

#### End-to-End (E2E) Tests

To run the E2E tests:

- In the first terminal, start the application with:

```bash
npm run start
```

- In a second terminal, execute:

```bash
npm run cypress:open
```

- In the Cypress UI, select "E2E Testing".
- Choose your preferred browser and click "Start E2E Testing".
- In the selected browser, click on app.cy.ts and wait for the tests to complete.

## Using the Application

After starting both the backend and frontend, you can use the application by navigating to the frontend in your browser.

- Click on the "Open Add Task Form" button to add tasks.
- Added tasks will appear in the task list.
- You can edit or delete tasks, or mark them as done/todo.
- If you add a todo task, the "Estimation Summary" will be displayed.
