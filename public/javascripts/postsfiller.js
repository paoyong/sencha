var subpy = $('#subpy').text();

// ajax calls every X milliseconds
var pollInterval = 4000;

var App = React.createClass({
    getInitialState: function() {
        return {
            posts: []
        };
    },
    handleUpvote: function(postId) {
        var currPosts = this.state.posts;
        for (var i = 0, len = currPosts.length; i < len; i++) {
            if (currPosts[i].id === postId) {
                // Make it upvoted
                currPosts[i].user_id = 1;
                currPosts[i].score++;
            }
        }
        this.setState({posts: currPosts});

        $.ajax({
            type: 'POST',
            url: '/posts/upvote/' + postId
        });
    },
    handleRemoveUpvote: function(postId) {
        var currPosts = this.state.posts;
        for (var i = 0, len = currPosts.length; i < len; i++) {
            if (currPosts[i].id === postId) {
                // Make it not voted
                currPosts[i].user_id = null;
                currPosts[i].score--;
            }
        }
        this.setState({posts: currPosts});

        $.ajax({
            type: 'POST',
            url: '/posts/remove-upvote/' + postId
        });
    },
    loadPostsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({posts: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadPostsFromServer();
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="posts-app">
            <PostsList handleUpvote={this.handleUpvote} handleRemoveUpvote={this.handleRemoveUpvote} posts={this.state.posts}/>
            </div>
        );
    }
});

var PostsList = React.createClass({
    render: function() {
        var handleUpvote = this.props.handleUpvote;
        var handleRemoveUpvote = this.props.handleRemoveUpvote;
        var posts = this.props.posts.map(function(post) {
            return (
                <Post handleUpvote={handleUpvote} handleRemoveUpvote={handleRemoveUpvote} post={post} />
            );
        });

        return (
            <ul className="postsList">
                {posts}
            </ul>
        );
    }
});

var Post = React.createClass({
    render: function() {
        var post = this.props.post;

        return (
            <li className="post row">
                <UpvoteButton handleUpvote={this.props.handleUpvote} handleRemoveUpvote={this.props.handleRemoveUpvote} postId={post.id} upvoted={post.user_id}/>
                <PostTitle post={post} />
                <PostInfoBanner score={post.score} age={post.age} author={post.author} upvoted={post.user_id} />
            </li>
        );
    }
});

var PostTitle = React.createClass({
    render: function() {
        var post = this.props.post;

        // TODO: Handle case where no self text but is not link
        if (post.selfText) {
            return (
                <span className="post-title">{post.title}</span>
            );
        } else {
            return (
                <a href={post.url} className="post-title">{post.title}</a>
            );
        }
    }
});

var PostInfoBanner = React.createClass({
    grabFormattedAge: function() {
        var bannerAge = '';
        var age = this.props.age;

        if (age.seconds === undefined) {
            age.seconds = 0;
        }

        // Format the age accordingly
        if (age.days) {
            bannerAge = age.days;

            if (age.days === 1) {
                bannerAge += ' day ';
            } else {
                bannerAge += ' days ';
            }
        }
        else if (age.hours) {
            bannerAge = age.hours;

            if (age.hours === 1) {
                bannerAge += ' hour ';
            } else {
                bannerAge += ' hours ';
            }
        }
        else if (age.minutes) {
            bannerAge = age.minutes;

            if (age.minutes === 1) {
                bannerAge += ' minute ';
            } else {
                bannerAge += ' minutes ';
            }
        } else {
            bannerAge = age.seconds;

            if (age.seconds === 1) {
                bannerAge += ' second ';
            } else {
                bannerAge += ' seconds ';
            }
        }

        return bannerAge;
    },
    getPostPointsClassname: function() {
        var ret = 'post-points ';

        if (this.props.upvoted) {
            ret += 'post-points-upvoted'
        } else {
            ret += 'post-points-not-upvoted'
        }

        return ret;
    },
    getFormattedPointsText: function() {
        if (this.props.score === 1) {
            return 'point';
        } else {
            return 'points';
        }
    },
    render: function() {
        var bannerAge = this.grabFormattedAge();
        var postPointsClassname = this.getPostPointsClassname();
        var formattedPointsText = this.getFormattedPointsText();
        var authorURL = '/u/' + this.props.author;

        return (
            <div className="post-info-banner">
                <p>
                    <span className={postPointsClassname}>{this.props.score}</span> {formattedPointsText} | Submitted by <a href={authorURL} className="post-author">{this.props.author}</a> <span className="post-age">{bannerAge}</span> ago
                </p>
            </div>
        );
    }
});

var UpvoteButton = React.createClass({
    getImage: function() {
        if (this.props.upvoted) {
            return "/images/upvoted.svg"
        } else {
            return "/images/upvote.svg"
        }
    },
    getUpvoteFunction: function() {
        if (this.props.upvoted) {
            return this.props.handleRemoveUpvote;
        } else { 
            return this.props.handleUpvote;
        }
    },
    render: function() {
        var imageSrc = this.getImage();
        var upvoteFunction = this.getUpvoteFunction();
        return <img className="upvote-button" src={imageSrc} onClick={upvoteFunction.bind(null, this.props.postId)} className="upvote-button" />
    }
});

React.render(
    <App url={'/posts/' + subpy} pollInterval={pollInterval}/>,
    document.getElementById("react-posts-app-mount")
);
