# Task Manager Application

A full-stack Task Management application built using Django REST Framework, React, and MySQL. It helps users organize tasks, manage categories, track progress, and monitor their productivity.

## Features

- User registration and login
- JWT authentication
- Access and refresh token management
- User profile management
- Create, view, update, and delete tasks
- Create and manage categories
- Task priorities: Low, Medium, High
- Task statuses: Pending, In Progress, Completed
- Task due dates
- Search and filter tasks
- Task ordering
- Dashboard with task statistics
- User-specific task and category data

## Technology Stack

### Backend
- Python
- Django
- Django REST Framework
- MySQL
- Simple JWT
- django-filter
- django-cors-headers

### Frontend
- React
- Vite
- JavaScript
- React Router
- Axios
- CSS

## Project Structure

```text
Task_manager/
├── backend/
│   ├── accounts/
│   ├── categories/
│   ├── tasks/
│   ├── dashboard/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Task_manager
```

### 2. Backend setup

Create and activate a virtual environment:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
cd backend
pip install -r requirements.txt
```

Create a `.env` file using `.env.example` and configure your MySQL credentials and Django secret key.

Create the MySQL database before running migrations.

Run migrations:

```powershell
python manage.py migrate
```

Create an administrator:

```powershell
python manage.py createsuperuser
```

Start the backend:

```powershell
python manage.py runserver
```

Backend URL: `http://127.0.0.1:8000/`

Django Admin: `http://127.0.0.1:8000/admin/`

### 3. Frontend setup

Open another terminal:

```powershell
cd frontend
npm install
```

Create a `.env` file using `.env.example`.

Start the frontend:

```powershell
npm run dev
```

Frontend URL: `http://localhost:5173/`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts/register/` | Register |
| POST | `/api/accounts/login/` | Login |
| POST | `/api/accounts/token/refresh/` | Refresh JWT |
| GET/PATCH | `/api/accounts/profile/` | View/update profile |
| POST | `/api/accounts/logout/` | Logout |
| GET/POST | `/api/categories/` | List/create categories |
| GET/PUT/PATCH/DELETE | `/api/categories/{id}/` | Manage category |
| GET/POST | `/api/tasks/` | List/create tasks |
| GET/PUT/PATCH/DELETE | `/api/tasks/{id}/` | Manage task |
| GET | `/api/dashboard/` | Dashboard statistics |

Protected endpoints require a JWT access token:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Database

MySQL is used for persistent storage.

The database stores user accounts, categories, and tasks. Each user's tasks and categories are isolated from other users.

## Security

- JWT-based authentication
- Password hashing through Django
- Authenticated API access
- User-specific data access
- Environment-based configuration
- CORS configuration

## Future Improvements

- Task reminders and email notifications
- Calendar view
- Drag-and-drop task management
- Recurring tasks
- Team collaboration
- Deployment with Docker

## Author

Developed as a full-stack development project using Django REST Framework, React, and MySQL.