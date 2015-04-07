var express = require('express');
var router = express.Router();
var Model = require('../model.js');

router.get('/:user', function(req, res, next) {
    var param_user = req.params.user;
    var user = req.user;

    
    if (user && param_user === user.username) {
        res.render('profile', { user: user });
    } else {
        Model.grabUserByUsername(param_user, function(err, fetchedUser) {
            if (err) {
                res.render('profile', {errorMessage: err});
            } else {
                res.render('profile', {user: fetchedUser});
            }
        });
    }
});

module.exports = router;
