const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  getpics,
  newprofilepic,
  profile,
  createnewpost,
  getallposts,
} = require("../controllers/post");
const { verifyToken } = require("../middlewares/verifyToken");
const app = express();
app.use(express.json());
app.use(cors());

router.post("/newprofilepic", newprofilepic);
router.post("/getpics", verifyToken, getpics);
router.get("/profile/:username", profile);
router.post("/createnewpost", verifyToken, createnewpost);
router.get("/getallposts", getallposts);
module.exports = router;
