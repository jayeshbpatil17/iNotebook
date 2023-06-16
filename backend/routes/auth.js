const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Harryisgoodb$oy";

//ROUTE 1 :  create a user using :POST "api/auth/createuser"... it doesn't required login
router.post(
  "/createuser",
  [
    body("name", "Enter the valid name ").isLength({ min: 3 }),
    body("email", "Enter the valid email ").isEmail(),
    body("password", "Password must be 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there are errors , return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check wether the email exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a usrer with this email is already exist" });
      }

      //bcrypt js password hashing  =  salt , papper
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      //res.json(user);

      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
    // .then((user) => res.json(user))
    // .catch((err) => {
    //   console.log(err);
    //   res.json({
    //     error: "please enter a unique value for email ",
    //     message: err.message,
    // });
  }
);

//ROUTE 2 : create a user using :POST "api/auth/login"... it doesn't required login
router.post(
  "/login",
  [
    body("email", "Enter the valid email ").isEmail(),
    body("password", "Password cannot be blank").exists({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "please try to  login with correct id password " });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ errors: "please try to  login with correct id password " });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//ROUTE 3 :  get logged in user details  :POST "api/auth/getuser"...Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
