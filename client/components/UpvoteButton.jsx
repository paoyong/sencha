/** @jsx React.DOM */

var React = require('react');

var UpvoteButton = React.createClass({
    propTypes: {
        upvoted            : React.PropTypes.bool.isRequired,
        onUpvote           : React.PropTypes.func.isRequired,
        onRemoveUpvote     : React.PropTypes.func.isRequired,
        targetId           : React.PropTypes.string.isRequired,
        upvoteImageURL     : React.PropTypes.string.isRequired,
        upvotedImageURL    : React.PropTypes.string.isRequired,
        defaultClassName   : React.PropTypes.string.isRequired
    },
    getImage: function() {
        if (this.props.upvoted) {
            return this.props.upvotedImageURL;
        } else {
            return this.props.upvoteImageURL;
        }
    },
    render: function() {
        var imageSrc = this.getImage();
        var upvoteFunction;
        var upvoteButtonClassName = this.props.defaultClassName;

        var wrapperStyle = {
            display: 'inline-block'
        }

        if (this.props.upvoted) {
            upvoteFunction = this.props.onRemoveUpvote;
            upvoteButtonClassName += " " + this.props.defaultClassName + "-upvoted";
        } else {
            upvoteFunction = this.props.onUpvote;
            upvoteButtonClassName += " " + this.props.defaultClassName + "-not-upvoted";
        }

        return (
            <div className={this.props.defaultClassName + "-wrapper"} style={wrapperStyle}>
                <img
                    className={upvoteButtonClassName}
                    src={imageSrc}
                    onClick={upvoteFunction.bind(null, this.props.targetId)}
                />
            </div>
        );
    }
});

module.exports = UpvoteButton;
