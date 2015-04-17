var express = require('express');
var config = require('../../config');
var router = express.Router();
var passport = require('passport');
var Model = require('../model.js');

// ------------------------------
// signin routes
// ------------------------------
router.get('/signin', function(req, res, next) {
    if (req.query.error === 'post_before_login') {
        res.render('signin', {errorMessage: 'Please login before posting.'});
    }
    else if (req.query.error === 'upvote_before_login') {
        res.render('signin', {errorMessage: 'Please login before upvoting.'});
    }
    else if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signin', { title: config.websiteName });
    }
});

router.post('/signin', function(req, res, next) {
    passport.authenticate('local', {
                         successRedirect: '/',
                         failureRedirect: '/signin'
    }, function(err, user, info) {
        if (err) {
            return res.render('signin', { title: config.websiteName, errorMessage: err.message });
        }

        if (!user) {
            return res.render('signin', { title: config.websiteName, errorMessage: info.message });
        }

        return req.logIn(user, function(err) {
            if (err) {
                return res.render('signin', { title: config.websiteName, errorMessage: err.message });
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
});

// ------------------------------
// signup routes
// ------------------------------
router.get('/signup', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', { title: 'Sign Up' });
    }
});

router.post('/signup', function(req, res, next) {
    // Here, req.body is { username, password }
    var user = req.body;

    // Before making the account, try and fetch a username to see if it already exists.
    var usernamePromise = new Model.User({ username: user.username }).fetch();

    Model.createNewUser(user.username, user.password, function (err, newUser) {
        if (err) {
            res.render('signup', { title: config.websiteName, errorMessage: 'username already exists' });
        } else {
            res.redirect(307, '/signin');
        }
    });
});

// ------------------------------
// singout route
// ------------------------------
router.get('/signout', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/', { errorMessage: 'You are not logged in' });
    } else {
        req.logout();
        res.redirect('/');
    }
});

module.exports = router;
