var App = React.createClass({
    getInitialState: function() {
        return {
            posts: [],
        };
    },
    handleUpvote: function(postId) {
    },
    handleRemoveUpvote: function(postId) {
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
                <Post />
                <CommentThread />
            </div>
        );
    }
});
React.render(
    <App url={defaultURL} pollInterval={pollInterval}/>,
    document.getElementById("react-posts-app-mount")
);
