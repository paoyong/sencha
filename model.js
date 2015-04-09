var bcrypt = require('bcrypt-nodejs');
var async = require('async');

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
    async.parallel({
        one: function(callback) {
            knex('upvoted').insert({
                user_id: userId,
                post_id: postId
            }).then(function(insertedRow) {
                callback(insertedRow);
            });
        },
        two: function() {
            knex('users').where('id', '=', userId).increment('posts_score', 1).then();
        },
        three: function() {
            knex('post').where('id', '=', postId).increment('score', 1).then();
        }
    });
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
// getRecentPostsWithUpvotes
// ------------------------------
// Given a username, gets the recent posts
// and shows whether the user upvoted the
// post or not.
function getRecentPostsWithUpvotes(userId, subpy, limit, callback) {
    knex.raw('SELECT *, now() - post.creation_time as age FROM post LEFT OUTER JOIN upvoted on upvoted.post_id = post.id WHERE subpy=$1 AND user_id=$2 OR user_id is null ORDER BY post.creation_time DESC LIMIT $3', [subpy, userId, limit]).then(function(result) {
        callback(result.rows);
    });
}
//
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
    getRecentPosts: getRecentPosts,
    getRecentPostsWithUpvotes: getRecentPostsWithUpvotes,
    doesSubpyExist: doesSubpyExist,
};
