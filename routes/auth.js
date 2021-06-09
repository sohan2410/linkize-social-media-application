
const express = require("express");
const { signUp, signIn, googleauth } = require("../controllers/auth");
const router = express.Router();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/googleauth", googleauth);

module.exports = router;