/** @jsx React.DOM */

var Comment = React.createClass({
    propTypes: {
        handleUpvote: React.PropTypes.func.isRequired,
        handleRemoveUpvote: React.PropTypes.func.isRequired,
        comment: React.PropTypes.shape({
            id: React.PropTypes.string,
            author: React.PropTypes.string,
            message: React.PropTypes.string,
            score: React.PropTypes.number,
            age: React.PropTypes.object,
            subpy: React.PropTypes.string,
            path: React.PropTypes.array,
            depth: React.PropTypes.number,
            upvoted: React.PropTypes.bool
        }),
        upvoteImageURL: React.PropTypes.string.isRequired,
        upvotedImageURL: React.PropTypes.string.isRequired,
        commentsURL: React.PropTypes.string.isRequired
    },
    render: function() {
        var comment = this.props.comment;

        return (
            <p>This is a comment</p>
        );
    }
});
