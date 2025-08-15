const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.get('/profile', user.getProfile);
router.get('/tips', user.viewTips);
router.post('/tips/:tipId/like', user.toggleLike);
router.get('/queries', user.listQueries);
router.get('/solutions', user.listSolutions);
router.get('/query/:id', user.viewQuery);
router.get('/post-query', (req, res) => res.render('postQuery', { 
  errors: [], 
  old: {},
  user: req.session.user,
  path: req.path 
}));
router.post('/post-query', user.validateQuery, user.postQuery);
router.post('/feedback', user.postFeedback);

module.exports = router;
