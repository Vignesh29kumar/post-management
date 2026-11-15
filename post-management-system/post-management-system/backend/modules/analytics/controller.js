const Post = require('../post/models/post.schema');
const { sendResponse } = require('../../common');

const dashboard = async (req, res, next) => {
    try {
        const isAdmin = req?.user?.role === 'admin';
        const match = isAdmin ? {} : { author: req?.user?._id };
        const [postCount, totals, topPosts, recentPosts] = await Promise.all([
            Post.countDocuments(match),
            Post.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: null,
                        likes: { $sum: { $size: '$likes' } },
                        views: { $sum: { $size: '$viewedBy' } }
                    }
                }]),
            Post.find(match).populate('author', 'name').sort({ likes: -1 }).limit(5),
            Post.find(match).populate('author', 'name').sort({ createdAt: -1 }).limit(7)
        ]);
        console.log('Dashboard data:', { postCount, totals, topPosts, recentPosts }); // Log the dashboard data for debugging
        const totalsData = totals[0] || { likes: 0, views: 0 };
        return sendResponse(res, 200, true, 'Analytics fetched', {
            postCount, likes: totalsData.likes, views: totalsData.views, topPosts, recentPosts
        });
    } catch (error) { next(error); }
};
module.exports = { dashboard };
