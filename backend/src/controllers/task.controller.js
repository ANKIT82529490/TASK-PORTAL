const Task = require("../models/Task");

/*
  Create New Task
*/
async function createTask(req, res) {
  try {
    const { title, description = "", priority = "Medium" } = req.body;

    // Title validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const newTask = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description,
      priority: priority,
    });

    return res.status(201).json({ task: newTask });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/*
  Get All Tasks (with optional status filter)
*/
async function getTasks(req, res) {
  try {
    const { status = "All" } = req.query;

    const filter = { user: req.user.id };

    // Apply status filter if valid
    if (status === "Pending" || status === "Completed") {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/*
  Toggle Task Status (Pending & Completed)
*/
async function toggleTaskStatus(req, res) {
  try {
    const taskId = req.params.id;

    const task = await Task.findOne({
      _id: taskId,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = task.status === "Pending" ? "Completed" : "Pending";

    await task.save();

    return res.json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/*
  Update Task Details
*/
async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const { title, description, priority, status } = req.body;

    const updateData = {};

    if (typeof title === "string") {
      updateData.title = title.trim();
    }

    if (typeof description === "string") {
      updateData.description = description;
    }

    if (priority === "Low" || priority === "Medium" || priority === "High") {
      updateData.priority = priority;
    }

    if (status === "Pending" || status === "Completed") {
      updateData.status = status;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({ task: updatedTask });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/*
  Delete Task
*/
async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;

    const result = await Task.deleteOne({
      _id: taskId,
      user: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
  deleteTask,
};