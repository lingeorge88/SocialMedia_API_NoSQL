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

    async createUser(req, res){
        try {
            const newUser = await User.create(req.body);
            res.json(newUser);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async updateUser(req, res){
        try {
            const user = await User.findOneAndUpdate( { _id: req.params.id },
            req.body, { new: true, runValidators: true});
            if(!user){
                res.status(404).json({ message: 'No user found with this id!' }); 
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteUser({ params }, res) {
        // delete the user
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id'});
                return;
            }
            // remove the user from any friends arrays
            User.updateMany(
                { _id : {$in: dbUserData.friends } },
                { $pull: { friends: params.id } }
            )
            .then(() => {
                // remove any comments from this user
                Thought.deleteMany({ username : dbUserData.username })
                .then(() => {
                    res.json({message: "Successfully deleted user"});
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    },


}



module.exports = userController;