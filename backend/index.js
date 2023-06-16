const connectToMongo = require("./db");
const express = require("express");
connectToMongo();
const app = express();
const port = 5000;

//json middleware
app.use(express.json());

//available routes created
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook app listening at http://localhost:${port}`);
});
