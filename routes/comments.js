var express = require('express');
var config = require('../config');
var router = express.Router();
var Model = require('../model.js');

router.get('/:postid', function(req, res, next) {
    var postId = req.params.postid;

    var userId;
    if (req.user) {
        userId = req.user.id;
    } else {
        userId = null;
    }

    Model.getComments(userId, postId, function(rows) {
        res.send(rows);
    });
});

module.exports = router;
