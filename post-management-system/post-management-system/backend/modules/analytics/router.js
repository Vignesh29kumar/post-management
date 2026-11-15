const router = require('express').Router();
const { dashboard } = require('./controller');
const { protect } = require('../../middleware/auth');
router.get('/', protect, dashboard);
module.exports = router;
