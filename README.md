# Post Management System

A full-stack Post Management System built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). This application allows users to create, manage, search, and interact with posts, while administrators can manage users and monitor platform activities.

## 🚀 Features

### Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- JWT stored in browser localStorage.
- Protected routes.
- Role-Based Access Control (RBAC).
- Admin and User roles.
- User account activation and deactivation.

### User Management (Admin)
- View all registered users.
- Search users by name and email.
- Filter users by role and status.
- Manage user accounts.

### Post Management
- Create, view, update, and delete posts.
- Upload multiple images.
- Like and unlike posts.
- Track post views.
- Search posts by title and description.
- Pagination for posts.
- View posts created by individual users.

### Dashboard & Analytics
- Total posts count.
- Total likes and views.
- Most popular posts.
- Recent posts overview.
- Dashboard statistics.

## 🛠️ Technology Stack

### Frontend
- React.js - version 18
- React Router DOM
- Axios
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js - version 22
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- express-fileupload
- Helmet
- Cookie Parser

## Admin Data Manually Store in the Database like below format:
{
  name: 'mrvk',
  email: 'viki@gmail.com',
  password: '$2a$12$jLAUa.WLzL7aXxFFc52Xse4A49Lz.owNQ7L4ThdrITzWlrYnc272C',
  role: 'admin',
  isActive: true,
  __v: NumberInt('0')
}

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd post-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/post_management
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:8000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev (or) npm start
```

Frontend URL (depending on your React setup):

```text
http://localhost:5000
```

## 🔐 Authentication Flow

1. User registers with name, email and password.
2. Backend hashes the password and saves the user in MongoDB.
3. User logs in with email and password.
4. Backend verifies credentials and generates a JWT.
5. Frontend stores the JWT in localStorage.
6. Axios request interceptor automatically attaches the JWT to API requests.
7. Backend middleware verifies the JWT and identifies the logged-in user.
8. Protected routes allow access based on authentication and user roles.

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/posts` | Create post |
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get single post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like or unlike post |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user details |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | Get dashboard statistics |

*Verify these endpoints against your actual backend routes before publishing.*

## 🗄️ Database

MongoDB is used to store application data.

Main collections:

- **Users:** User information, email, password hash, role and account status.
- **Posts:** Post title, description, images, author, likes, views and timestamps.

MongoDB indexes are used to improve search and query performance.

## 🔒 Security

- Password hashing using bcrypt.
- JWT-based authentication.
- Protected backend routes.
- Role-based authorization.
- HTTP request security using Helmet.
- Input validation.
- Password excluded from normal user queries.


## 👨‍💻 Author

**Vignesh Kumar MR**

Full Stack MERN Developer

- GitHub: https://github.com/vignesh29kumar
- LinkedIn: https://www.linkedin.com/in/vignesh-kumar-m-r-73987b259

---

⭐ If you find this project useful, consider giving it a star!
