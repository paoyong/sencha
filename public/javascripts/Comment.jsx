/** @jsx React.DOM */

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
        commentsURL     : React.PropTypes.string.isRequired
    },
    render: function() {
        var comment = this.props.comment;
        var className = "comment " + "depth" + comment.depth;

        return (
            <li className={className}>
                <CommentTopBanner
                    author = {comment.author}
                    score  = {comment.score}
                    age    = {comment.age}
                />
                <p className="comment-message">{comment.message}</p>
            </li>
        );
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

        return (
            <p className="comment-top-banner">
                <span className="comment-author">{this.props.author}</span>
                <span className="comment-score"> | {this.props.score} points </span>
                <span className="comment-age"> | {ageString} ago </span>
            </p>
        );
    }
});

// var CommentBottomBanner = React.createClass({
//     propTypes: {
//         handleReply: React.PropTypes.func.isRequired
//     },
//     render: function() {
//         return (
//         );
//     }
// });
