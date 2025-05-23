const express = require('express');
const { signUp, signIn, signOut } = require('../controllers/userController');
const { getUserTasks, createTasks, updateTasks, deleteTasks } = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth')
const { inputErrorHandler } = require('../middleware/inputErrorHandler')
const { body, param } = require('express-validator');

const router = express.Router()
// Routes for user
router.post(
    '/signUp',
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty(),
    inputErrorHandler,
    signUp
)
router.post('/signIn',
    body('email').isEmail(),
    body('password').notEmpty(),
    inputErrorHandler,
    signIn
)


// Routes for Tasks

router.use(authMiddleware)
router.get('/get-user', (req, res) => {
    res.json({userId: res.locals.userId})
})
router.get('/get-tasks', getUserTasks)
router.post('/add-task',
    body('title').notEmpty(),
    createTasks
)
router.put('/edit-task/:id', 
    param('id').notEmpty(),
    body('title').notEmpty(),
    updateTasks
)
router.delete('/delete-task/:id',
    param('id').notEmpty(),
    deleteTasks
)

router.get("/signOut", signOut)

module.exports = router;
