const express = require('express');
const { signUp, signIn, signOut } = require('../controllers/user.controller');
const { getUserTasks, createTasks, updateTasks, deleteTasks } = require('../controllers/task.controller');
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
router.post('/signOut', signOut)

// Routes for Tasks

router.use(authMiddleware)
router.get('/get-user', (req, res) => {
    res.send(res.locals.userId)
})
router.get('/get-tasks', getUserTasks)
router.post('/add-task',
    body('task').notEmpty(),
    createTasks
)
router.put('/edit-task/:id/:user', 
    param('id').notEmpty(),
    param('user').notEmpty(),
    body('title').notEmpty(),
    updateTasks
)
router.delete('/delete-task/:id/:user',
    param('id').notEmpty(),
    param('user').notEmpty(), 
    deleteTasks
)


module.exports = router;
