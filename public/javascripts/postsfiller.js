var scriptDOM = document.getElementById('postfiller-script');
var subpy = scriptDOM.getAttribute('subpy');
var commentsRoute = '/r/' + subpy + '/comments/'
var defaultURL = '/posts/r/' + subpy + '?age=alltime&sort_by=top';

// Milliseconds for every ajax call to the server
var pollInterval = 4000;

var App = React.createClass({
    getInitialState: function() {
        return {
            posts: [],
            upvotePool: {}
        };
    },
    updateUpvotePool: function(postId, isUpvoting) {
        var newUpvotePool = this.state.upvotePool;
        newUpvotePool[postId] = isUpvoting;
        this.setState(newUpvotePool);
    },
    updatePostsAfterUpvote: function(postId, isUpvoting) {
        var updatedPosts = findAndUpdateUpvoted(this.state.posts, postId, isUpvoting);
        this.setState({posts: updatedPosts});
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
                console.log(data);
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
        var props = this.props;

        var posts = this.props.posts.map(function(post) {
            var commentsURL = props.commentsRoute + post.id

            return (
                <Post
                    handleUpvote={props.handleUpvote}
                    handleRemoveUpvote={props.handleRemoveUpvote}
                    post={post}
                    upvoteImageURL={props.upvoteImageURL}
                    upvotedImageURL={props.upvotedImageURL}
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
