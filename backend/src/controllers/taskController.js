import Task from '../models/Task.js';
import User from '../models/User.js';

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = await Task.create({
      title, description, dueDate, priority,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks with pagination and filter by assignedTo (assigned to logged user) or admin can see all
export const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.user.role !== 'admin') filter.assignedTo = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit)
      .populate('assignedTo', 'name email');

    res.json({
      tasks, page, pages: Math.ceil(total/limit), total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // check permission
    if (req.user.role !== 'admin' && String(task.assignedTo?._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && String(task.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const fields = ['title','description','dueDate','priority','status','assignedTo'];
    fields.forEach(f => { if (req.body[f] !== undefined) task[f] = req.body[f]; });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && String(task.assignedTo || '') !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await task.deleteOne({_id: task._id});
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: err.message });

  }
};
