var express = require('express');
var config = require('../config');
var router = express.Router();
var Model = require('../model');

router.get('/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;

    res.render('index', { 
        title: config.websiteName,
        subpy: subpy,
        user: req.user
    });
});

router.get('/:subpy/submit', function(req, res, next) {
    var subpy = req.params.subpy;

    if (req.user === undefined) {
        res.redirect('/signin?error=post_before_login');
    } else {
        res.render('newpost', {
            title: config.websiteName,
            subpy: subpy
        });
    }
});

router.post('/:subpy/submit', function(req, res, next) {
    var body = req.body;
    var user = req.user;

    if (body.link) {
        Model.createNewLinkPost(user.username, body.title, body.link, req.params.subpy, function(submittedPost) {
            console.log(submitttedPost);
        });
    } else {

    }

    res.redirect('/r/' + req.params.subpy);
});

module.exports = router;
