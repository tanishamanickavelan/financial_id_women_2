const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db"); // connects to MongoDB
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
