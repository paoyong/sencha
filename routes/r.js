var express = require('express');
var config = require('../config');
var router = express.Router();
var Model = require('../model');

router.get('/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;

    Model.doesSubpyExist(subpy, function(doesExist) {
        if (doesExist === true) {
            res.render('index', {
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

module.exports = router;
