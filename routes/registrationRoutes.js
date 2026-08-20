const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');
const ctrl = require('../controllers/registrationController');

router.post('/', requireAuth, [body('event').isMongoId(), validate], ctrl.registerForEvent);
router.get('/my', requireAuth, ctrl.getMyRegistrations);
router.delete('/:id', requireAuth, ctrl.cancelRegistration);

module.exports = router;