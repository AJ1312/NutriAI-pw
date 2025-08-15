const express = require('express');
const router = express.Router();
const expert = require('../controllers/expertController');

router.get('/', expert.listPending);
router.get('/solutions', expert.listSolutions);
router.get('/tips', expert.manageTips);
router.post('/solution', expert.postSolution);
router.post('/publish', expert.publishTip);
router.get('/feedback', expert.viewFeedback);

// Solution management routes
router.patch('/solution/:solutionId/toggle', expert.toggleSolutionStatus);
router.put('/solution/:solutionId', expert.updateSolution);
router.get('/solution/:solutionId/edit', expert.getSolutionForEdit);

// Tip management routes
router.delete('/tip/:tipId', expert.deleteTip);
router.patch('/tip/:tipId/toggle', expert.toggleTipStatus);

module.exports = router;
