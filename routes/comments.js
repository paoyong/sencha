var express = require('express');
var config = require('../config');
var router = express.Router();
var Model = require('../model.js');

router.get('/:postid', function(req, res, next) {
    var postId = req.params.postid
});
