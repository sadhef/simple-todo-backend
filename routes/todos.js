const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// Get all todos
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('User not found in request');
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    console.log('Fetching todos for user:', req.user.id);
    const todos = await Todo.find({ user: req.user.id }).sort({ date: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).send('Server Error');
  }
});

// Add new todo
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('User not found in request');
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    console.log('Adding new todo for user:', req.user.id);
    console.log('Todo data:', req.body);
    const newTodo = new Todo({
      title: req.body.title,
      user: req.user.id
    });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).send('Server Error');
  }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('User not found in request');
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    let todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    todo = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).send('Server Error');
  }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('User not found in request');
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    let todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Todo.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;