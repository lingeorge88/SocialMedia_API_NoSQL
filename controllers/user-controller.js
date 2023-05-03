const {User, Thought} = require('../models');

const userController = {
    async getAllUsers(req, res) {
        try{
        const UserData = await User.find()
        .select('-__v')
        res.json(UserData);
        } catch(err) {
            res.status(500).json(err);
        }
    },

    async getSingleUser(req, res) {
        try{
            const singleUser = await User.findOne({ _id: req.params.id})
            .populate([
                { path: 'thoughts', select:"-__v"},
                { path: 'friends', select: "-__v"}
            ])
            .select('-__v');

            if(!singleUser) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(singleUser);
        } catch (err) {
            res.status(500).json(err)
        }
    },

}



module.exports = userController;