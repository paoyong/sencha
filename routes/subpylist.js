var express = require('express');
var router = express.Router();
var Model = require('../model');
var config = require('../config');

router.get('/', function(req, res, next) {
    var limit = req.query.limit;
    if (!limit) {
        limit = config.numPostsToShow;
    }

    Model.getSubpys(limit, function(rows) {
        res.send(rows);
    });
});

module.exports = router;
