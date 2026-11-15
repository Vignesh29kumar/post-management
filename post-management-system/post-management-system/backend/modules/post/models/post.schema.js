const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 140 },
    description: { type: String, default: '', maxlength: 5000 },
    images: { type: [String], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

postSchema.index({ title: 'text', description: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
module.exports = mongoose.model('Post', postSchema);
