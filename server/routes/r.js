var express = require('express');
var config = require('../../config');
var router = express.Router();
var Model = require('../model');

router.get('/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;

    Model.doesSubpyExist(subpy, function(doesExist) {
        if (doesExist === true) {
            res.render('subpy', {
                title: config.websiteName,
                subpy: subpy,
                user: req.user
            });
        } else {
            res.render('404', {
                errorMessage: 'Sorry, subpy does not exist.'
            });
        }
    });
});

// Go to comment thread of the post
router.get('/:subpy/comments/:postId', function(req, res, next) {
    var subpy = req.params.subpy;

    res.render('comment-thread', {
        title: config.websiteName,
        subpy: subpy,
        user: req.user,
        postId: req.params.postId
    });
});

module.exports = router;
