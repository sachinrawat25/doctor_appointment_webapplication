const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require('path');

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(moragan("dev"));

// routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// static files and fallback route
app.use(express.static(path.join(__dirname, "./client/public")));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

// port
const port = process.env.PORT || 8080;

// listen
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white
  );
});
