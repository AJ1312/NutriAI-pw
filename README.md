# Health Diet Consultation Platform

A comprehensive web application where users can post diet-related queries and certified diet experts provide professional solutions, feedback, and health tips. The platform features a modern, responsive design optimized for all devices including mobile.

## 🏗️ System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS (Embedded JavaScript)
- **Session Management**: Express-session with MongoDB store
- **Authentication**: bcrypt for password hashing
- **Security**: Helmet for security headers
- **Validation**: Express-validator
- **Styling**: Custom CSS with mobile-first responsive design
- **Icons**: SVG icon system

### Architecture Pattern
- **MVC Pattern**: Model-View-Controller architecture
- **RESTful API**: Standard HTTP methods for CRUD operations
- **Session-based Authentication**: Server-side session management
- **Responsive Design**: Mobile-first CSS architecture

### Data Flow
```
User Request → Express Routes → Controllers → Models → MongoDB
                      ↓
User Interface ← EJS Views ← Controllers ← Database Response
```

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Browser)                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Mobile    │  │   Tablet    │  │   Desktop   │  │  Ultra-wide │           │
│  │ (320-767px) │  │(768-1023px) │  │  (1024px+)  │  │  (1440px+)  │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                    │                                           │
│  ┌─────────────────────────────────┼─────────────────────────────────────────┐ │
│  │           FRONTEND ASSETS       │              STATIC FILES               │ │
│  │  • HTML/EJS Templates          │  • CSS (6 files)                       │ │
│  │  • JavaScript (validation)      │  • SVG Icons                           │ │
│  │  • Responsive CSS               │  • Images                              │ │
│  └─────────────────────────────────┼─────────────────────────────────────────┘ │
└─────────────────────────────────────┼─────────────────────────────────────────────┘
                                      │
                              ┌───────▼───────┐
                              │  HTTP REQUEST │
                              └───────┬───────┘
┌─────────────────────────────────────┼─────────────────────────────────────────────┐
│                           SERVER LAYER (Node.js/Express)                        │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│                              ┌──────▼──────┐                                    │
│                              │   EXPRESS   │                                    │
│                              │   ROUTER    │                                    │
│                              └──────┬──────┘                                    │
│                                     │                                           │
│  ┌─────────────────────────────────┬┴┬─────────────────────────────────────────┐ │
│  │           MIDDLEWARE LAYER       │ │              SECURITY LAYER            │ │
│  │  ┌─────────────────────────────┐ │ │  ┌─────────────────────────────────────┐│ │
│  │  │  • Session Management      │ │ │  │  • Helmet (Security Headers)       ││ │
│  │  │  • Authentication Check    │ │ │  │  • bcrypt (Password Hashing)       ││ │
│  │  │  • Request Logging         │ │ │  │  • express-validator (Input Valid) ││ │
│  │  │  • Static File Serving     │ │ │  │  • CSRF Protection                 ││ │
│  │  └─────────────────────────────┘ │ │  └─────────────────────────────────────┘│ │
│  └─────────────────────────────────┬─┴─┬─────────────────────────────────────────┘ │
│                                    │   │                                          │
│                              ┌─────▼───▼─────┐                                   │
│                              │   ROUTE LAYER │                                   │
│                              │               │                                   │
│  ┌──────────────────────────┬─┴───────────────┴─┬────────────────────────────┐   │
│  │    AUTH ROUTES           │    USER ROUTES     │    EXPERT ROUTES           │   │
│  │  /auth/register          │  /user/profile     │  /expert/dashboard         │   │
│  │  /auth/login             │  /user/queries     │  /expert/solutions         │   │
│  │  /auth/logout            │  /user/solutions   │  /expert/feedback          │   │
│  └──────────────────────────┼────────────────────┼────────────────────────────┘   │
│                             │                    │                                │
│                      ┌──────▼──────┐    ┌───────▼──────┐    ┌─────────────────┐   │
│                      │    AUTH     │    │     USER     │    │     EXPERT      │   │
│                      │ CONTROLLER  │    │ CONTROLLER   │    │   CONTROLLER    │   │
│                      └──────┬──────┘    └───────┬──────┘    └─────────┬───────┘   │
│                             │                   │                     │           │
│                             └───────────────────┼─────────────────────┘           │
│                                                 │                                 │
│                                          ┌──────▼──────┐                         │
│                                          │    MODEL    │                         │
│                                          │    LAYER    │                         │
│  ┌──────────────────────────────────────┬┴─────────────┴┬──────────────────────┐ │
│  │        USER MODEL                    │  QUERY MODEL  │    SOLUTION MODEL    │ │
│  │  • Authentication                    │  • CRUD Ops   │    • CRUD Ops        │ │
│  │  • Profile Management               │  • Validation │    • Status Mgmt     │ │
│  │  • Role-based Access               │              │                      │ │
│  └──────────────────────────────────────┼───────────────┼──────────────────────┘ │
│                                         │               │                        │
│  ┌──────────────────────────────────────┼───────────────┼──────────────────────┐ │
│  │      FEEDBACK MODEL                  │   TIP MODEL   │    SESSION STORE     │ │
│  │  • Rating System                     │  • Publishing │    • MongoDB Store   │ │
│  │  • User Feedback                     │  • Like System│    • Session Mgmt    │ │
│  └──────────────────────────────────────┼───────────────┼──────────────────────┘ │
└─────────────────────────────────────────┼───────────────┼────────────────────────┘
                                          │               │
                                   ┌──────▼───────────────▼──────┐
                                   │      MONGOOSE ODM            │
                                   │  • Schema Validation         │
                                   │  • Data Relationships        │
                                   │  • Query Building           │
                                   └──────────────┬───────────────┘
                                                  │
┌─────────────────────────────────────────────────┼─────────────────────────────────┐
│                           DATABASE LAYER (MongoDB)                              │
├─────────────────────────────────────────────────┼─────────────────────────────────┤
│                                          ┌──────▼──────┐                         │
│                                          │   MONGODB   │                         │
│                                          │   SERVER    │                         │
│  ┌─────────────────────────────────────┬─┴─────────────┴─┬─────────────────────┐ │
│  │        USERS COLLECTION             │    QUERIES      │   SOLUTIONS         │ │
│  │  • _id, name, email                 │   COLLECTION    │   COLLECTION        │ │
│  │  • password (hashed)                │  • Query docs   │  • Solution docs    │ │
│  │  • role, timestamps                 │  • References   │  • Status tracking  │ │
│  └─────────────────────────────────────┼─────────────────┼─────────────────────┘ │
│                                        │                 │                       │
│  ┌─────────────────────────────────────┼─────────────────┼─────────────────────┐ │
│  │      FEEDBACK COLLECTION            │  TIPS COLLECTION│   SESSIONS STORE    │ │
│  │  • Rating & Comments                │  • Health Tips  │  • User Sessions    │ │
│  │  • User References                  │  • Like System  │  • Auth State       │ │
│  └─────────────────────────────────────┼─────────────────┼─────────────────────┘ │
└─────────────────────────────────────────┼─────────────────┼───────────────────────┘
                                          │                 │
                           ┌──────────────▼─────────────────▼──────────────┐
                           │           DATABASE OPERATIONS                  │
                           │  • CRUD Operations                            │
                           │  • Aggregation Pipelines                     │
                           │  • Indexing & Performance                     │
                           │  • Data Relationships                         │
                           └───────────────────────────────────────────────┘
```

### Key Features
- **User Management**: Registration, login, profile management
- **Query System**: Users can post diet-related questions
- **Expert Solutions**: Experts provide detailed answers
- **Feedback System**: Users can rate and provide feedback
- **Health Tips**: Experts publish general health tips
- **Real-time Status**: Draft/submitted solution management
- **Mobile Responsive**: Optimized for iPhone and all devices
- **Professional UI**: Modern design with animations

## 📁 Project Structure

```
project/
├── app.js                          # Main application entry point
├── package.json                    # Dependencies and scripts
├── README.md                       # Project documentation
├── .env                           # Environment variables
│
├── controllers/                    # Business logic layer
│   ├── authController.js          # Authentication logic
│   ├── expertController.js        # Expert functionality
│   └── userController.js          # User functionality
│
├── middleware/                     # Custom middleware
│   └── auth.js                    # Authentication middleware
│
├── models/                        # Database schemas
│   ├── Feedback.js               # Feedback schema
│   ├── Query.js                  # Query schema
│   ├── Solution.js               # Solution schema
│   ├── Tip.js                    # Health tip schema
│   └── User.js                   # User schema
│
├── routes/                        # Express routes
│   ├── auth.js                   # Authentication routes
│   ├── expert.js                 # Expert routes
│   └── user.js                   # User routes
│
├── views/                         # EJS templates
│   ├── layout.ejs                # Main layout template
│   ├── index.ejs                 # Homepage
│   ├── login.ejs                 # Login page
│   ├── register.ejs              # Registration page
│   ├── profile.ejs               # User profile
│   ├── postQuery.ejs             # Post query form
│   ├── query.ejs                 # Query list
│   ├── queryDetail.ejs           # Query details
│   ├── queryDetail2.ejs          # Alternative query view
│   ├── solutions.ejs             # Solutions list
│   ├── userTips.ejs              # User tips view
│   ├── expertDashboard.ejs       # Expert dashboard
│   ├── expertDashboard2.ejs      # Alternative dashboard
│   ├── expertSolutions.ejs       # Expert solutions
│   ├── expertTips.ejs            # Expert tips management
│   ├── expertFeedback.ejs        # Expert feedback view
│   ├── about.ejs                 # About page
│   ├── contact.ejs               # Contact page
│   └── privacy.ejs               # Privacy policy
│
└── public/                        # Static assets
    ├── css/                       # Stylesheets
    │   ├── style.css             # Base styles and typography
    │   ├── layout.css            # Layout and structure
    │   ├── components.css        # Reusable components
    │   ├── animations.css        # Animations and transitions
    │   ├── pages.css             # Page-specific styles
    │   └── mobile.css            # Mobile responsiveness
    ├── js/                       # Client-side JavaScript
    │   ├── main.js               # Main JavaScript functionality
    │   └── validation.js         # Form validation
    └── svg/                      # SVG icons
        └── icons.svg             # Icon sprite sheet
```

## 🗄️ Database Schema

### Users Collection
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `role`: String (enum: 'user', 'expert')
- `createdAt`: Date

### Queries Collection
- `_id`: ObjectId
- `title`: String (required)
- `description`: String (required)
- `postedBy`: ObjectId (ref: User)
- `solutions`: [ObjectId] (ref: Solution)
- `createdAt`: Date

### Solutions Collection
- `_id`: ObjectId
- `query`: ObjectId (ref: Query)
- `expert`: ObjectId (ref: User)
- `content`: String (required)
- `isSubmitted`: Boolean (default: false)
- `submittedAt`: Date
- `lastEditedAt`: Date
- `createdAt`: Date

### Feedback Collection
- `_id`: ObjectId
- `from`: ObjectId (ref: User)
- `toExpert`: ObjectId (ref: User, optional)
- `query`: ObjectId (ref: Query)
- `solution`: ObjectId (ref: Solution, optional)
- `message`: String (required)
- `rating`: Number (1-5, optional)
- `createdAt`: Date

### Tips Collection
- `_id`: ObjectId
- `title`: String (required)
- `content`: String (required)
- `category`: String (default: 'general')
- `expert`: ObjectId (ref: User)
- `isPublished`: Boolean (default: true)
- `likes`: [{user: ObjectId, likedAt: Date}]
- `createdAt`: Date

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/health-diet-app
   SESSION_SECRET=your-secure-session-secret
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Development mode**
   ```bash
   npm run dev
   ```

## 🔐 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Secure session storage with MongoDB
- **Input Validation**: Server-side validation using express-validator
- **Security Headers**: Helmet.js for security headers
- **Authentication Middleware**: Protected routes for authenticated users
- **CSRF Protection**: Built-in protection mechanisms
- **Data Sanitization**: Input sanitization and validation

## 📱 Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices
- **iPhone Compatibility**: Specific optimizations for iOS devices
- **Touch-Friendly**: 44px minimum touch targets
- **Responsive Breakpoints**: 
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
  - Ultra-wide: 1440px+

## 🎨 CSS Architecture

- **style.css**: Base typography and design system
- **layout.css**: Layout structure, header, footer, sidebar
- **components.css**: Reusable UI components and utilities
- **animations.css**: Smooth transitions and animations
- **pages.css**: Page-specific styling and desktop optimizations
- **mobile.css**: Mobile-specific responsive behavior

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### User Routes
- `GET /user/profile` - User profile
- `GET /user/queries` - User's queries
- `POST /user/query` - Create new query
- `GET /user/solutions` - User's solutions
- `GET /user/tips` - View health tips
- `POST /user/feedback` - Submit feedback

### Expert Routes
- `GET /expert` - Expert dashboard
- `POST /expert/solution` - Submit solution
- `GET /expert/solutions` - Expert's solutions
- `GET /expert/feedback` - Expert's feedback
- `GET /expert/tips` - Manage tips
- `POST /expert/tip` - Publish new tip

## 🎯 Future Enhancements

- Email notifications for new queries/solutions
- Advanced search and filtering
- File upload for diet plans
- Real-time chat between users and experts
- Mobile app development
- Payment integration for premium features
- Advanced analytics dashboard

## �‍💻 Developer Information

### Development Team
- **Project Type**: Full-Stack Web Application
- **Development Approach**: Agile Development with MVC Architecture
- **Code Quality**: Production-ready with comprehensive error handling
- **Testing**: Manual testing across multiple devices and browsers

### Technical Specifications

#### Backend Architecture
```javascript
// Express.js Server Configuration
const app = express();
app.use(helmet());                    // Security headers
app.use(session({                     // Session management
  store: MongoStore.create(),
  secret: process.env.SESSION_SECRET
}));
app.use(express.static('public'));    // Static file serving
app.set('view engine', 'ejs');        // Template engine
```

#### Database Design Principles
- **Normalization**: Proper data relationships with references
- **Indexing**: Optimized queries with strategic indexes
- **Validation**: Schema-level validation with Mongoose
- **Security**: No direct database exposure, ODM protection

#### Frontend Architecture
- **Progressive Enhancement**: Works without JavaScript
- **Mobile-First**: Responsive design starting from 320px
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Optimized CSS/JS, minimal dependencies

### Development Workflow

#### 1. Local Development Setup
```bash
# Environment setup
git clone <repository>
cd project
npm install
cp .env.example .env

# Database setup
# Ensure MongoDB is running locally or configure cloud connection
# Update MONGODB_URI in .env file

# Start development server
npm run dev
```

#### 2. Development Standards
- **Code Style**: Consistent indentation, meaningful variable names
- **Error Handling**: Try-catch blocks, user-friendly error messages
- **Security**: Input validation, password hashing, session management
- **Performance**: Efficient database queries, optimized static assets

#### 3. File Organization Principles
```
controllers/     # Business logic only
├── Separation of concerns
├── Error handling in every function
└── Async/await pattern

models/          # Database schemas
├── Mongoose schemas with validation
├── Proper data relationships
└── Timestamps and indexes

views/           # EJS templates
├── Layout inheritance
├── Partial components
└── Clean, semantic HTML

public/          # Static assets
├── Organized CSS architecture
├── Modular JavaScript
└── Optimized SVG icons
```

#### 4. Security Implementation
- **Authentication Flow**: Session-based with secure cookies
- **Password Security**: bcrypt with salt rounds (10)
- **Input Validation**: Server-side validation with express-validator
- **XSS Protection**: Helmet.js security headers
- **Session Security**: MongoDB session store with TTL

#### 5. Responsive Design Implementation
```css
/* Mobile-first approach */
.component {
  /* Base mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### Code Quality Standards

#### Backend Code Patterns
```javascript
// Controller pattern example
exports.controllerFunction = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('view', { errors: errors.array() });
    }
    
    // Business logic
    const result = await Model.findOne({ condition });
    
    // Response
    res.render('view', { data: result });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
```

#### Frontend Code Patterns
```javascript
// Client-side validation example
function validateForm(formData) {
  const errors = [];
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.push('Valid email required');
  }
  
  return errors;
}

// AJAX with error handling
async function submitForm(formData) {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Network error');
    
    const result = await response.json();
    handleSuccess(result);
  } catch (error) {
    handleError(error.message);
  }
}
```

### Performance Optimizations

#### Database Optimizations
- **Indexes**: Strategic indexing on frequently queried fields
- **Aggregation**: Use MongoDB aggregation pipelines for complex queries
- **Population**: Selective field population to reduce data transfer
- **Caching**: Session caching with MongoDB store

#### Frontend Optimizations
- **CSS**: Minified and organized into logical modules
- **Images**: SVG icons for scalability and performance
- **JavaScript**: Minimal dependencies, efficient DOM manipulation
- **Caching**: Browser caching for static assets

### Deployment Considerations

#### Environment Variables
```env
# Required environment variables
MONGODB_URI=mongodb://localhost:27017/health-diet-app
SESSION_SECRET=your-secure-32-character-secret-key
PORT=3000
NODE_ENV=production
```

#### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB connection secured
- [ ] Session secret is cryptographically secure
- [ ] HTTPS enabled (handled by hosting platform)
- [ ] Error logging implemented
- [ ] Database indexes created
- [ ] Static assets optimized

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **JavaScript**: ES6+ features with graceful degradation
- **CSS**: Flexbox and Grid with fallbacks

### API Documentation

#### Authentication Endpoints
```javascript
// POST /auth/register
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "role": "string (optional, 'user' or 'expert')"
}

// POST /auth/login
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### User Endpoints
```javascript
// POST /user/query
{
  "title": "string (required)",
  "description": "string (required)"
}

// POST /user/feedback
{
  "message": "string (required)",
  "rating": "number (optional, 1-5)",
  "expertId": "ObjectId (optional)",
  "queryId": "ObjectId (required)",
  "solutionId": "ObjectId (optional)"
}
```

### Troubleshooting Guide

#### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and URI is correct
2. **Session Issues**: Check SESSION_SECRET is set and MongoDB store is accessible
3. **Static Files**: Verify public folder is properly served
4. **Authentication**: Check middleware order and session configuration

#### Debug Commands
```bash
# Check Node.js version
node --version

# Check MongoDB connection
mongosh "mongodb://localhost:27017/health-diet-app"

# Run with debug logging
DEBUG=* npm start

# Check for syntax errors
npm run lint  # (if eslint is configured)
```

## �📝 Notes

This is a production-ready application with comprehensive features for diet consultation. The codebase follows best practices with proper separation of concerns, security measures, and responsive design principles.
