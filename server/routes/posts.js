var express = require('express');
var config = require('../../config');
var check = require('../check');
var router = express.Router();
var Model = require('../model.js');

// Get all posts by username
router.get('/u/:username', function(req, res, next) {
    var user = req.params.username;

});

router.get('/r/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;
    var user = req.user;

    var userId;
    if (user) {
        userId = user.id;
    } else {
        userId = null;
    }


    var sortBy = req.query.sort_by;
    var ageWord = req.query.age;
    var limit = req.query.limit;

    var validAgeWord = check.checkIfAgeWordIsValid(ageWord);
    if (!validAgeWord) {
        res.send('Bad query: age word is wrong.');
    }

    // If logged in, get posts as a logged in user to show upvotes.
    Model.getPosts(userId, subpy, sortBy, ageWord, config.numPostsToShow, function(rows) {
        res.send(rows);
    });
});

router.get('/:postId', function(req, res, next) {
    var userId;
    var user = req.user;

    if (!user) {
        userId = null;
    } else {
        userId = user.id;
    }

    Model.getPostById(userId, req.params.postId, function(post) {
        res.status(200);
        res.send(post);
    });
});

// TODO: Find a way to implement calls to upvote a post without relying on routing. Or doing batch upvoting.
router.post('/upvote/:postId', function(req, res, next) {
    var user = req.user;

    if (!user) {
        res.status(401);
        res.send('Cannot upvote - not logged in.');
    } else {
        Model.upvote(user.id, req.params.postId, function() {
            res.status(200);
            res.send('Successfully upvoted post!');
        });
    }
});

router.post('/remove-upvote/:postId', function(req, res, next) {
    var user = req.user;

    if (!user) {
        res.status(401);
        res.send('Cannot upvote - not logged in.');
    } else {
        Model.removeUpvote(user.id, req.params.postId, function() {
            res.status(200);
            res.send('Successfully un-upvoted post!');
        });
    }
});

module.exports = router;
