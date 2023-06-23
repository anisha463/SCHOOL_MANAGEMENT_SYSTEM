const express = require("express");
const admin = require("./routes/admin");
const student = require("./routes/student");
const teacher = require("./routes/teacher");

const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Up");
});

app.use("/admin", admin);
app.use("/student", student);
app.use("/teacher", teacher);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
