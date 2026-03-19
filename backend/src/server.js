const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: false,
  })
);

app.get("/", (req, res) => {
  res.send("Task Portal API is running...");
});

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI)
    

 app.listen(PORT, () => {
      console.log(`Server started successfully on port ${PORT}`);
    });

 