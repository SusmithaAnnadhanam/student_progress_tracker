# Student Progress & Skill Tracking System

A full-stack web application that allows students to manage their academic and technical progress through a centralized dashboard.

## Project Overview

The Student Progress & Skill Tracking System helps students maintain their profile, track technical skills, manage projects and goals, store certificates, view progress analytics, and identify skill gaps.

The application provides a student-focused dashboard where important academic and technical progress can be managed in one place.

## Features

### Student Authentication
- Student registration
- Student login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API endpoints
- Logout functionality

### Student Profile
- View and edit personal information
- College and department details
- Academic year
- Phone number
- Bio

### Skills Management
- Add skills
- Edit skills
- Delete skills
- Skill category
- Skill level
- Track skill progress from 0–100%

### Project Management
- Add projects
- Edit projects
- Delete projects
- Project description
- Technologies used
- GitHub URL
- Start and end dates
- Project status

### Goals Management
- Create learning or career goals
- Edit goals
- Delete goals
- Set target dates
- Track goal progress
- Track goal status

### Certificates
- Add certificates
- Edit certificate details
- Delete certificates
- Upload certificate files
- Store certificate links
- View uploaded certificates

### Dashboard & Analytics
- Total skills
- Total projects
- Total goals
- Completed goals
- Average skill progress
- Skill progress charts
- Project and goal status charts

### Skill Gap Analysis
- View current skills
- Track skill progress
- Identify skills that need improvement
- Display skill-gap information

## Technology Stack

### Frontend
- React
- Tailwind CSS
- Recharts
- Axios
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy
- PyMySQL
- JWT
- bcrypt

### Database
- MySQL
- MySQL Workbench

### Tools
- Visual Studio Code
- Git
- GitHub

## Project Structure

```text
student-progress-tracker/
│
├── README.md
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── auth.py
│   ├── requirements.txt
│   ├── .env
│   ├── uploads/
│   └── venv/
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Skills.jsx
    │   │   ├── Projects.jsx
    │   │   ├── Goals.jsx
    │   │   ├── Certificates.jsx
    │   │   └── SkillGap.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

## How to Run

### Start Backend

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Then open the URL shown by Vite in your browser.

## Security

The application includes:

- Password hashing using bcrypt
- JWT-based authentication
- Protected API endpoints
- Student-specific data access
- Student ownership checks
- CORS configuration
- Environment variables for database credentials
- `.env` excluded from Git
- Virtual environment excluded from Git
- Uploaded files excluded from Git

Sensitive information such as database passwords and secret keys should never be committed to GitHub.

## Author

Developed as a full-stack academic project using React, FastAPI, and MySQL.