const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
});

router.get('/register', (req, res) => {
    res.render('register');
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
});

router.get('/login', (req, res) => {
    res.render('login');
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
});

router.get("/main", (req, res) => {
    res.render('main')
});

router.get("/ele", (req, res) => {
    res.render('ele')
});

router.get("/ele1", (req, res) => {
    res.render('ele1')
});

router.get("/ele2", (req, res) => {
    res.render('ele2')
});

router.get("/ele3", (req, res) => {
    res.render('ele3')
});

router.get("/ele4", (req, res) => {
    res.render('ele4')
});

router.get("/ele5", (req, res) => {
    res.render('ele5')
});

router.get("/cer", (req, res) => {
    res.render('cer')
});


module.exports = router;