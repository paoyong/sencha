var express = require('express');
var config = require('../config');
var router = express.Router();
var Model = require('../model.js');

router.get('/:postId', function(req, res, next) {
    var postId = req.params.postId;

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

router.post('/reply/:postId') {
    var user = req.user;
    var parent_id = req.query.parent_id;

    if (!parent_id) {
        parent_id = null;
    }

    Model.postComment(user.username, req.params.postId, parent_id, function(savedComment) {
        console.log('Added comment');
    });
}
module.exports = router;
