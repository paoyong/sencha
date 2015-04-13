var scriptDOM = document.getElementById('comment-thread-script');
var postId = scriptDOM.getAttribute('postId');
var commentsGETURL = '/comments/' + postId;
var pollInterval = 4000;

var App = React.createClass({
    getInitialState: function() {
        return {
            comments: [],
        };
    },
    handleUpvote: function(commentId) {
        console.log(commentId);
        //TODO
    },
    handleRemoveUpvote: function(commentId) {
        console.log(commentId);
        //TODO
    },
    handleCommentSubmit: function(message) {
        $.ajax({
            url: '/comments/reply/' + postId,
            dataType: 'json',
            type: 'POST',
            data: {message: message},
            success: function(data) {
                console.log(data);
                // this.addComment(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({comments: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="comment-thread-app">
                <CommentForm
                    onCommentSubmit={this.handleCommentSubmit}
                />
                <CommentThread
                    comments={this.state.comments}
                    usernameRoute={this.props.usernameRoute}
                    upvoteImageURL={this.props.upvoteImageURL}
                    upvotedImageURL={this.props.upvotedImageURL}
                    handleUpvote={this.handleUpvote}
                    handleRemoveUpvote={this.handleRemoveUpvote}
                />
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        var message = React.findDOMNode(this.refs.message).value.trim();

        if (!message) {
            return;
        }

        this.props.onCommentSubmit(message);
        React.findDOMNode(this.refs.message).value = '';
    },
    render: function() {
        return (
            <form className='new-comment-form' onSubmit={this.handleSubmit}>
                <textarea type='text' ref='message' maxLength='300' placeholder='Reply to thread...' className="thread-reply-textarea"/>
                <br />
                <input type='submit' value='Reply' />
            </form>
        );
    }
});

var CommentThread = React.createClass({
     propTypes: {
        comments           : React.PropTypes.array,
        handleUpvote       : React.PropTypes.func.isRequired,
        handleRemoveUpvote : React.PropTypes.func.isRequired,
        handleReply        : React.PropTypes.func.isRequired,
        upvoteImageURL     : React.PropTypes.string.isRequired,
        upvotedImageURL    : React.PropTypes.string.isRequired,
        usernameRoute      : React.PropTypes.string.isRequired,
    },
    render: function() {
        var props = this.props;
        var comments = this.props.comments.map(function(comment) {
            return (
                <Comment
                    comment={comment}
                    handleUpvote={props.handleUpvote}
                    handleRemoveUpvote={props.handleRemoveUpvote}
                    upvoteImageURL={props.upvoteImageURL}
                    upvotedImageURL={props.upvotedImageURL}
                    usernameRoute={props.usernameRoute}
                />
            );
        });

        return (
            <ul className="comment-thread">
                {comments}
            </ul>
        );
    }
});

React.render(
    <App
        url={commentsGETURL}
        pollInterval={pollInterval}
        usernameRoute='/u/'
        upvoteImageURL='/images/upvote_comment.svg'
        upvotedImageURL='/images/upvoted_comment.svg'
    />,
    document.getElementById("react-comment-app-mount")
);
