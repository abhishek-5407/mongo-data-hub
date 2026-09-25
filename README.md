# ⚡ The Data Storm — Persistent Cloud Storage with MongoDB Atlas

> **Phase 4: Advanced Integration — Track B: Fullstack Developers**  
> Production-grade RESTful API migrating volatile in-memory storage to persistent cloud database storage using **MongoDB Atlas** and **Mongoose ODM**.

---

## 📋 Table of Contents
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Core Integration Phases](#core-integration-phases)
- [Prerequisites & Atlas Setup](#prerequisites--atlas-setup)
- [Installation & Local Setup](#installation--local-setup)
- [API Documentation & Endpoints](#api-documentation--endpoints)
- [Postman QA Testing](#postman-qa-testing)
- [QA Demo Video Guide (3 Min Max)](#qa-demo-video-guide-3-min-max)
- [Deployment (Render / Railway)](#deployment-render--railway)

---

## 🛠 Architecture & Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) (v18+)
- **Framework:** [Express.js](https://expressjs.com/) (RESTful API architecture)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (M0 Sandbox Free Cluster)
- **ODM:** [Mongoose](https://mongoosejs.com/) (Strict typing, Schemas, Relational Population)
- **Configuration & Security:** `dotenv` (Secrets strictly decoupled from version control)
- **Dev Tools:** `nodemon` (Hot reload for development)

---

## 📂 Project Directory Structure

```text
mongo-data-hub/
├── config/
│   └── db.js                 # MongoDB Atlas Mongoose connection logic
├── controllers/
│   ├── postController.js     # Post CRUD & Top 3 aggregation controller
│   └── userController.js     # User management controller
├── middlewares/
│   └── errorHandler.js       # Centralized 404 & Mongoose error handling
├── models/
│   ├── Post.js               # Strict Post schema referencing User (authorId)
│   └── User.js               # User schema with unique email & validation
├── routes/
│   ├── postRoutes.js         # /posts and /posts/recent route endpoints
│   └── userRoutes.js         # /users route endpoints
├── .env.example              # Environment variables template
├── .gitignore                # Protects .env and node_modules from commit
├── package.json              # Project scripts and dependencies
├── postman_collection.json   # Exported Postman collection for QA validation
├── Prompts.md                # Mandatory AI prompt log as per rubric
├── README.md                 # Complete documentation
└── server.js                 # Express server bootstrap
```

---

## 🚀 Core Integration Phases

### Phase 1: Cloud Provisioning & ODM Setup (P0 - Mandatory)
- Provisioned MongoDB Atlas Free Tier (M0 Cluster).
- Integrated Mongoose connection in [`config/db.js`](file:///d:/Prodesk%20IT/mongo-data-hub/config/db.js).
- Architected strict schemas for `User` and `Post` in [`models/`](file:///d:/Prodesk%20IT/mongo-data-hub/models/).

### Phase 2: Live Database CRUD Logic (P1 - Priority)
- Replaced legacy in-memory arrays with persistent Mongoose methods:
  - `POST /posts` &rarr; `Post.create()`
  - `GET /posts` &rarr; `Post.find()`
  - `GET /posts/:id` &rarr; `Post.findById()`
  - `DELETE /posts/:id` &rarr; `Post.findByIdAndDelete()`

### Phase 3: Relational Modeling & Aggregation (P2 - Advanced)
- Embedded `authorId` reference (`ref: 'User'`) in `Post` schema.
- Hydrated responses with author data using `.populate('authorId', 'name email')`.
- Built custom endpoint `GET /posts/recent` utilizing sorting and limiting (`.sort({ createdAt: -1 }).limit(3)`).

---

## ☁️ Prerequisites & Atlas Setup

1. **Create Free MongoDB Atlas Cluster:**
   - Log in to [MongoDB Atlas](https://account.mongodb.com/).
   - Click **Create a Deployment** &rarr; Select **M0 (Free)**.
2. **Configure Database Access:**
   - Go to **Database Access** &rarr; **Add New Database User**.
   - Set Authentication Method to **Password**, create a username (e.g., `admin`) and secure password. Note down this password.
3. **Configure Network Access (CRITICAL):**
   - Go to **Network Access** &rarr; **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) &rarr; Click **Confirm**. *(Prevents connection timeout errors).*
4. **Obtain Connection String:**
   - Go to **Databases** &rarr; Click **Connect** &rarr; Choose **Drivers** (Node.js).
   - Copy connection string:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blogDB?retryWrites=true&w=majority
     ```

---

## 💻 Installation & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/abhishek-5407/mongo-data-hub.git
cd mongo-data-hub
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blogDB?retryWrites=true&w=majority
```
> ⚠️ **IMPORTANT:** Never commit `.env` to GitHub. It is protected in `.gitignore`.

### 3. Start Development Server
```bash
npm run dev
```
You should see:
```text
[Database] MongoDB Atlas Connected: cluster0.xxxxx.mongodb.net
[Server] Running in development mode on port 5000
```

---

## 📡 API Documentation & Endpoints

Base URL: `http://localhost:5000` (or `http://localhost:5000/api`)

### 1. User Endpoints

| Method | Route | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Create an Author user | `{"name": "Nakul Sharma", "email": "nakul@example.com"}` |
| `GET` | `/users` | Get all users | *None* |
| `GET` | `/users/:id` | Get user by ID | *None* |

### 2. Post Endpoints

| Method | Route | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/posts` | Create Post (persisted to Atlas) | `{"title": "MongoDB Atlas Post", "content": "Fullstack Cloud Persistence", "authorId": "<USER_ID>"}` |
| `GET` | `/posts` | Get all posts (hydrated with author) | *None* |
| `GET` | `/posts/recent` | **Top 3 Most Recent Posts** | *None* |
| `GET` | `/posts/:id` | Get single post with author details | *None* |
| `DELETE` | `/posts/:id` | Delete post by ID | *None* |

---

## 🧪 Postman QA Testing

We have included a ready-to-run Postman collection in [`postman_collection.json`](file:///d:/Prodesk%20IT/mongo-data-hub/postman_collection.json).

### Steps to Test in Postman:
1. Open **Postman** &rarr; Click **Import** &rarr; Select `postman_collection.json`.
2. Run requests in sequence:
   1. **`POST /users`** &rarr; Creates a user and auto-saves `createdUserId`.
   2. **`POST /posts`** &rarr; Creates a post linked to that user.
   3. **`GET /posts`** &rarr; Validates `.populate()` returns author details.
   4. **`GET /posts/recent`** &rarr; Validates top 3 recent posts sorting.
   5. **`DELETE /posts/:id`** &rarr; Deletes the post from Atlas.

---

## 🎥 QA Demo Video Guide (3 Min Max)

Follow this quick timeline for your submission video:
1. **0:00 - 0:30 (Introduction & Server Boot):**
   - Show terminal running `npm run dev` with MongoDB Atlas connected message.
   - Mention your track: **Track B - Fullstack Developers**.
2. **0:30 - 1:45 (Postman Execution):**
   - Execute `POST /users` to create an author.
   - Execute `POST /posts` to inject post data.
   - Execute `GET /posts` showing the hydrated `authorId` data (`name`, `email`).
   - Execute `GET /posts/recent` showing top 3 sorted posts.
3. **1:45 - 2:30 (MongoDB Atlas Cloud Verification):**
   - Switch to browser and open **MongoDB Atlas Dashboard** &rarr; **Database** &rarr; **Browse Collections**.
   - Show `users` and `posts` collections containing the exact data injected via Postman.
4. **2:30 - 3:00 (Deletion & Wrap Up):**
   - Run `DELETE /posts/:id` in Postman.
   - Refresh Atlas Collections view to show the document was deleted.

---

## 🚀 Deployment (Render / Railway)

1. Push your repository to GitHub (ensure `.env` is NOT pushed).
2. Go to [Render.com](https://render.com/) &rarr; **New Web Service** &rarr; Connect your repository.
3. Configure settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables** in Render Dashboard:
   - `MONGO_URI` = `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blogDB?retryWrites=true&w=majority`
   - `NODE_ENV` = `production`
5. Click **Deploy**. Your live URL will be ready in 1-2 minutes.
