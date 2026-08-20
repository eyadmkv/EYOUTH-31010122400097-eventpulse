const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const ctrl = require('../controllers/announcementController');

router.post('/', requireAuth, requireRole('admin'), ctrl.sendAnnouncement);
router.get('/:eventId', ctrl.getAnnouncementHistory);

module.exports = router;