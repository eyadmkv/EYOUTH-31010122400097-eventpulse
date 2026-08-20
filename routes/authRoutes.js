/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Eyad M" }
 *               email: { type: string, format: email, example: "eyad@mohammed.com" }
 *               password: { type: string, minLength: 6, example: "password123" }
 *     responses:
 *       201: 
 *         description: User registered successfully, returns JWT
 *       400: 
 *         description: Validation error or email already exists
 *       422: 
 *         description: Invalid input data format
 *
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "eyadadmin@mohammed.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200: 
 *         description: Login successful, returns JWT
 *       401: 
 *         description: Invalid credentials
 *       422: 
 *         description: Invalid input data format
 */
const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/authController');

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], ctrl.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], ctrl.login);

module.exports = router;
