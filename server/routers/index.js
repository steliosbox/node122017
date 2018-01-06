const router = require('koa-router')();

router.use('/my-work', require('../controllers/my-work').routes());
router.use('/login', require('../controllers/login').routes());
router.use('/contact-me', require('../controllers/contact-me').routes());
router.use('/', require('../controllers/index').routes());

module.exports = router;
