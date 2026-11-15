const path = require('path');
const User = require('./models/user.schema');
const mongoose = require('mongoose');

const getUsers = async ({ search = '', role = '', status = '', page = 1, limit = 10 }) => {
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }
    if (role && ['admin', 'user'].includes(role)) filter.role = role;
    if (status == 'active') filter.isActive = true;
    if (status == 'inactive') filter.isActive = false;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter)
    ]);
    console.log('Fetched users:', users, 'Total count:', total); // Log the fetched users and total count for debugging
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const updateUser = async ( data, currentUserId) => {
    console.log('Updating user with data:', data, 'Current user ID:', currentUserId); // Log the update operation for debugging
     if (!mongoose.isValidObjectId(data.id)) {
            throw new Error('Invalid post id');
        }
    const user = await User.findById(new mongoose.Types.ObjectId(data.id));
    if (!user) { 
        const e = new Error('User not found');
         e.statusCode = 404; 
         throw e;
         }
    if (data.name !== undefined) user.name = String(data.name).trim();
    if (data.role !== undefined && ['admin', 'user'].includes(data.role)) user.role = data.role;
    if (data.isActive !== undefined) user.isActive = Boolean(data.isActive);
    if (data?.image) {
        const fileName = Date.now() + data?.image.name;
        const uploadPath = path.join(__dirname, '../../uploads', fileName);
        await data?.image.mv(uploadPath);
        user.image = fileName;
    }
    await user.save();
    return user;
};

module.exports = { getUsers, updateUser };
