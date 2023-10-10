const express = require('express');
const taskController = require('./../controllers/taskControllers')
const authController = require('./../controllers/authControllers')

const router = express.Router();

router.route('/').post(taskController.createTask).get(taskController.getAllTask);
router.route('/:id').put(taskController.updateTask).delete(taskController.deleteTask);

module.exports = router;