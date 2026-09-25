# Prompts.md — AI Interaction & Engineering Log

## Project: The Data Storm (Phase 4: Advanced Integration - Track B)

This document records the design inquiries, schema architectural considerations, and debugging queries utilized during the development of the MongoDB Atlas persistent backend integration.

---

### Session 1: Cloud Provisioning & ODM Setup (Phase 1)
- **Prompt:** "How should I structure the MongoDB Atlas connection with Mongoose in an Express application to ensure connection timeouts and credential security are properly handled?"
- **Engineering Application:** Created `config/db.js` using async/await with connection string pulled strictly from `process.env.MONGO_URI`. Implemented `.gitignore` to ensure credentials are never tracked by version control.

---

### Session 2: Schema Design & Strict Typing (Phase 1)
- **Prompt:** "What is the best way to define a Mongoose schema for Posts and Users with proper validation, string trimming, and default timestamps?"
- **Engineering Application:** Defined `models/User.js` with regex-based email validation and `models/Post.js` with `ObjectId` referencing the `User` model, title length constraints, and explicit `createdAt` timestamps.

---

### Session 3: Route Refactoring & In-Memory Migration (Phase 2)
- **Prompt:** "How do I refactor legacy in-memory Express CRUD routes to async/await Mongoose queries (`Post.create`, `Post.find`, `Post.findByIdAndDelete`) with appropriate HTTP status codes?"
- **Engineering Application:** Refactored endpoint logic into modular controller functions in `controllers/postController.js`. Handled `201 Created` for injections, `200 OK` for retrieval and deletions, and `404 Not Found` for invalid IDs.

---

### Session 4: Relational Population & Aggregation Query (Phase 3)
- **Prompt:** "How do I populate referenced user fields in Mongoose and create a dedicated endpoint for the Top 3 most recent posts sorted by timestamp?"
- **Engineering Application:** Implemented `.populate('authorId', 'name email')` across GET endpoints. Created the `/posts/recent` route leveraging `.sort({ createdAt: -1 }).limit(3)` and ensured proper route order to avoid Express wildcard parameter shadowing (`/recent` before `/:id`).

---

### Session 5: Error Handling & Production Readiness
- **Prompt:** "What centralized middleware should be added to handle Mongoose `CastError`, duplicate key `code: 11000`, and route 404s cleanly in JSON format?"
- **Engineering Application:** Added `middlewares/errorHandler.js` to catch bad IDs and duplicate email submissions gracefully without crashing the server process.
