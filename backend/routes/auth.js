const express = require("express");
const User = require("../models/User");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const signature = "welcometoparadise";

const fetchuser = require("../middleware/fetchuser");

// ROUTE 1: create a user using : POST  "/api/auth/createuser"  --> authentication is not req.

router.post(
  "/createuser",
  [
    body("name", "name should have min 4 char").isLength({ min: 4 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],

  async (req, res) => {
    // console.log(req.body);

    // const user = User(req.body);
    // user.save();

    // for errors , return bad req and errors message

    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //promise
    // check if user with email alreay exists

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({
          success,
          error: "user with this email is already registered",
        });
      }
      //hashing
      const salt = await bcrypt.genSalt();
      const secPwd = await bcrypt.hash(req.body.password, salt);

      //create a new user in db
      user = await User.create({
        name: req.body.name,
        password: secPwd,
        email: req.body.email,
      });
      // .then((user) => res.json(user)) //from .catch() -->code is for displaying the error for unique email
      // .catch((err) => {
      //   console.log(err);
      //   res.json({ error: "please enter different email!!!" });
      // });

      //jwt for autherisation of a user

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, signature);

      // res.send("hello");
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error"); // if we have some error in program this wil help us
    }
  }
);

//ROUTE 2 : authenticate  a user using : POST  "/api/auth/login"  --> login not required

router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password can not be empty").notEmpty(),
  ],
  async (req, res) => {
    let success = false;
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
          .json({ error: "please enter correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "please enter correct credentials!!" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, signature);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

//ROUTE 3:  get logged in user details using POST  "/api/auth/getuser"  --> login  required

router.post("/getuser", fetchuser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); //except password everything will be selected
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

module.exports = router;
