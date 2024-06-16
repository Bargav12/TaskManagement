const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/users");
const { authenticateToken } = require("./auth");

router.post("/create", authenticateToken, async (req, res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.headers;

        // Validate the input
        if (!title || !desc || !id) {
            return res.status(400).json({ message: "Title, description, and user ID are required" });
        }

        // Create a new task
        const newTask = new Task({ title, desc });
        const saveTask = await newTask.save();

        // Push the task ID to the user's task array
        await User.findByIdAndUpdate(id, { $push: { tasks: saveTask._id } });

        res.status(200).json({ message: "Task Created" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
});

// FETCHING DATA
router.get("/get-all-tasks",authenticateToken, async (req, res)=>{
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "tasks",
            options: { sort: { createdAt: -1 } },
          });
        res.status(200).json({ data: userData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
})

// DELETING TASKS
router.delete("/delete-tasks/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// UPDATE 
router.put("/update-tasks/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc } = req.body;
        await Task.findByIdAndUpdate(id, { title: title, desc: desc });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Important Tasks
router.put("/update-imp-tasks/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id, { important: !ImpTask });

        res.status(200).json({ message: "Task important task updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Complete Task
// Complete Task
router.put("/update-cmp-tasks/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        const updatedTask = await Task.findByIdAndUpdate(id, { complete: !task.complete }, { new: true });

        res.status(200).json({ message: "Task completed updated successfully", task: updatedTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//get important tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const Data = await User.findById(id).populate({
        path: "tasks",
        match: { important: true },
        options: { sort: { createdAt: -1 } },
      });
      const ImpTaskData = Data.tasks;
      res.status(200).json({ data: ImpTaskData });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });
  
  //get completed tasks
  router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const Data = await User.findById(id).populate({
        path: "tasks",
        match: { complete: true },
        options: { sort: { createdAt: -1 } },
      });
      const CompTaskData = Data.tasks;
      res.status(200).json({ data: CompTaskData });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });

  //get incompleted tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const Data = await User.findById(id).populate({
        path: "tasks",
        match: { complete: false },
        options: { sort: { createdAt: -1 } },
      });
      const CompTaskData = Data.tasks;
      res.status(200).json({ data: CompTaskData });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error" });
    }
  });

module.exports = router;
