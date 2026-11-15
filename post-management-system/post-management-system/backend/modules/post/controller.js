
const path = require('path');
const service = require('./services');
const { sendResponse } = require('../../common');

// Create Post


const create = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return sendResponse(res, 400, false, 'Title and description are required');
        }

        let imageNames = [];

        if (req.files && req.files.images) {
            let images = req.files.images;

            if (!Array.isArray(images)) {
                images = [images];
            }

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const fileName = Date.now() + i + image.name;

                const uploadPath = path.join(
                    __dirname,
                    '../../uploads',
                    fileName
                );

                await image.mv(uploadPath);

                imageNames.push(fileName);
            }
        }

        const post = await service.createPost(
            {
                title,
                description,
                images: imageNames
            },
            req.user._id
        );

        return sendResponse(res, 201, true, 'Post created successfully', post);

    } catch (error) {
        next(error);
    }
};


// Get All Posts
const list = async (req, res, next) => {
    try {
        console.log('Fetching posts with query:', req.query); // Log the query parameters for debugging
        const result = await service.getPosts(req.query);
        console.log('Posts fetched successfully:', result); // Log the result for debugging
        return sendResponse(res, 200, true, 'Posts fetched successfully', result);
    } catch (error) {
        next(error);
    }
};

// Update Post
const update = async (req, res, next) => {
    try {
        const { id } = req?.params;
        let postData = { ...req.body };
        console.log('Updating post with id:', id, 'and data:', postData, req.files.images); // Log the id and data for debugging
        if (!postData.title || !postData.description) {
            return sendResponse(res, 400, false, 'Title and description are required');
        }
        const images = req?.files.images;

        const imageList = Array.isArray(images) ? images : [images];
        if (req?.files && imageList?.length <= 0) {
            return sendResponse(res, 400, false, 'At least one image is required');
        }

        if (req?.files && req.files.images) {


            const imageNames = [];

            for (let i = 0; i < imageList.length; i++) {
                console.log('Processing image:', imageList[i]); // Log the image being processed for debugging
                const image = imageList[i];
                const fileName = Date.now() + i + image.name;
                const uploadPath = path.join(__dirname, '../../uploads', fileName);

                await image.mv(uploadPath);

                imageNames.push(fileName);
            }

            postData.images = imageNames;
        }
        const post = await service.updatePost(id, postData, req.user);

        return sendResponse(res, 200, true, 'Post updated successfully', post);
    } catch (error) {
        next(error);
    }
};

// Delete Post
const remove = async (req, res, next) => {
    try {
        const { id } = req?.params;

        await service.deletePost(id, req.user);

        return sendResponse(res, 200, true, 'Post deleted successfully');
    } catch (error) {
        next(error);
    }
};

// Like Post
const like = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const result = await service.toggleLike(id, req.user._id);

        return sendResponse(res, 200, true, 'Like updated successfully', result);
    } catch (error) {
        next(error);
    }
};

// View Post
const view = async (req, res, next) => {
    try {
        console.log('Recording view for post with id:', req?.params?.id, 'by user:', req.user._id); // Log the post id and user id for debugging
        const { id } = req?.params;

        const post = await service.addView(id, req.user._id);
        console.log('Post after recording view:', post); // Log the post after recording the view for debugging
        return sendResponse(res, 200, true, 'View recorded successfully', {
            viewsCount: post.viewedBy.length
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { create, list, update, remove, like, view };
