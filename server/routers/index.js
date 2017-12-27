const express = require('express');
const router = express.Router();
const base = '../controller';

router.get('/', require(base + '/index'));
router.get('/contact-me', require(base + '/contact-me'));
router.post('/contact-me', require(base + '/api/contact-me'));
router.get('/my-work', require(base + '/my-work'));
router.post('/my-work', require(base + '/api/my-work'));
router.get('/login', require(base + '/login'));
router.post('/login', require(base + '/api/login'));

module.exports = router;
