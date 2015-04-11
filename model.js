var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var config = require('./config');

var knex = require('knex')({
    client: 'postgres',
    // Uncomment to enable SQL query logging in console.
    debug   : true,
    connection: {
        host    : '127.0.0.1',
        user    : 'postgres',
        password: 'postgres',
        database: 'pyramus',
        charset : 'utf8',
        timezone: 'UTC'
    }
});

var DB = require('bookshelf')(knex);

var User = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'id',
    hasTimestamps: ['creation_time']
});

var Post = DB.Model.extend({
    tableName: 'post',
    idAttribute: 'id',
    hasTimestamps: ['creation_time']
});

var Subpy = DB.Model.extend({
    tableName: 'subpy',
    idAttribute: 'id',
    hasTimestamps: ['creation_time']
});

// ------------------------------
// createNewUser
// ------------------------------
// Makes a new user in the database with
// automatic incremented ID. Then, returns
// that user's ID after the user is created.
function createNewUser(username, password, callback) {
    // Try to fetch a user with the same username
    new User({ username: username }).fetch().then(function(fetchedUser) {
        // If user already exists, callback with an error.
        if (fetchedUser) {
            callback('Error: username already exists', null);
        } else {
            // User does not exist.
            // Hash the password and create the user.
            var hashedPassword = bcrypt.hashSync(password);
            var newUserValues = {
                username: username,
                password: hashedPassword,
                posts_score: 0,
                comment_score: 0
            };

            new User(newUserValues).save().then(function(savedUser) {
                callback(null, savedUser.toJSON());
            });
        }
    });
}

// ------------------------------
// createNewLinkPost
// ------------------------------
// Makes a new link posting. calls
// back the newly made post once done.
// NOTE: Does not check for whether the
// user or subpy exists or not. This is
// done on the application level.
function createNewLinkPost(author, title, url, subpy, callback) {
    var newPostValues = {
        author: author,
        title: title,
        url: url,
        score: 0,
        subpy: subpy
    }

    new Post(newPostValues).save().then(function(savedLinkPost) {
        callback(null, savedLinkPost.toJSON());
    });
}

// ------------------------------
// createNewTextPost
// ------------------------------
// Makes a new text posting. calls
// back the newly made post once done.
// NOTE: Does not check for whether the
// user or subpy exists or not. This is
// done on the application level.
function createNewTextPost(author, title, selfText, subpy, callback) {
    var newPostValues = {
        author: author,
        title: title,
        self_text: selfText,
        score: 0,
        subpy: subpy
    }

    new Post(newPostValues).save().then(function(savedTextPost) {
        callback(null, savedTextPost);
    });
}

// ------------------------------
// grabUser
// ------------------------------
// Returns a user given a user id.
function grabUser(userId, callback) {
    new User({id: userId}).fetch().then(function(fetchedUser) {
        if (fetchedUser) {
            callback(null, fetchedUser.toJSON());
        } else {
            callback('User not found.', null);
        }
    });
}

// ------------------------------
// upvote
// ------------------------------
// Upvotes a post, given user.id
// and post.id
function upvote(userId, postId, callback) {
    // pg automatically increments post author's score so we don't have to do it.
    // Here we are inserting if not exists
    knex.raw('INSERT INTO upvoted (user_id, post_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT user_id, post_id FROM upvoted WHERE user_id=$1 AND post_id=$2)', [userId, postId]).then(function() {
        callback();
    });
}

// ------------------------------
// removeUpvote
// ------------------------------
// Stops the upvoting
function removeUpvote(userId, postId, callback) {
    knex.raw('DELETE FROM upvoted WHERE user_id=$1 AND post_id=$2', [userId, postId]).then(function() { callback() });
}

// ------------------------------
// grabUserByUsername
// ------------------------------
// Returns a user given a username.
function grabUserByUsername(username, callback) {
    new User({username: username}).fetch().then(function(fetchedUser) {
        if (fetchedUser) {
            callback(null, fetchedUser.toJSON());
        } else {
            callback('User not found.', null);
        }
    });
}

// ------------------------------
// getRecentPosts
// ------------------------------
// get [limit] amount of most recent posts in a
// subreddit
function getRecentPosts(subpy, limit, callback) {
    // Not sure how to do age(post.creation_time) with knex without using raw query. Until then I will use raw query.
    knex.raw('SELECT *, now() - post.creation_time as age FROM post WHERE post.subpy=$1 ORDER BY post.creation_time DESC LIMIT $2', [subpy, limit]).then(function(result) {
        callback(result.rows);
    });
}

// ------------------------------
// getPostsLoggedIn
// ------------------------------
// Given a username, gets the posts
// and shows whether the user upvoted the
// post or not.
function getPostsLoggedIn(userId, subpy, sortBy, ageWord, limit, callback) {
    var orderBy = '';
    var maxAge = '';

    if (sortBy === 'new') {
        orderBy = 'age DESC';
    }
    else if (sortBy === 'top') {
        orderBy = 'post.score DESC';
    }

    var confAges = config.supportedAgeWords;
    for (var i = 0, len = confAges.length; i < len; i++) {
        if (ageWord === confAges[i]) {
            maxAge = '1 ' + confAges[i];
        }
    }

    if (ageWord === 'all time') {
        // TODO: Hacky but works. A less hacky solution would be great.
        maxAge = '100000 years'
    }

    var ageSelection = 'now() - post.creation_time';

    var query = 'SELECT DISTINCT ON (post.id) *, user_id, CASE WHEN user_id=$1 THEN true ELSE false END as upvoted, ' + ageSelection + ' as age FROM post LEFT OUTER JOIN upvoted ON post_id = post.id WHERE subpy=$2 AND ' + ageSelection + ' < INTERVAL \'' + maxAge + '\' ORDER BY post.id, upvoted DESC, $3 DESC LIMIT $4';

    var queryBindings = [userId, subpy, orderBy, limit];

    knex.raw(query, queryBindings).then(function(result) {
        callback(result.rows);
    });
}


// ------------------------------
// doesSubpyExist
// ------------------------------
// Checks to see whether a subpy
// exists or not, then returns the
// answer via callback.
function doesSubpyExist(subpy, callback) {
    knex('subpy').count('*')
    .where('name', '=', subpy)
    .then(function(rows) {
        if (rows[0].count === '1') {
            callback(true);
        } else {
            callback(false);
        }
    });
}

// ------------------------------
// getSubpys
// ------------------------------
// Get all subpys available, with limit.
function getSubpys(limit, callback) {
    knex('subpy').select('*').limit(limit).then(function(rows) {
        callback(rows);
    });
}

module.exports = {
    User: User,
    Post: Post,
    Subpy: Subpy,
    createNewUser: createNewUser,
    createNewLinkPost: createNewLinkPost,
    createNewTextPost: createNewTextPost,
    grabUser: grabUser,
    grabUserByUsername: grabUserByUsername,
    upvote: upvote,
    removeUpvote: removeUpvote,
    getRecentPosts: getRecentPosts,
    getPostsLoggedIn: getPostsLoggedIn,
    doesSubpyExist: doesSubpyExist,
    getSubpys: getSubpys
};
