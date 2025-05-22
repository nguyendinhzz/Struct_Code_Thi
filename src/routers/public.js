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

router.get("/account.html", (req, res) => {
    res.sendFile('account.html', { root: './public' });
});

router.get("/jpy-sell.html", (req, res) => {
    res.sendFile('jpy-sell.html', { root: './public' });
});

router.get("/card-bank.html", (req, res) => {
    res.sendFile('card-bank.html', { root: './public' });
});
router.get("/settings.html", (req, res) => {
    res.sendFile('settings.html', { root: './public' });
});
router.get("/export-data.html", (req, res) => {
    res.sendFile('export-data.html', { root: './public' });
});
router.get("/", (req, res) => {
    res.sendFile('login.html', { root: './public' });
});

module.exports = router;