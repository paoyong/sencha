var scriptDOM = document.getElementById('postfiller-script');
var subpy = scriptDOM.getAttribute('subpy');
var commentsRoute = '/r/' + subpy + '/comments/'
var defaultURL = '/posts/' + subpy + '?age=day&sort_by=new';

// Milliseconds for every ajax call to the server
var pollInterval = 4000;

var App = React.createClass({
    getInitialState: function() {
        return {
            posts: [],
            upvotePool: {}
        };
    },
    sendUpvotesToServer: function() {
        // TODO
    },
    updateUpvotePool: function(postId, isUpvoting) {
        var newUpvotePool = this.state.upvotePool;
        newUpvotePool[postId] = isUpvoting;
        this.setState(newUpvotePool);
    },
    updatePostsAfterUpvote: function(postId, isUpvoting) {
        // Update the state of posts for client side.
        // We are just mimicing server side updates.
        var currPosts = this.state.posts;

        for (var i = 0, len = currPosts.length; i < len; i++) {
            if (currPosts[i].id === postId) {
                currPosts[i].upvoted = isUpvoting;

                if (isUpvoting) {
                    currPosts[i].score++;
                } else {
                    currPosts[i].score--;
                }
            }
        }

        this.setState({posts: currPosts});
    },
    updateAfterUpvote: function(postId, isUpvoting) {
        this.updatePostsAfterUpvote(postId, isUpvoting);
        this.updateUpvotePool(postId, isUpvoting);

        var ajaxURL = '/posts/'
        if (isUpvoting) {
            ajaxURL += 'upvote/' + postId;
        } else {
            ajaxURL += 'remove-upvote/' + postId;
        }

        $.ajax({
            type: 'POST',
            url: ajaxURL
        });
    },
    handleUpvote: function(postId) {
        this.updateAfterUpvote(postId, true);
    },
    handleRemoveUpvote: function(postId) {
        this.updateAfterUpvote(postId, false);
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
                <PostsList
                    handleUpvote={this.handleUpvote}
                    handleRemoveUpvote={this.handleRemoveUpvote}
                    posts={this.state.posts}
                    upvoteImageURL={this.props.upvoteImageURL}
                    upvotedImageURL={this.props.upvotedImageURL}
                    commentsRoute={this.props.commentsRoute}
                />
            </div>
        );
    }
});

var PostsList = React.createClass({
    render: function() {
        var handleUpvote       = this.props.handleUpvote;
        var handleRemoveUpvote = this.props.handleRemoveUpvote;
        var upvoteImageURL     = this.props.upvoteImageURL;
        var upvotedImageURL    = this.props.upvotedImageURL;
        var commentsRoute      = this.props.commentsRoute;

        var posts = this.props.posts.map(function(post) {
            console.log(commentsRoute);
            var commentsURL = commentsRoute + post.id

            return (
                <Post
                    handleUpvote={handleUpvote}
                    handleRemoveUpvote={handleRemoveUpvote}
                    post={post}
                    upvoteImageURL={upvoteImageURL}
                    upvotedImageURL={upvotedImageURL}
                    commentsURL={commentsURL}
                />
            );
        });

        return (
            <ul className="postsList">
                {posts}
            </ul>
        );
    }
});


React.render(
    <App
        url={defaultURL}
        pollInterval={pollInterval}
        upvoteImageURL={"/images/upvote.svg"}
        upvotedImageURL={"/images/upvoted.svg"}
        commentsRoute={commentsRoute}
    />,
    document.getElementById("react-posts-app-mount")
);
