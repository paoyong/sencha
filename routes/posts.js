var express = require('express');
var config = require('../config');
var check = require('../check');
var router = express.Router();
var Model = require('../model.js');

router.get('/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;
    var user = req.user;

    var sortBy = req.query.sort_by;
    var ageWord = req.query.age;
    var limit = req.query.limit;

    var validAgeWord = check.checkIfAgeWordIsValid(ageWord);
    if (!validAgeWord) {
        res.send('Bad query: age word is wrong.');
    }

    // If logged in, get posts as a logged in user to show upvotes.
    if (user) {
        Model.getPostsLoggedIn(user.id, subpy, sortBy, ageWord, config.numPostsToShow, function(rows) {
            res.send(rows);
        });
    } else {
        Model.getRecentPosts(subpy, config.numPostsToShow, function(rows) {
            res.send(rows);
        });
    }
});

// TODO: Find a way to implement calls to upvote a post without relying on routing.
router.post('/upvote/:postId', function(req, res, next) {
    var user = req.user;

    if (!user) {
        res.redirect('/signin?error=upvote_before_login');
    } else {
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
