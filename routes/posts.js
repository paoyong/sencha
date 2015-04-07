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

module.exports = router;
