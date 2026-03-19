const express = require("express");
const router = express.Router();

// Import authentication middleware
const { requireAuth } = require("../middleware/auth");

// Import task controller functions
const {
  createTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

router.use(requireAuth);

router.post("/", createTask);

router.get("/", getTasks);

router.patch("/:id/toggle", toggleTaskStatus);

router.patch("/:id", updateTask);


router.delete("/:id", deleteTask);



module.exports = router;