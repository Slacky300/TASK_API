const router = require('express').Router();

const {createTask,assignTaskToUsers, getListOfAllTasks, getSingleTask, getTasksAnalytics, getAssignedTasks, getCreatedTasks, updateTask,deleteTask,} = require('../controllers/taskCntrl');

const {isAuthenticated} = require('../middlewares/isAuthenticated')

router.post('/create', isAuthenticated, createTask);
router.post('/assign/:taskId', isAuthenticated, assignTaskToUsers);
router.get('/assigned', isAuthenticated, getAssignedTasks);
router.get('/created', isAuthenticated, getCreatedTasks);
router.put('/update/:taskId', isAuthenticated, updateTask);
router.delete('/delete/:taskId', isAuthenticated, deleteTask);
router.get('/analytics', isAuthenticated, getTasksAnalytics);
router.get('/:taskId', isAuthenticated, getSingleTask);
router.get('/', isAuthenticated, getListOfAllTasks);

module.exports = router;