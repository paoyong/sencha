var express = require('express');
var config = require('../../config');
var router = express.Router();
var passport = require('passport');
var Model = require('../model.js');

// ------------------------------
// Home page
// ------------------------------
router.get('/', function(req, res, next) {
    // TODO: This is currently hacky right now.
    res.redirect('/r/reactjs');
    // res.render('index', { title: config.websiteName, subpy: 'front page', user: req.user });
});

module.exports = router;
