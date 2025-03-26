const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
        type: String,
        require: true
    },
});

module.exports = mongoose.model("task", taskSchema);
