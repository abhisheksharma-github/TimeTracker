<div align="center">

# ⏱️ TimeTracker

### Modern Full-Stack Employee Time Tracking System

Track daily work hours, monitor productivity, and generate monthly work summaries using a modern Spring Boot + React architecture.

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</div>

---

# 📖 Overview

**TimeTracker** is a full-stack employee time management application designed to simplify daily work-hour logging and monthly reporting.

The system enables users to record their working hours, retrieve historical entries, and view monthly productivity summaries through a responsive web interface backed by REST APIs.

---

# ✨ Features

## Backend

- RESTful API architecture
- Create new time entries
- Retrieve all recorded entries
- Monthly summary generation
- Layered Spring Boot architecture
- DTO-based request/response handling
- PostgreSQL integration
- Hibernate ORM
- Cross-Origin support for React frontend

## Frontend

- Modern React UI
- Built with Vite
- Axios API integration
- Interactive dashboard
- Monthly analytics
- Responsive design
- Recharts data visualization
- Clean and intuitive interface

---

# 🏗️ System Architecture

```text
                 React + Vite Frontend
                         │
                         │ Axios
                         ▼
                Spring Boot REST API
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   Service Layer                  DTO Mapping
        │
        ▼
 Repository Layer (JPA)
        │
        ▼
 PostgreSQL Database
```

---

# 🛠 Technology Stack

## Backend

| Technology | Purpose |
|------------|---------|
| Java 21 | Programming Language |
| Spring Boot | Backend Framework |
| Spring Data JPA | ORM |
| Hibernate | Persistence |
| Maven | Dependency Management |
| PostgreSQL | Database |

---

## Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI Library |
| Vite | Build Tool |
| Axios | API Communication |
| Lucide React | Icons |
| Recharts | Charts & Analytics |

---

# 📂 Project Structure

```text
TimeTracker
│
├── backend
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── service
│   ├── config
│   └── resources
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   └── assets
│   │
│   ├── public
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/TimeTracker.git

cd TimeTracker
```

---

# 🗄 Database Setup

Create PostgreSQL user

```sql
CREATE USER timetracker_user
WITH PASSWORD '123456789';
```

Create database

```sql
CREATE DATABASE time_tracker
OWNER timetracker_user;
```

Grant permissions

```sql
GRANT ALL PRIVILEGES ON DATABASE time_tracker TO timetracker_user;
```

---

# ⚙ Backend Configuration

Update **application.properties**

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/time_tracker
spring.datasource.username=timetracker_user
spring.datasource.password=123456789

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# ▶ Run Backend

```bash
cd backend

mvn spring-boot:run
```

Backend URL

```
http://localhost:8080
```

---

# 💻 Frontend Setup

Navigate to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 🌐 REST API

## Create Time Entry

```http
POST /api/time-entries
```

---

## Get All Entries

```http
GET /api/time-entries
```

---

## Monthly Summary

```http
GET /api/time-entries/monthly-summary?year=2026&month=8
```

---

# 📄 Sample Request

```json
{
    "date": "2026-08-01",
    "startTime": "09:00",
    "endTime": "18:00",
    "remarks": "Worked on TimeTracker backend"
}
```

---


# 🔮 Future Enhancements

- JWT Authentication
- User Login & Registration
- Employee Management
- Attendance Tracking
- Leave Management
- Weekly Reports
- PDF Export
- Excel Export
- Calendar View
- Docker Support
- CI/CD Pipeline
- Unit Testing
- Dark Mode
- Email Notifications

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Abhishek Sharma**

Software Engineer
- LinkedIn: https://www.linkedin.com/in/abhishek-sharma-80423b235/

---

# ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

<div align="center">

### Built with ❤️ using Spring Boot, React & PostgreSQL

</div>