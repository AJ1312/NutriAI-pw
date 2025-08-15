const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.get('/register', (req, res) => res.render('register', { errors: [], old: {}, path: '/auth/register' }));
router.post('/register', auth.validateRegister, auth.register);
router.get('/login', (req, res) => res.render('login', { errors: [], old: {}, path: '/auth/login' }));
router.post('/login', auth.validateLogin, auth.login);
router.get('/logout', auth.logout);

module.exports = router;
