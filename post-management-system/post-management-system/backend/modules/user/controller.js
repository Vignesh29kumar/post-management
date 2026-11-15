const { getUsers, updateUser } = require('./services');
const { sendResponse } = require('../../common');

const list = async (req, res, next) => {
   try {
    const{ search, role, status } = req?.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getUsers({
        search: search,
        role: role,
        status: status,
        page,
        limit
    });

    return sendResponse(res, 200, true, 'Users fetched successfully', result);

} catch (error) {
    next(error);
}
};

const update = async (req, res, next) => {
    try {
        const img = req?.files? req?.files?.image : null;
        const updateData = {...req.body, image: img};
        console.log('Update data received:', updateData, req.user); // Log the update data for debugging
        const user = await updateUser(updateData, req?.body?._id);

        return sendResponse(res, 200, true, 'User updated successfully', user);
    } catch (error) {
        next(error);
    }
};
module.exports = { list, update };
