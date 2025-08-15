const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SolutionSchema = new Schema({
  query: { type: Schema.Types.ObjectId, ref: 'Query', required: true },
  expert: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isSubmitted: { type: Boolean, default: false },
  submittedAt: { type: Date },
  lastEditedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to handle timestamps
SolutionSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.lastEditedAt = new Date();
  }
  
  if (this.isModified('isSubmitted') && this.isSubmitted && !this.submittedAt) {
    this.submittedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Solution', SolutionSchema);
