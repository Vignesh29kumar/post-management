const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    image: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.index({ name: 1 });
module.exports = mongoose.model('User', userSchema);
