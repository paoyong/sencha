var express = require('express');
var config = require('../config');
var router = express.Router();

router.get('/:subpy', function(req, res, next) {
    var subpy = req.params.subpy;
    res.render('index', { 
        title: config.websiteName,
        subpy: subpy
    });
});


module.exports = router;
