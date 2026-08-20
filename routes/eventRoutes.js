/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events (with filtering, pagination, search)
 *     tags: [Events]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *         description: Filter by city
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search in title and description
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of events with pagination metadata
 *
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, date, city, venue, capacity]
 *             properties:
 *               title: { type: string, example: "Node.js Workshop" }
 *               description: { type: string, example: "Learn backend development" }
 *               category: { type: string, example: "665f1a2b3c4d5e6f7g8h9i0j" }
 *               date: { type: string, format: date-time, example: "2024-12-01T10:00:00Z" }
 *               city: { type: string, example: "Cairo" }
 *               venue: { type: string, example: "Tech Hub" }
 *               capacity: { type: integer, minimum: 1, example: 50 }
 *     responses:
 *       201: { description: Event created successfully }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden - Admin only }
 *
 * /api/events/{id}:
 *   get:
 *     summary: Get single event details
 *     tags: [Events]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Event MongoDB ID
 *     responses:
 *       200: { description: Event details with populated category and organizer }
 *       404: { description: Event not found }
 *
 *   patch:
 *     summary: Update an event (Admin only)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               capacity: { type: integer }
 *     responses:
 *       200: { description: Event updated successfully }
 *
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event deleted successfully }
 */

const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const ctrl = require('../controllers/eventController');

router.get('/', ctrl.getEvents);
router.get('/:id', ctrl.getEventById);

router.post('/', requireAuth, requireRole('admin'), [
  body('title').notEmpty(), body('category').isMongoId(), body('date').isISO8601(), body('capacity').isInt({ min: 1 }),
  validate
], ctrl.createEvent);

router.patch('/:id', requireAuth, requireRole('admin'), [
  param('id').isMongoId(), validate
], ctrl.updateEvent);

router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteEvent);

module.exports = router;