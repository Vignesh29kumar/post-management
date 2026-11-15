const router = require('express').Router();
const { list, update } = require('./controller');
const { protect, allowRoles } = require('../../middleware/auth');
// router.use(protect, allowRoles('admin'));
router.get('/',protect, list);
router.post('/updateuser', update);
// router.patch('/:id', update);

module.exports = router;
