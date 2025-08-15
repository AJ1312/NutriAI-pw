const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toExpert: { type: Schema.Types.ObjectId, ref: 'User' },
  query: { type: Schema.Types.ObjectId, ref: 'Query' },
  solution: { type: Schema.Types.ObjectId, ref: 'Solution' },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
