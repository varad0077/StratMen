# Backend Module Pattern
# How Every Feature Module is Structured

---

## The Pattern: Controller → Service → Model

Every backend feature follows the exact same 4-file pattern used in the Green Saviours project. This ensures consistency, testability, and separation of concerns.

```
modules/<feature>/
├── <feature>.routes.js       ← Express routes (HTTP method + path + middleware chain)
├── <feature>.controller.js   ← Request/response handling (parse req, call service, send res)
├── <feature>.service.js      ← Business logic (validation, transformations, orchestration)
├── <feature>.model.js        ← Database queries (raw SQL via mysql2/promise)
└── <feature>.validator.js    ← Input validation rules (express-validator) [optional]
```

---

## Layer Responsibilities

### Routes (`*.routes.js`)
- Define HTTP endpoints (GET, POST, PATCH, DELETE)
- Chain middleware: rate limiter → validator → validate → authenticate → authorize → controller
- NEVER contain business logic

```javascript
// Example: modules/posts/posts.routes.js
const router = require('express').Router();
const ctrl = require('./posts.controller');
const authenticate = require('../../middlewares/authenticate');
const checkAllowlist = require('../../middlewares/checkAllowlist');
const { apiLimiter } = require('../../middlewares/rateLimiter');
const { validate, createPostRules } = require('./posts.validator');

// All StratChat post routes require authentication + allowlist check
router.get('/',    apiLimiter, authenticate, checkAllowlist, ctrl.getPosts);
router.post('/',   apiLimiter, authenticate, checkAllowlist, createPostRules, validate, ctrl.createPost);
router.patch('/:id', apiLimiter, authenticate, checkAllowlist, ctrl.updatePost);
router.delete('/:id', apiLimiter, authenticate, checkAllowlist, ctrl.deletePost);

module.exports = router;
```

### Controller (`*.controller.js`)
- Extract data from `req.body`, `req.params`, `req.query`
- Call the service layer
- Return standardized response using `apiResponse.success()` or `apiResponse.error()`
- NEVER contain business logic or database queries

```javascript
// Example: modules/posts/posts.controller.js
const postService = require('./posts.service');
const { success, error } = require('../../utils/apiResponse');

const createPost = async (req, res) => {
  try {
    const { content, image_url } = req.body;
    const post = await postService.createPost({
      authorId: req.user.id,
      content,
      imageUrl: image_url,
    });
    return success(res, 201, 'Post created successfully', post);
  } catch (err) {
    return error(res, err.statusCode || 500, err.message);
  }
};
```

### Service (`*.service.js`)
- Contains ALL business logic
- Orchestrates between models, other services
- Throws errors with `statusCode` property for the controller to catch
- NEVER touches `req` or `res` objects

```javascript
// Example: modules/posts/posts.service.js
const postModel = require('./posts.model');

const createPost = async ({ authorId, content, imageUrl }) => {
  if (!content || content.trim().length === 0) {
    const err = new Error('Post content is required');
    err.statusCode = 422;
    throw err;
  }

  const postId = await postModel.insertPost(authorId, content.trim(), imageUrl || null);
  const post = await postModel.getPostById(postId, authorId);
  return post;
};
```

### Model (`*.model.js`)
- Raw SQL queries using mysql2/promise
- Returns plain data objects
- NEVER contains business logic
- Uses parameterized queries (prevents SQL injection)

```javascript
// Example: modules/posts/posts.model.js
const db = require('../../config/db');

const insertPost = async (authorId, content, imageUrl) => {
  const [result] = await db.execute(
    'INSERT INTO posts (author_id, content, image_url) VALUES (?, ?, ?)',
    [authorId, content, imageUrl]
  );
  return result.insertId;
};

const getPostById = async (postId, currentUserId) => {
  const [rows] = await db.execute(
    `SELECT p.*, u.full_name AS author_name, u.profile_photo_url AS author_avatar, u.role AS author_role,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
            EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS is_liked,
            EXISTS(SELECT 1 FROM bookmarks WHERE post_id = p.id AND user_id = ?) AS is_bookmarked
     FROM posts p
     JOIN users u ON u.id = p.author_id
     WHERE p.id = ?`,
    [currentUserId, currentUserId, postId]
  );
  return rows.length ? rows[0] : null;
};
```

### Validator (`*.validator.js`)
- Defines validation rules using express-validator
- Exports `validate` middleware and rule arrays
- Used in routes BEFORE the controller

```javascript
// Example: modules/posts/posts.validator.js
const { body, validationResult } = require('express-validator');
const { error } = require('../../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 422, 'Validation failed', errors.array());
  }
  next();
};

const createPostRules = [
  body('content')
    .trim().notEmpty().withMessage('Post content is required')
    .isLength({ max: 5000 }).withMessage('Post content must be ≤ 5000 characters'),

  body('image_url')
    .optional().trim()
    .isURL().withMessage('Invalid image URL'),
];

module.exports = { validate, createPostRules };
```

---

## Cookie Configuration Pattern (from Green Saviours)

```javascript
const REFRESH_COOKIE_OPTS = {
  httpOnly: true,                                    // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production',     // HTTPS only in production
  sameSite: 'Strict',                                // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000,                // 30 days
  path: '/api/auth',                                 // Only sent to auth endpoints
};
```

---

## Error Throwing Pattern

Services throw errors with `statusCode` property. Controllers catch and pass to `apiResponse.error()`:

```javascript
// In service:
const err = new Error('User not found');
err.statusCode = 404;
throw err;

// In controller:
catch (err) {
  return error(res, err.statusCode || 500, err.message);
}
```

---

## Admin Action Logging Pattern

Every admin action must be logged:

```javascript
// In admin-related controllers/services:
await adminService.logAction({
  adminId: req.user.id,
  action: 'APPROVED_MEMBER',
  targetTable: 'allowlist',
  targetId: null,
  details: { email: 'member@example.com', role: 'StratMen Member' }
});
```
