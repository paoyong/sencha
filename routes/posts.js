var express = require('express');
var config = require('../config');
var router = express.Router();
var Model = require('../model.js');

router.get('/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;
    Model.getRecentPosts(subpy, config.numPostsToShow, function(rows) {
        res.send(rows);
    });
});

router.post('/upvote/:postId', function(req, res, next) {
    var user = req.user;

    if (!user) {
        res.redirect('/signin');
    } else {
        
    }
});
module.exports = router;
