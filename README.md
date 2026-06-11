# ClientFlow

ClientFlow is a beginner-friendly multi-page CRUD dashboard built with HTML, CSS, and Vanilla JavaScript.

The project focuses on managing clients and projects through a simple dashboard interface while using JSON Server as a local mock REST API.

## Features

* Client management (Create, Read, Update, Delete)
* Project management (Create, Read, Update, Delete)
* Search and filtering
* Project status and priority updates
* Dashboard overview and analytics
* Chart.js visualizations
* Theme (Light/Dark) settings
* Accent color customization
* LocalStorage persistence for user preferences

## Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript
* JSON Server
* Chart.js

## Project Status

🚧 Ongoing

This project is still under development and will continue receiving fixes, improvements, and new features.

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Open the project folder

```bash
cd ClientFlow
```

### 3. Install JSON Server (if needed)

```bash
npm install -g json-server
```

### 4. Start JSON Server

```bash
json-server --watch db.json --port 3000
```

The application fetches data from:

```text
http://localhost:3000
```

Make sure JSON Server is running before using the dashboard.

### 5. Run the project

You can:

* Open `overview.html` directly in your browser, or
* Use the **Live Server** extension in VS Code (recommended).

## Pages

* Overview
* Projects
* Clients
* Reports
* Settings

## Future Improvements

* Deploy the project online (possibly with Vercel)
* Improve UI/UX and responsiveness
* Add more dashboard analytics
* Refactor and optimize JavaScript code
* Add additional filtering and reporting options

---

Built as a personal learning project to practice frontend development, CRUD operations, API integration, and dashboard design.
