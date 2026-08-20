# EYOUTH-31010122400097-eventpulse

**EventPulse** is a comprehensive Backend API for an event management platform. It provides a secure, scalable, and real-time infrastructure for managing events, user registrations, capacity limits, and live organizer announcements.

This project was built as a final graduation project demonstrating advanced Node.js backend development skills, including Authentication, Role-Based Access Control (RBAC), advanced database querying, real-time WebSockets, and automated testing.

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Real-Time:** Socket.io
* **Authentication:** JWT (JSON Web Tokens) & bcryptjs
* **Validation:** express-validator
* **Testing:** Jest & Supertest
* **Documentation:** Swagger (OpenAPI) & Postman
* **Deployment:** Vercel (Serverless) & MongoDB Atlas

## 🚀 Local Installation & Setup

Follow these steps to run the project locally on your machine:

### 1. Clone the repository

```bash
git clone https://github.com/eyadmkv/EYOUTH-31010122400097-eventpulse.git
cd EYOUTH-31010122400097-eventpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory or copy `.env.example` and add your variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=replace_this_with_a_mongodb_uri
JWT_SECRET=replace_this_with_a_JWTKEY
JWT_EXPIRES_IN=7d
```

> **Important:** Never commit your `.env` file or expose your `JWT_SECRET` and MongoDB credentials publicly.

### 4. Seed the Database

Populate your database with sample categories, events, and an admin user:

```bash
npm run seed
```

**Default Admin Login:**

* Email: `admin@eventpulse.com`
* Password: `password123`

> Change the default admin password before using the project in a production environment.

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on:

```text
http://localhost:3000
```

## 📡 API Endpoint Summary

| Method   | Endpoint                      | Description                                                    | Access   |
| :------- | :---------------------------- | :------------------------------------------------------------- | :------- |
| `GET`    | `/health`                     | Health check & database status                                 | Public   |
| `POST`   | `/api/auth/register`          | Register a new user                                            | Public   |
| `POST`   | `/api/auth/login`             | Login and receive JWT                                          | Public   |
| `GET`    | `/api/events`                 | List events with filtering, sorting, searching, and pagination | Public   |
| `GET`    | `/api/events/:id`             | Get single event details                                       | Public   |
| `POST`   | `/api/events`                 | Create a new event                                             | Admin    |
| `PATCH`  | `/api/events/:id`             | Update an event                                                | Admin    |
| `DELETE` | `/api/events/:id`             | Delete an event                                                | Admin    |
| `POST`   | `/api/registrations`          | Register for an event                                          | Attendee |
| `GET`    | `/api/registrations/my`       | Get the current user's registrations                           | Attendee |
| `DELETE` | `/api/registrations/:id`      | Cancel a registration                                          | Attendee |
| `POST`   | `/api/announcements`          | Send a real-time announcement                                  | Admin    |
| `GET`    | `/api/announcements/:eventId` | Get announcement history for an event                          | Public   |

## 📖 Documentation & Testing

### Swagger

Interactive API documentation is available at:

```text
http://localhost:3000/api-docs
```

when the development server is running.

### Postman

A structured Postman collection containing environments and sample requests is available in the:

```text
postman/
```

directory.

### Automated Tests

Run the unit and integration test suite with:

```bash
npm test
```

## 🌐 Live Deployment

The API can be deployed to Vercel and connected to a MongoDB Atlas cloud database.

## 🌐 Live Deployment

The API is deployed live on Vercel and connected to a MongoDB Atlas cloud database.

**🔗 Live URL:** https://eyouth-31010122400097-eventpulse.vercel.app/

**❤️ Health Check:** https://eyouth-31010122400097-eventpulse.vercel.app/health

## 📁 Project Structure

```text
EYOUTH-31010122400097-eventpulse/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── tests/
├── postman/
├── config/
├── seed/
├── app.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

> The exact directory structure may vary depending on the implementation of the project.

## 🔐 Security

The API uses several security mechanisms, including:

* JWT-based authentication
* Password hashing with bcryptjs
* Role-Based Access Control (RBAC)
* Request validation with express-validator
* Environment variables for sensitive configuration
* Protected admin and attendee endpoints

## ⚡ Core Features

* User registration and authentication
* JWT authorization
* Admin and attendee roles
* Event creation, updating, and deletion
* Event search, filtering, sorting, and pagination
* Event capacity management
* Event registration and cancellation
* Real-time announcements using Socket.io
* Announcement history
* MongoDB persistence with Mongoose
* Swagger API documentation
* Postman API collection
* Automated testing with Jest and Supertest

## 📌 Production Notes

Before deploying the application to production:

1. Replace all development secrets with secure production secrets.
2. Configure the production MongoDB Atlas connection string.
3. Set `NODE_ENV=production`.
4. Use a strong, randomly generated `JWT_SECRET`.
5. Change the default admin password.
6. Add your real Vercel deployment URL to this README.
7. Verify all environment variables are configured in the Vercel dashboard.
8. Run the full test suite before deployment.

---

**Built with ❤️ by Eyad Mohammed**
