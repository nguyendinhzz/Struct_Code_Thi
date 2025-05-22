const express = require("express");
const { authenticateJWT } = require("../controller/auth.controller");

const router = express.Router();

// public  login.html
router.get("/login.html", (req, res) => {
    res.sendFile('login.html', { root: './public' });
});

// public  signup.html
router.get("/signup.html", (req, res) => {
    res.sendFile('signup.html', { root: './public' });
});

router.get("/index.html", (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

router.get("/", (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

module.exports = router;