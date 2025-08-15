const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect('/auth/login');
  }
};

const guestOnly = (req, res, next) => {
  if (!req.session.user) {
    res.locals.user = null;
    next();
  } else {
    // If user is logged in and trying to access login/register, redirect to their dashboard
    if (req.path === '/login' || req.path === '/register') {
      if (req.session.user.role === 'expert') {
        return res.redirect('/expert');
      } else {
        return res.redirect('/user/profile');
      }
    }
    next();
  }
};

const setUserLocals = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.path = req.path;
  next();
};

module.exports = { authMiddleware, guestOnly, setUserLocals };
