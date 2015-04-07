var bcrypt = require('bcrypt-nodejs');

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
                callback(null, savedUser);
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
        callback(null, savedLinkPost);
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
function createNewTextPost(author, title, selfText, url, subpy, callback) {
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
    knex('post').select('*')
    .join('subpy', 'subpy.name', '=', 'post.subpy')
    .orderBy('creation_time', 'desc')
    .limit(limit)
    .then(function(rows) {
        callback(rows);
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

module.exports = {
    User: User,
    Post: Post,
    Subpy: Subpy,
    createNewUser: createNewUser,
    createNewLinkPost: createNewLinkPost,
    createNewTextPost: createNewTextPost,
    grabUser: grabUser,
    grabUserByUsername: grabUserByUsername,
    getRecentPosts: getRecentPosts,
    doesSubpyExist: doesSubpyExist
};
