var scriptDOM = document.getElementById('comment-thread-script');
var postId = scriptDOM.getAttribute('postId');
var commentsGETURL = '/comments/' + postId;
var pollInterval = 4000;

var CommentThreadApp = React.createClass({
    getInitialState: function() {
        return {
            comments: [],
        };
    },
    updateCommentsAfterUpvote: function(commentId, isUpvoting) {
        var updatedComments = findAndUpdateUpvoted(this.state.comments, commentId, isUpvoting);
        this.setState({comments: updatedComments});
    },
    updateAfterUpvote: function(commentId, isUpvoting) {
        this.updateCommentsAfterUpvote(commentId, isUpvoting);

        var ajaxURL = '/comments/'
        if (isUpvoting) {
            ajaxURL += 'upvote/' + commentId;
        } else {
            ajaxURL += 'remove-upvote/' + commentId;
        }

        $.ajax({
            type: 'POST',
            url: ajaxURL
        });
    },
    handleUpvote: function(commentId) {
        console.log(commentId);
        this.updateAfterUpvote(commentId, true);
    },
    handleRemoveUpvote: function(commentId) {
        console.log(commentId);
        this.updateAfterUpvote(commentId, false);
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
    handleReply: function(parentId, message) {
        console.log(parentId);
        $.ajax({
            url: '/comments/reply/' + postId + '?parent_id=' + parentId,
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
        })
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
        var CommentThreadProps = {
            handleReply: this.handleReply,
            comments: this.state.comments,
            usernameRoute: this.props.usernameRoute,
            upvoteImageURL: this.props.upvoteImageURL,
            upvotedImageURL: this.props.upvotedImageURL,
            handleUpvote: this.handleUpvote,
            handleRemoveUpvote: this.handleRemoveUpvote
        };

        return (
            <div className="comment-thread-app">
                <CommentForm
                    onCommentSubmit={this.handleCommentSubmit}
                />
                <CommentThread {...CommentThreadProps} />
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
                <input type="submit" value="reply" />
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

        var CommentProps = {
            comment: {},
            handleUpvote: props.handleUpvote,
            handleRemoveUpvote: props.handleRemoveUpvote,
            handleReply: props.handleReply,
            upvoteImageURL: props.upvoteImageURL,
            upvotedImageURL: props.upvotedImageURL,
            usernameRoute: props.usernameRoute
        };

        var comments = this.props.comments.map(function(comment) {
            CommentProps.comment = comment;

            return (
                <Comment {...CommentProps} />
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
    <CommentThreadApp
        url={commentsGETURL}
        pollInterval={pollInterval}
        usernameRoute='/u/'
        upvoteImageURL='/images/upvote_comment.svg'
        upvotedImageURL='/images/upvoted_comment.svg'
    />,
    document.getElementById("react-comment-app-mount")
);
