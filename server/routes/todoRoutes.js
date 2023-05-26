const express = require('express');
const router = express.Router(); // create router
const todoController = require('../controllers/todoController'); // import todo controller
const auth = require("../middleware/auth"); // auth middleware

router.get('/', auth, todoController.getAllTodos);
router.post('/', auth, todoController.createTodo);
router.put('/:id', auth, todoController.updateTodo);
router.delete('/:id', auth, todoController.deleteTodo);
// delete all todos
router.delete('/delete/all', auth, todoController.deleteAllTodos);

module.exports = router;
