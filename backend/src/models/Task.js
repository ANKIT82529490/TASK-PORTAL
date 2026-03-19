const mongoose = require("mongoose");

 
const taskSchema = new mongoose.Schema(
  {
     
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

     
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

     
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

     
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  {
     
    timestamps: true,
  }
);

 
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;