
const Post = require('./models/post.schema');
const mongoose = require('mongoose');

// Create a new post
const createPost = async (data, userId) => {
    const post = await Post.create({
        title: data.title,
        description: data.description,
        images: data.images || [],
        author: userId
    });
console.log('Created post:', post); // Log the created post for debugging
    return post;
};

// Get all posts with search and pagination
const getPosts = async (data) => {
    const search = data.search || '';
    const page = Number(data.page) || 1;
    const limit = Number(data.limit) || 10;
    console.log('search', search, data)
    let filter = {};
    if (data?.userId) {
        filter.author = data.userId;
    }

    if (search)
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    console.log('filters', filter)
    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    console.log("posts", posts)
    const total = await Post.countDocuments(filter);

    return {
        posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

// Update a post
const updatePost = async (id, data, user) => {
    console.log('Updating ewrfref with id:', data,); // Log the update operation for debugging
    if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid post id');
    }

    const post = await Post.findById(id);

    if (!post) {
        throw new Error('Post not found');
    }

    if (post.author.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new Error('You cannot edit this post');
    }

    if (data.title) {
        post.title = data.title;
    }

    if (data.description) {
        post.description = data.description;
    }
    if (data.images !== undefined) {
        post.images = data.images;
    }
    console.log('Updating post with data:', data); // Log the update operation for debugging
    await post.save();

    return post;
};

// Delete a post
const deletePost = async (id, user) => {
    const post = await Post.findById(id);

    if (!post) {
        throw new Error('Post not found');
    }

    if (post.author.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new Error('You cannot delete this post');
    }

    await post.deleteOne();

    return { message: 'Post deleted successfully' };
};

// Like or unlike a post
const toggleLike = async (id, userId) => {
    const post = await Post.findById(id);

    if (!post) {
        throw new Error('Post not found');
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
        post.likes.pull(userId);
    } else {
        post.likes.push(userId);
    }

    await post.save();

    return {
        liked: !alreadyLiked,
        likesCount: post.likes.length
    };
};

// Add post view
const addView = async (id, userId) => {
    const post = await Post.findByIdAndUpdate(id,
        {
            $addToSet: {
                viewedBy: userId
            }
        },
        {new: true}
    );

    if (!post) {
        throw new Error('Post not found');
    }

    return post;
};

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    toggleLike,
    addView
};
