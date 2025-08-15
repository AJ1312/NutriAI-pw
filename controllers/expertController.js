const { body, validationResult } = require('express-validator');
const Query = require('../models/Query');
const Solution = require('../models/Solution');
const Feedback = require('../models/Feedback');
const Tip = require('../models/Tip');

exports.listPending = async (req, res) => {
  try {
    // List queries with their solutions populated to show status
    const queries = await Query.find()
      .populate('postedBy', 'name')
      .populate({
        path: 'solutions',
        match: { expert: req.session.user.id },
        select: 'content isSubmitted submittedAt lastEditedAt createdAt'
      })
      .sort({ createdAt: -1 })
      .lean();
    
    res.render('expertDashboard', { queries, user: req.session.user || null, path: req.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.postSolution = async (req, res) => {
  const expertId = req.session.user && req.session.user.id;
  if (!expertId) return res.redirect('/auth/login');
  const { queryId, content } = req.body;
  if (!content || !queryId) return res.status(400).send('Invalid');
  
  const sol = new Solution({ 
    query: queryId, 
    expert: expertId, 
    content,
    isSubmitted: false // Start as draft
  });
  await sol.save();
  
  // Attach to query
  const q = await Query.findById(queryId);
  q.solutions.push(sol._id);
  await q.save();
  res.redirect('/expert');
};

// Toggle solution submission status
exports.toggleSolutionStatus = async (req, res) => {
  try {
    const expertId = req.session.user && req.session.user.id;
    if (!expertId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { solutionId } = req.params;
    const solution = await Solution.findOne({ _id: solutionId, expert: expertId });
    
    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }
    
    solution.isSubmitted = !solution.isSubmitted;
    await solution.save();
    
    res.json({ 
      success: true, 
      isSubmitted: solution.isSubmitted,
      submittedAt: solution.submittedAt 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update solution content
exports.updateSolution = async (req, res) => {
  try {
    const expertId = req.session.user && req.session.user.id;
    if (!expertId) return res.redirect('/auth/login');
    
    const { solutionId } = req.params;
    const { content } = req.body;
    
    if (!content) return res.status(400).send('Content is required');
    
    const solution = await Solution.findOne({ _id: solutionId, expert: expertId });
    
    if (!solution) {
      return res.status(404).send('Solution not found');
    }
    
    solution.content = content;
    await solution.save();
    
    res.redirect('/expert');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get solution for editing
exports.getSolutionForEdit = async (req, res) => {
  try {
    const expertId = req.session.user && req.session.user.id;
    if (!expertId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { solutionId } = req.params;
    const solution = await Solution.findOne({ _id: solutionId, expert: expertId });
    
    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }
    
    res.json({ 
      success: true, 
      content: solution.content,
      isSubmitted: solution.isSubmitted 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.publishTip = async (req, res) => {
  try {
    const expertId = req.session.user && req.session.user.id;
    if (!expertId) return res.redirect('/auth/login');
    
    const { title, content, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).redirect('/expert/tips?error=missing-fields');
    }
    
    const tip = new Tip({
      title,
      content,
      category: category || 'general',
      expert: expertId
    });
    
    await tip.save();
    res.redirect('/expert/tips?success=tip-published');
  } catch (err) {
    console.error('Error publishing tip:', err);
    res.status(500).redirect('/expert/tips?error=server-error');
  }
};

exports.viewFeedback = async (req, res) => {
  const expertId = req.session.user && req.session.user.id;
  if (!expertId) return res.redirect('/auth/login');
  try {
    const feedback = await Feedback.find({ toExpert: expertId })
      .populate('from', 'name')
      .populate('query', 'title')
      .populate('solution', 'content')
      .sort({ createdAt: -1 })
      .lean();
    res.render('expertFeedback', { feedback, user: req.session.user || null, path: req.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.listSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ expert: req.session.user.id })
      .populate('query', 'title')
      .populate('expert', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.render('expertSolutions', { solutions, user: req.session.user || null, path: req.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.manageTips = async (req, res) => {
  try {
    const expertId = req.session.user && req.session.user.id;
    if (!expertId) return res.redirect('/auth/login');
    
    // Get tips created by this expert
    const tips = await Tip.find({ expert: expertId })
      .populate('expert', 'name')
      .sort({ createdAt: -1 })
      .lean();
    
    res.render('expertTips', { 
      tips, 
      user: req.session.user || null, 
      path: req.path,
      success: req.query.success,
      error: req.query.error
    });
  } catch (err) {
    console.error('Error fetching tips:', err);
    res.status(500).send('Server error');
  }
};

// Delete a tip
exports.deleteTip = async (req, res) => {
  try {
    const expertId = req.session.user && req.session.user.id;
    if (!expertId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { tipId } = req.params;
    const tip = await Tip.findOne({ _id: tipId, expert: expertId });
    
    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }
    
    await Tip.deleteOne({ _id: tipId });
    res.json({ success: true, message: 'Tip deleted successfully' });
  } catch (err) {
    console.error('Error deleting tip:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Toggle tip published status
exports.toggleTipStatus = async (req, res) => {
  try {
    const expertId = req.session.user && req.session.user.id;
    if (!expertId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { tipId } = req.params;
    const tip = await Tip.findOne({ _id: tipId, expert: expertId });
    
    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }
    
    tip.isPublished = !tip.isPublished;
    await tip.save();
    
    res.json({ 
      success: true, 
      isPublished: tip.isPublished,
      message: tip.isPublished ? 'Tip published' : 'Tip unpublished'
    });
  } catch (err) {
    console.error('Error toggling tip status:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
