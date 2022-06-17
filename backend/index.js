const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();

const app = express();

const port = 5000; //on port 3000 we will have react app

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.use(cors());
app.use(express.json()); //middleware

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`inotes app listening at http://localhost:${port}`);
});
