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

var Comment = DB.Model.extend({
    tableName: 'comments',
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
                comments_score: 0
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
    knex.raw('DELETE FROM upvoted WHERE user_id=$1 AND post_id=$2', [userId, postId]).then(function() {
        callback()
    });
}


// ------------------------------
// commentUpvote
// ------------------------------
function commentUpvote(userId, commentId, callback) {
    knex.raw('INSERT INTO comment_upvoted (user_id, comment_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT user_id, comment_id FROM comment_upvoted WHERE user_id=$1 AND comment_id=$2)', [userId, commentId]).then(function() {
        callback();
    });

}

// ------------------------------
// removeCommentUpvote
// ------------------------------
function removeCommentUpvote(userId, commentId, callback) {
    knex.raw('DELETE FROM comment_upvoted WHERE user_id=$1 AND comment_id=$2', [userId, commentId]).then(function() {
        callback()
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
// getPosts
// ------------------------------
// Given a username, gets the posts
// and shows whether the user upvoted the
// post or not.
function getPosts(userId, subpy, sortBy, ageWord, limit, callback) {
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
        maxAge = '100000 years'
    }

    var ageSelection = 'now() - post.creation_time';

    var select = 'post.id, post.author, post.title, post.url, post.self_text, post.score, post.subpy, post.comment_count';

    var maxAgeWhereClause = 'AND ' + ageSelection + ' < INTERVAL \'' + maxAge + '\''

    var query = '';
    var queryBindings = [];

    // If not logged in, no need to do all those joins
    if (userId === null) {
        query = 'SELECT ' + select + ', ' + ageSelection + ' as age FROM post WHERE post.subpy=$1 ' + maxAgeWhereClause + ' ORDER BY $2 LIMIT $3';
        queryBindings = [subpy, orderBy, limit];
    } else {
        query = 'SELECT DISTINCT ON (post.id) ' + select + ', CASE WHEN user_id=$1 THEN true ELSE false END as upvoted, ' + ageSelection + ' as age FROM post LEFT OUTER JOIN upvoted ON post_id = post.id WHERE subpy=$2 ' + maxAgeWhereClause + ' ORDER BY post.id, upvoted DESC, $3 LIMIT $4';

        queryBindings = [userId, subpy, orderBy, limit];
    }

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

// ------------------------------
// getComments
// ------------------------------
// Given a postId, returns a comment thread
function getComments(userId, postId, callback) {
    // Query adapted from http://cramer.io/2010/05/30/scaling-threaded-comments-on-django-at-disqus/
    var commentThreadQuery = 'WITH RECURSIVE cte (id, author, message, score, creation_time, post_id, path, parent_id, depth)  AS ( SELECT  id, author, message, score, creation_time, post_id, array[id] AS path, parent_id, 1 AS depth FROM    comments WHERE   parent_id IS NULL UNION ALL SELECT  comments.id, comments.author, comments.message, comments.score, comments.creation_time, comments.post_id, cte.path || comments.id, comments.parent_id, cte.depth + 1 AS depth FROM    comments JOIN cte ON comments.parent_id = cte.id) SELECT id, author, message, score, now() - creation_time as age, path, depth, parent_id FROM cte WHERE post_id=$1 ORDER BY path';

    var query = commentThreadQuery;

    if (userId) {
        // The same as getPosts when user is logged in - we want to join with comment_upvoted to determine if upvoted or not.
        query = 'SELECT DISTINCT ON (c.id) c.id, author, message, score, age, path, depth, parent_id (CASE WHEN user_id = 1 THEN true ELSE false END) as upvoted FROM (' + commentThreadQuery + ') c LEFT OUTER JOIN comment_upvoted ON c.id = comment_id;';
    }

    knex.raw(query, [postId]).then(function(result) {
        callback(result.rows);
    });
}

// ------------------------------
// postComment
// ------------------------------
function postComment(author, postId, message, parentId, callback) {
    knex.raw('INSERT INTO comments (author, message, parent_id, post_id) VALUES ($1, $2, $3, $4)', [author, message, parentId, postId]).then(function(newComment) {
        callback(newComment);
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
    getPosts: getPosts,
    doesSubpyExist: doesSubpyExist,
    getSubpys: getSubpys,
    getComments: getComments,
    postComment: postComment,
    removeUpvote: removeUpvote,
    commentUpvote: commentUpvote,
    removeCommentUpvote: removeCommentUpvote
};
