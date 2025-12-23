# HMS Backend (Node.js)

Open-source Node.js backend for a Hospital Management System (HMS), designed around real hospital workflows and production constraints.

This repository contains **only the Node.js / Express backend**. Any Java Spring Boot services referenced in the architecture are **external and closed source**.

---

## What’s Included

* Node.js (Express) backend
* JWT-based authentication with Role-Based Access Control (RBAC)
* Core HMS APIs (OPD, IPD, Billing, Rooms, Pharmacy, Lab)
* MongoDB and PostgreSQL integration
* Redis caching
* Security and validation middleware
* **Docker & Docker Compose support for local development and deployment**

---

## Not Included

* Java Spring Boot backend
* Advanced reporting and analytics
* Proprietary or hospital-specific business logic

---

## Tech Stack

* **Node.js**, **Express**
* **MongoDB**, **PostgreSQL**
* **Redis**
* `bcrypt`, `jsonwebtoken`, `helmet`, `cors`
* `dotenv`, `morgan`, `express-validator`
* **Docker**, **Docker Compose**

---

## Project Structure

```
src/
 ├── config/
 ├── controllers/
 ├── services/
 ├── routes/
 ├── models/
 ├── middlewares/
 ├── utils/
 └── app.js
```

---

## Authentication

* JWT (HttpOnly cookies)
* Role-Based Access Control

Roles:

* Admin
* Doctor
* Nurse
* Reception
* Pharmacy
* Lab
* Billing staff

RBAC is enforced at the middleware level.

---

## Running the Project

### Option 1: Local Setup (Without Docker)

```bash
git clone https://github.com/hms-int/hms-backend-node.git
cd hms-backend-node
npm install
cp .env.example .env
node server.js
```

Server runs at:

```
http://localhost:5000
```

---

### Option 2: Docker Compose (Recommended)

The project now supports running the complete backend stack using **Docker Compose**, including databases and Redis.

#### Prerequisites

* Docker
* Docker Compose

#### Steps

```bash
git clone https://github.com/hms-int/hms-backend-node.git
cd hms-backend-node
cp .env.example .env
docker compose up --build
```

This will:

* Build the Node.js backend image
* Start the API server
* Start MongoDB, PostgreSQL, and Redis containers
* Configure internal networking between services

Once running, the API will be available at:

```
http://localhost:5000
```

To stop the containers:

```bash
docker compose down
```

---

## API Design Principles

* REST-based APIs
* Stateless services
* Validation at request entry points
* Business logic isolated in services
* Database access abstracted from controllers

---

## Contributions

Contributions are welcome and expected to follow basic discipline.

* Fork the repository
* Create a feature or fix branch
* Make clear, atomic commits
* Open a Pull Request with a concise explanation

Keep changes minimal, readable, and documented.

---

## License & Disclaimer

This repository is open source.

Closed-source and proprietary components are intentionally excluded.

Ensure compliance with local medical data protection and healthcare regulations before any production deployment.
