const { body, validationResult } = require('express-validator');
const Query = require('../models/Query');
const Solution = require('../models/Solution');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Tip = require('../models/Tip');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).lean();
    if (!user) return res.redirect('/auth/login');
    // Compute activity overview counts
    const userId = req.session.user.id;
    const [queriesCount, solutionsCount, feedbackCount] = await Promise.all([
      Query.countDocuments({ postedBy: userId }),
      Solution.countDocuments({ expert: userId }),
      Feedback.countDocuments({ toExpert: userId })
    ]);

    res.render('profile', { user, queriesCount, solutionsCount, feedbackCount, path: req.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.validateQuery = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('description').trim().notEmpty().withMessage('Description required')
];

exports.postQuery = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('postQuery', { 
      errors: errors.array(), 
      old: req.body,
      path: req.path 
    });
  }
  try {
    const { title, description } = req.body;
    const q = new Query({ title, description, postedBy: req.session.user.id });
    await q.save();
    res.redirect('/user/queries');
  } catch (err) {
    console.error(err);
    res.status(500).render('postQuery', { 
      errors: [{ msg: 'Failed to post query' }], 
      old: req.body,
      path: req.path 
    });
  }
};

exports.listQueries = async (req, res) => {
  try {
    const queries = await Query.find({ postedBy: req.session.user.id }).populate('postedBy', 'name').sort({ createdAt: -1 }).lean();
    res.render('query', { queries, user: req.session.user || null, path: req.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.listSolutions = async (req, res) => {
  try {
    const userQueries = await Query.find({ postedBy: req.session.user.id }).populate({
      path: 'solutions',
      populate: { path: 'expert', select: 'name' }
    }).sort({ createdAt: -1 }).lean();
    
    const solutions = [];
    userQueries.forEach(query => {
      if (query.solutions && query.solutions.length > 0) {
        query.solutions.forEach(solution => {
          solutions.push({
            ...solution,
            queryTitle: query.title,
            queryId: query._id
          });
        });
      }
    });
    
    res.render('solutions', { solutions, user: req.session.user || null, path: req.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.viewQuery = async (req, res) => {
  try {
    const q = await Query.findById(req.params.id)
      .populate('postedBy', 'name')
      .populate({ 
        path: 'solutions', 
        populate: { path: 'expert', select: 'name' } 
      }).lean();
    if (!q) return res.status(404).send('Query not found');

    let existingFeedback = {};
    if (req.session.user) {
      // Get all feedback from this user for this query
      const userFeedback = await Feedback.find({
        from: req.session.user.id,
        query: req.params.id
      }).lean();

      // Organize feedback by solution/expert
      userFeedback.forEach(feedback => {
        if (feedback.solution) {
          existingFeedback[feedback.solution.toString()] = feedback;
        } else if (feedback.toExpert) {
          existingFeedback[`expert_${feedback.toExpert.toString()}`] = feedback;
        } else {
          existingFeedback['general'] = feedback;
        }
      });
    }

    res.render('queryDetail', { 
      q, 
      user: req.session.user || null, 
      path: req.path,
      existingFeedback,
      feedbackSuccess: req.query.feedback === 'success',
      feedbackError: req.query.error
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Show tips created by experts to users
exports.viewTips = async (req, res) => {
  try {
    // Get all published tips from all experts
    const tips = await Tip.find({ isPublished: true })
      .populate('expert', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Add like information for the current user
    const userId = req.session.user?.id;
    if (userId) {
      tips.forEach(tip => {
        tip.isLikedByUser = tip.likes.some(like => like.user.toString() === userId);
        tip.likeCount = tip.likes.length;
      });
    } else {
      tips.forEach(tip => {
        tip.isLikedByUser = false;
        tip.likeCount = tip.likes.length;
      });
    }

    res.render('userTips', { tips, user: req.session.user || null, path: req.path });
  } catch (err) {
    console.error('Error fetching tips:', err);
    res.status(500).send('Server error');
  }
};

// Toggle like/unlike for a tip
exports.toggleLike = async (req, res) => {
  try {
    const { tipId } = req.params;
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please login to like tips' });
    }

    const tip = await Tip.findById(tipId);
    if (!tip) {
      return res.status(404).json({ success: false, message: 'Tip not found' });
    }

    // Check if user already liked this tip
    const existingLikeIndex = tip.likes.findIndex(like => like.user.toString() === userId);

    let isLiked = false;
    if (existingLikeIndex !== -1) {
      // User already liked, so remove the like
      tip.likes.splice(existingLikeIndex, 1);
      isLiked = false;
    } else {
      // User hasn't liked, so add the like
      tip.likes.push({ user: userId });
      isLiked = true;
    }

    await tip.save();

    res.json({ 
      success: true, 
      isLiked: isLiked,
      likeCount: tip.likes.length,
      message: isLiked ? 'Tip liked!' : 'Like removed'
    });

  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.postFeedback = async (req, res) => {
  try {
    const { message, rating, expertId, queryId, solutionId } = req.body;
    
    // Validate required fields
    if (!message || !queryId) {
      console.log('Validation failed:', { message: !!message, queryId: !!queryId });
      // Return JSON for AJAX or a redirect for regular forms
      if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(400).json({ success: false, error: 'Message and query ID are required' });
      }
      return res.status(400).send('Message and query ID are required');
    }
    
    // Check for existing feedback to prevent duplicates
    const existingFeedbackQuery = {
      from: req.session.user.id,
      query: queryId
    };
    
    if (solutionId) {
      existingFeedbackQuery.solution = solutionId;
    } else if (expertId) {
      existingFeedbackQuery.toExpert = expertId;
    } else {
      // General feedback - check if user already submitted general feedback for this query
      existingFeedbackQuery.toExpert = { $exists: false };
      existingFeedbackQuery.solution = { $exists: false };
    }
    
    const existingFeedback = await Feedback.findOne(existingFeedbackQuery);
    
    if (existingFeedback) {
      const isAjax = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json')) ||
                     req.headers['x-requested-with'] === 'XMLHttpRequest';
      
      if (isAjax) {
        return res.status(400).json({ 
          success: false, 
          error: 'You have already submitted feedback for this item' 
        });
      }
      
      return res.redirect(`/user/query/${queryId}?error=duplicate-feedback`);
    }
    
    // Create feedback object
    const feedbackData = { 
      from: req.session.user.id, 
      query: queryId, 
      message, 
      rating: rating || null 
    };
    
    // Add expert reference if provided
    if (expertId) {
      feedbackData.toExpert = expertId;
    }
    
    // Add solution reference if provided
    if (solutionId) {
      feedbackData.solution = solutionId;
    }
    
    const fb = new Feedback(feedbackData);
    await fb.save();
    
    // Respond with JSON for AJAX or redirect for normal form submissions
    const isAjax = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json')) ||
                   req.headers['x-requested-with'] === 'XMLHttpRequest';

    if (isAjax) {
      return res.json({ success: true, message: 'Feedback submitted successfully', expertName: expertId ? 'Expert' : 'General' });
    }

    // Normal form flow
    return res.redirect(`/user/query/${queryId}?feedback=success`);
  } catch (err) {
    console.error('Feedback error:', err);
    const isAjax = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json')) ||
                   req.headers['x-requested-with'] === 'XMLHttpRequest';
    if (isAjax) {
      res.status(500).json({ success: false, error: 'Failed to submit feedback' });
    } else {
      res.status(500).send('Server error');
    }
  }
};
