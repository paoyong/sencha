/** @jsx React.DOM */

var converter = new Showdown.converter();

var Comment = React.createClass({
    propTypes: {
        handleUpvote       : React.PropTypes.func.isRequired,
        handleRemoveUpvote : React.PropTypes.func.isRequired,
        handleReply        : React.PropTypes.func.isRequired,
        comment            : React.PropTypes.shape({
            id      : React.PropTypes.string,
            author  : React.PropTypes.string,
            message : React.PropTypes.string,
            score   : React.PropTypes.number,
            age     : React.PropTypes.object,
            subpy   : React.PropTypes.string,
            path    : React.PropTypes.array,
            depth   : React.PropTypes.number,
            upvoted : React.PropTypes.bool
        }),
        upvoteImageURL  : React.PropTypes.string.isRequired,
        upvotedImageURL : React.PropTypes.string.isRequired,
        usernameRoute   : React.PropTypes.string.isRequired,
    },
    handleReply: function() {

    },
    render: function() {
        var comment = this.props.comment;
        var className = "comment " + "depth" + comment.depth;

        return (
            <li className={className}>
                <CommentTopBanner
                    author        = {comment.author}
                    score         = {comment.score}
                    age           = {comment.age}
                    usernameRoute = {this.props.usernameRoute}
                />
                <CommentMessage
                    message={comment.message}
                />
                <CommentBottomBanner
                    upvoted            = {comment.upvoted} 
                    handleUpvote       = {this.props.handleUpvote}
                    handleRemoveUpvote = {this.props.handleRemoveUpvote}
                    upvoteImageURL     = {this.props.upvoteImageURL}
                    upvotedImageURL    = {this.props.upvotedImageURL}
                    commentId          = {comment.id}
                    onReply            = {this.handleReply}
                />
            </li>
        );
    }
});

var CommentMessage = React.createClass({
    propTypes: {
        message: React.PropTypes.string
    },
    render: function() {
        var rawMarkup = converter.makeHtml(this.props.message);

        return <span className="comment-message" dangerouslySetInnerHTML={{__html: rawMarkup}} />

    }
});

var CommentTopBanner = React.createClass({
    propTypes: {
        author : React.PropTypes.string.isRequired,
        score  : React.PropTypes.number.isRequired,
        age    : React.PropTypes.object.isRequired
    },
    render: function() {
        var ageString = getAgeString(this.props.age);
        var authorHref = this.props.usernameRoute + this.props.author;

        return (
            <p className="comment-top-banner">
                <a href={authorHref} className="comment-author">{this.props.author}</a>
                <span className="comment-score"> • {this.props.score} points </span>
                <span className="comment-age"> {ageString} ago </span>
            </p>
        );
    }
});

var CommentBottomBanner = React.createClass({
    propTypes: {
        upvoted: React.PropTypes.bool.isRequired,
        handleUpvote: React.PropTypes.func.isRequired,
        handleRemoveUpvote: React.PropTypes.func.isRequired,
        onReply: React.PropTypes.func.isRequired,
        upvoted: React.PropTypes.bool,
        upvoteImageURL: React.PropTypes.string,
        upvotedImageURL: React.PropTypes.string,
        commentId: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            <p className="comment-bottom-banner">
                <UpvoteButton
                    upvoted={this.props.upvoted}
                    onUpvote={this.props.handleUpvote}
                    onRemoveUpvote={this.props.handleRemoveUpvote}
                    upvoteImageURL={this.props.upvoteImageURL}
                    upvotedImageURL={this.props.upvotedImageURL}
                    targetId={this.props.commentId}
                    defaultClassName="comment-upvote-button"
                />
            </p>
        );
    }
});