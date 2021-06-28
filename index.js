require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
const client = require("./configs/db");
const port = process.env.PORT || 8000;

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const detailsRoutes = require("./routes/details");

const passportSetup = require("./configs/passport-setup");
const passport = require("passport");
const fileUploader = require("express-fileupload");
app.use(fileUploader());
app.use(express.json());
app.use(cors());

var server = app.listen(port, () => {
  console.log("On port 8000!");
});

// app.listen(port, () => {
//   console.log("On port 8000!");
// });

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/pages");
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/details", detailsRoutes);

//socket setup

var io = socket(server);

io.on("connection", function (socket) {
  console.log("made socket connection", socket.id);

  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", (data) =>{
    socket.broadcast.emit("typing", data);
  })
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database!");
  }
});
