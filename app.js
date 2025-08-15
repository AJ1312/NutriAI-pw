require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const expertRoutes = require('./routes/expert');
const { authMiddleware, guestOnly, setUserLocals } = require('./middleware/auth');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Global middleware to set user and path
app.use(setUserLocals);

// Handle Chrome DevTools request to prevent 404 errors
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', authMiddleware, userRoutes);
app.use('/expert', authMiddleware, expertRoutes);

app.get('/', (req, res) => {
  res.render('index', { 
    user: req.session.user || null,
    path: req.path
  });
});

// Static pages routes
app.get('/about', (req, res) => {
  res.render('about', { 
    user: req.session.user || null,
    path: req.path
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { 
    user: req.session.user || null,
    path: req.path,
    query: req.query
  });
});

app.get('/privacy', (req, res) => {
  res.render('privacy', { 
    user: req.session.user || null,
    path: req.path
  });
});

// Handle contact form submission
app.post('/contact', (req, res) => {
  // For now, just redirect back with a success message
  // In production, you'd want to handle the form data (send email, save to database, etc.)
  res.redirect('/contact?success=true');
});

// Export the app for serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
