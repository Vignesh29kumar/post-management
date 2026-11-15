const router = require('express').Router();
router.use('/auth', require('../modules/auth/router'));
router.use('/users', require('../modules/user/router'));
router.use('/posts', require('../modules/post/router'));
router.use('/analytics', require('../modules/analytics/router'));
module.exports = router;
