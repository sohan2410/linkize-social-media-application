const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
const fileUploader = require("express-fileupload");
app.use(fileUploader());
app.use(express.json());
app.use(cors());



// exports.test = (req, res) => {
//     knex.insert({})
// }
exports.newpost = (req, res) => {
  //   console.log("in controllers/post.js")
  const { name, data } = req.files.pic;
  console.log(data);
  console.log(typeof data);
  if (name && data) {
    client
      .query(
        `INSERT INTO profilepic ( imgname, img) VALUES ('${name}', '${data}');`
      )

      .catch((err) => {
        console.log(err);
      });
    // client.insert({ name: name, img: data }).into("images")
    res.status(200).json({
      message: "image added successfully",
    });
  } else {
    res.status(400).json({
      message: "image not found",
    });
  }
};
