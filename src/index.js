const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectdb = require("./config/db");
const configRoutes = require("./routes");


const app = express();

const PORT = process.env.PORT || 8000;
// Apply middlewares
app.use(
  morgan("tiny", { skip: (req, res) => process.env.NODE_ENV === "test" })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

configRoutes(app);

app.get("/", (req, res) => {
  res
    .status(200)
    .send("ola");
});

app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}`);
});

module.exports = app;
