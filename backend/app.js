const express = require("express");
const cors = require("cors");
const connectDB = require("./conn/conn"); // Adjust path if necessary
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");
const app = express();

connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());
app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);

app.use("/", (req, res) => {
    res.send("Hello");
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
