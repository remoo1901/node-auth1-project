const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("./users-model");
const restrict = require("../database/middleware/restrict");

const router = express.Router();

//:::::::::::::::::::::::
// GET users
//:::::::::::::::::::::::

router.get("/users", restrict(), async (req, res, next) => {
  try {
    res.json(await Users.find());
  } catch (err) {
    next(err);
  }
});

//:::::::::::::::::::::::
// Register new user
//:::::::::::::::::::::::

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: "username is already taken",
      });
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password, 2),
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

//:::::::::::::::::::::::
// Login
//:::::::::::::::::::::::

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    if (!user) {
      res.status(401).json({
        message: " Invalid Credentials",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    req.session.user = user;

    res.json({
      message: `welcome ${user.username}!`,
    });
  } catch (err) {
    next(err);
  }
});

//:::::::::::::::::::::::
// Logout
//:::::::::::::::::::::::

router.get("/logout", async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(204).end();
      }
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router;