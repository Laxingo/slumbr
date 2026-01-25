# Slumbr

Slumbr is a web application built with Vue 3, Vite and Pinia that allows users to log their sleep and visualize trends over time through charts, tables and summary panels.  
This project uses a local JSON-based database during development.

## Running the project

The project requires two processes to run correctly, at the same time:

- The frontend (Vue + Vite)
- The local database (JSON Server)

Each process must be started in a separate terminal.

## Starting the frontend

To start the application in development mode, run the command:

npm run dev

This command starts the Vite development server.

What npm run dev does:

- Compiles the Vue application in development mode
- Enables hot module reload, so changes are reflected instantly
- Serves the application locally (by default at http://localhost:5173)

This command should be used during development.

## Database configuration and initialization

The project uses JSON Server as a lightweight local database.

### Database file

The database is stored in the file db.json at the root of the project.  
This file contains users, sleep logs, quests and other application data.

## Starting the database server

Before using the application (login, dashboard, logs), the database server must be running.

Run the following command in a separate terminal:

npx json-server db.json --port 3000

This command starts a local REST API using the data from db.json and exposes endpoints such as:

- http://localhost:3000/users
- http://localhost:3000/sleepData
- http://localhost:3000/quests
- http://localhost:3000/userQuests

The frontend communicates with this API to authenticate users and store sleep data.  
The database server must remain running while the application is in use.

