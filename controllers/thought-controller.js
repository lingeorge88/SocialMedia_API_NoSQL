const {User, Thought , Reaction} = require('../models');

const thoughtController = {
    async getAllThoughts (req, res) {
        try {
            const thoughtData = await Thought.find({})
            .populate({path: 'reactions', select: "-__v"})
            .select('-__v')
            res.json(thoughtData);
        } catch(err){
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try{
            const singleThought = await Thought.find({_id: req.params.id})
            .populate({path: 'reactions', select: "-__v"})
            .select('-__v');
            if(!singleThought){
                return res.status(404).json({ message: 'No thought found with that ID' });
            }
            res.json(singleThought);
        } catch(err) {
            res.status(500).json(err)
        }
    },

    async createThought (req,res) {
        try{
            const newThought = await Thought.create(req.body);
            res.json(newThought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },

    async updateThought (req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({
                _id: req.params.id }, req.body, { new: true }
            );
            if(!thought){
                res.status(404).json({ message: 'No thought found with this id, unable to update!' }); 
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // DELETE /api/thoughts/:id
    deleteThought({ params }, res) {
        // delete the thought
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id'});
                return;
            }
            
            User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.id } }
            )
            .then(() => {
                res.json({message: 'Successfully deleted the thought'});
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },

}

module.exports = thoughtController;