const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('register', { 
      errors: errors.array(), 
      old: req.body,
      path: req.path 
    });
  }
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).render('register', { 
        errors: [{ msg: 'Email already registered' }], 
        old: req.body,
        path: req.path 
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash, role: role === 'expert' ? 'expert' : 'user' });
    await user.save();
    req.session.user = { id: user._id, name: user.name, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('register', { 
      errors: [{ msg: 'Server error occurred' }], 
      old: req.body,
      path: req.path 
    });
  }
};

exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('login', { 
      errors: errors.array(), 
      old: req.body,
      path: req.path 
    });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('login', { 
        errors: [{ msg: 'Invalid credentials' }], 
        old: req.body,
        path: req.path 
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).render('login', { 
        errors: [{ msg: 'Invalid credentials' }], 
        old: req.body,
        path: req.path 
      });
    }
    req.session.user = { id: user._id, name: user.name, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { 
      errors: [{ msg: 'Server error occurred' }], 
      old: req.body,
      path: req.path 
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
