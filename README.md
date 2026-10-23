# Todo App — Dockerized Full-Stack Application

A Todo CRUD application built using Node.js, Express.js, EJS, MySQL, and Docker. This project demonstrates Docker containerization and networking between an application container and a MySQL database container.

## Features

- Create, view, update, and delete Todo tasks
- Mark tasks as completed
- Store Todo data in MySQL
- Render the interface using EJS templates
- Style the UI with CSS and Bootstrap
- Run the application and database in separate Docker containers
- Connect containers through a custom Docker network

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS, Bootstrap
- **Database:** MySQL 8.4
- **Containerization:** Docker
- **Package Management:** npm

## Project Structure

```text
todo-docker/
├── public/
│   └── style.css
├── views/
│   ├── edit.ejs
│   └── todos.ejs
├── .dockerignore
├── .gitignore
├── Dockerfile
├── app.js
├── package.json
└── package-lock.json
```

## Run Locally with Docker

1. Create a Docker network for the application and database.
2. Start a MySQL container with the required database and user.
3. Build the application image using the Dockerfile.
4. Start the application container on the same Docker network.
5. Open `http://localhost:3000` in your browser.

Configure database connection details through environment variables:

- `DB_HOST` — MySQL container name
- `DB_USER` — MySQL username
- `DB_PASSWORD` — MySQL password
- `DB_NAME` — Database name

**Note:** The application and database containers must share a Docker network. Use the MySQL container name for `DB_HOST`, rather than `localhost`, when the application runs inside Docker.

## Learning Objectives

- Understanding Docker images and containers
- Writing a Dockerfile for a Node.js application
- Building and running custom Docker images
- Connecting multiple containers using Docker networking
- Integrating a Node.js application with MySQL
- Managing application configuration with environment variables

## Future Improvements

- Add input validation and error handling
- Add authentication and user-specific Todo lists
- Use Docker Compose to manage multiple containers
- Add automated tests and a CI/CD workflow

---

**Author:** Sarthak Narlawar
