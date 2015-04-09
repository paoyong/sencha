var express = require('express');
var config = require('../config');
var router = express.Router();
var Model = require('../model.js');

router.get('/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;
    var user = req.user;

    if (user) {
// function getRecentPostsWithUpvotes(userId, subpy, limit, callback) {
        Model.getRecentPostsWithUpvotes(user.id, subpy, config.numPostsToShow, function(rows) {
            res.send(rows);
        })
    } else {
        Model.getRecentPosts(subpy, config.numPostsToShow, function(rows) {
            res.send(rows);
        });
    }
});

router.post('/upvote/:postId', function(req, res, next) {
    var user = req.user;

    if (!user) {
        res.redirect('/signin?error=upvote_before_login');
    } else {
        // function upvote(userId, postId, callback) {
        Model.upvote(user.id, req.params.postId, function() {
            console.log('upvoted');
        });
    }
});

router.post('/remove-upvote/:postId', function(req, res, next) {
    var user = req.user;

    if (!user) {
        res.redirect('/signin?error=upvote_before_login');
    } else {
        // function upvote(userId, postId, callback) {
        Model.removeUpvote(user.id, req.params.postId, function() {
            console.log('Removed upvote');
        });
    }
});
module.exports = router;
