const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const e = require("express");
app.use(fileUpload());
app.use(express.json());
app.use(cors());

exports.newprofilepic = (req, res) => {
  console.log("in new profile pic");
  // <form
  //     action="http://localhost:8200/posts/newprofilepic"
  //     enctype="multipart/form-data"
  //     method="POST"
  //   >
  //     <input type="text" placeholder="email id" name="emailid"/>
  //     <input type="file" name="pic" />
  //     <input type="submit" value="Upload a file" />
  //   </form>

  // SUPPOST THIS IS POST REQUEST,
  //WE WILL BE STORING IMAGE FILE IN DATA VARIABLE USING EXPRESS FILE FILEUPLOADER
  // GET THER USER EMAIL FROM POST REQ BODY
  const data = req.files.image;
  // SENDING DECODED BUFFER
  const imgdata = data.data.toString("base64");
  const email = req.body.email;
  const mime = data.mimetype;
  if (data) {
    // WRITING A CLIENT QUERY WHERE WE CAN STORE IMAGE NAME, IMAGE, EMAIL IN OUT DATABASE
    client
      // .query(
      //   `INSERT INTO profilepic (imgname, img, email, mime) VALUES ('${data.name}', bytea('${imgdata}') , '${email}', '${mime}');`
      // )
      .query(
        `UPDATE details
        SET imgname='${data.name}', img=bytea('${imgdata}'), mime='${mime}'
        WHERE email='${email}';`
      )
      // IF THERE IS ANY ERROR, IT WILL CONSOLE LOG
      .catch((err) => {
        console.log(err);
      });

    // WILL SEND A 200 STATUS IF IMAGE IS SUCCEFULLY ADDED INTO OUR DATABASE
    res.status(200).json({
      message: "image added successfully",
      data: req.files.pic,
    });
  }
  // SEND A 400 RES STATUS IF IMAGE IS NOT FOUND
  else {
    res.status(400).json({
      message: "image not found",
    });
  }
};

exports.getpics = (req, resp) => {
  console.log(req.email);
  let image = "";
  let mime = "";
  let firstname = "",
    lastname = "";
  client
    .query(
      `SELECT firstname, lastname, img, mime FROM details WHERE email = '${req.email}'`
    )
    .then((res) => {
      firstname = res.rows[0].firstname;
      lastname = res.rows[0].lastname;
      image = res.rows[0].img;
      mime = res.rows[0].mime;
      resp.status(200).json({
        message: "image fetched successfully",
        //  data: `<img src='data:${mime};base64,${image}'>`
        data: `data:${mime};base64,${image}`,
        firstname: firstname,
        lastname: lastname,
      });
    })
    .catch((e) =>
      resp.status(500).json({
        message: "user not found",
        error: e,
      })
    );
  // let img_length = 0;
  // let bg_images = [];
  // let mime =[];
  // client
  //   .query('SELECT img, mime FROM profilepic WHERE')

  //   .then((res) => {
  //   img_length = res.rows.length;
  //   res.rows.forEach((data) => {
  //     bg_images.push(data.img);

  //     mime.push((data.mime).toString('base64'));
  //   });
  //   console.log(bg_images);
  //   console.log(img_length)
  //   resp.render('img', {img_length:img_length , mime:mime, image:bg_images});
  //   })
  //   .catch(e => console.error(e.stack));
};
exports.profile = (req, res) => {
  let image = "";
  let mime = "";
  client
    .query(`SELECT * FROM details WHERE email='${req.email}';`)
    .then((data) => {
      userData = data.rows;
      image = data.rows[0].img;
      mime = data.rows[0].mime;
      if (userData.length === 0) {
        res.status(400).json({
          message: "user does not exis!",
        });
      } else {
        res.status(200).json({
          message: "profile fetched successfully",
          username: userData[0].username,
          firstname: userData[0].firstname,
          lastname: userData[0].lastname,
          email: userData[0].email,
          phonenumber: userData[0].phonenumber,
          dob: userData[0].dob,
          data: `data:${mime};base64,${image}`,
        });
      }
    });
};

exports.createnewpost = (req, res) => {
  console.log("in create new post");
  // console.log(req.body);
  // const data = req.files.image;
  // console.log(data);
  // console.log(req.headers);
  // console.log(req.email);
  // console.log(req.body.content);
  // res.status(200).json({
  //   message: "phew!!"
  // })

  // console.log("email, " + req.email);
  // console.log(req.headers);
  const data = req.files.image;
  const imgdata = data.data.toString("base64");
  const mime = data.mimetype;
  if (data) {
    client
      .query(
        `INSERT INTO posts (email, content, postsimg, postsmime) VALUES  ('${req.email}', '${req.body.content}', bytea('${imgdata}'), '${mime}');`
      )
      .catch((err) => {
        console.log(err);
      });
    res.status(200).json({
      message: "image added successfully",
      // data: req.files.pic,
    });
  } else {
    res.status(400).json({
      message: "image not found",
    });
  }
};

exports.getallposts = (req, resp) => {
  let temp=[];
  client
  .query(`SELECT posts.email, content, firstname, lastname, posts.postsimg, posts.postsmime, img, mime from posts INNER JOIN details ON posts.email=details.email;`)
  .then((res) => {
    res.rows.forEach((data) => {
      let innertemp={
        "email": data.email,
        "firstname": data.firstname,
        "lastname": data.lastname,
        "content": data.content,
        "profilepic": "data:"+data.mime+";base64,"+data.img,
        "postspic": "data:"+data.postsmime+";base64,"+data.postsimg,
      };
      temp.push(innertemp);
    })
    resp.status(200).json({temp});
  });
};
