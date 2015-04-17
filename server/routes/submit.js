var express = require('express');
var router = express.Router();
var config = require('../../config');
var Model = require('../model');

function upvote(userId, postId) {
    console.log('upvoting');
    Model.upvote(userId, postId, function(err) {
        if (err) {
            console.err(err);
        } else {
            console.log('Successfully submitted and upvoted post!');
        }
    });
}
router.get('/:subpy/submit', function(req, res, next) {
    var subpy = req.params.subpy;

    if (req.user === undefined) {
        res.redirect('/signin?error=post_before_login');
    } else {
        var isTextPost = req.query.text;
        res.render('newpost', {
            title: config.websiteName,
            subpy: subpy,
            textPost: isTextPost
        });
    }
});

router.post('/:subpy/submit', function(req, res, next) {
    var body = req.body;
    var user = req.user;

    if (body.link) {
        Model.createNewLinkPost(user.username, body.title, body.link, req.params.subpy, function(err, submittedPost) {
            upvote(user.id, submittedPost.id);
        });
    } else {
        Model.createNewTextPost(user.username, body.title, body.selftext, req.params.subpy, function(err, submittedPost) {
            upvote(user.id, submittedPost.id);
        });
    }

    res.redirect('/r/' + req.params.subpy);
});

module.exports = router;
