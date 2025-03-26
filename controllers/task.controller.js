/**
 * @file task.controller.js
 * @description Controller for managing tasks, including fetching, creating, updating, and deleting tasks.
*/
const Task = require("../models/task.models")
require("dotenv").config()


/**
 * Get all tasks for the logged-in user.
 * @async
 * @function getUserTasks
 * @returns {Promise<void>} Responds with a list of tasks or an error message.
 */
module.exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: res.locals.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}

/**
 * Create a new task for the logged-in user.
 * @async
 * @function createTasks
 * @param {Object} req.body - Request body containing task details.
 * @param {string} req.body.title - Title of the task.
 * @param {string} req.body.description - Description of the task.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with the created task or an error message.
 */
module.exports.createTasks = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({
            user: res.locals.userId,
            title,
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error creating task' });
    }
}

/**
 * Update an existing task for the logged-in user.
 * @async
 * @function updateTasks
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - ID of the task to update.
 * @param {Object} req.body - Request body containing updated task details.
 * @param {string} [req.body.title] - Updated title of the task.
 * @param {string} [req.body.description] - Updated description of the task.
 * @param {boolean} [req.body.completed] - Updated completion status of the task.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with the updated task or an error message.
 */
module.exports.updateTasks = async (req, res) => {
    try {
        // Find task ensuring it belongs to the logged-in user
        const task = await Task.findOne({ _id: req.params.id, user: res.locals.userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const { title } = req.body;
        if (title !== undefined) task.title = title;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task' });
    }
}

/**
 * Delete a task for the logged-in user.
 * @async
 * @function deleteTasks
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - ID of the task to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with a success message or an error message.
 */
module.exports.deleteTasks = async (req, res) => {
    try {
        // Ensure the task to delete belongs to the logged-in user
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: res.locals.userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task' });
    }
}