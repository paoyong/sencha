/** @jsx React.DOM */

var PointsBanner = React.createClass({
    propTypes: {
        preText            : React.PropTypes.string,
        postText           : React.PropTypes.string,
        upvoted            : React.PropTypes.bool.isRequired,
        score              : React.PropTypes.number.isRequired,
        defaultClassName   : React.PropTypes.string.isRequired
    },
    getPostPointsClassname: function() {
        var ret = this.props.defaultClassName + ' ';

        if (this.props.upvoted) {
            ret += this.props.defaultClassName + '-upvoted';
        } else {
            ret += this.props.defaultClassName + '-not-upvoted';
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
        var postPointsClassname = this.getPostPointsClassname();
        var formattedPointsText = this.getFormattedPointsText();

        return (
            <span className={postPointsClassname}>{this.props.preText}{this.props.score} {formattedPointsText}{this.props.postText}</span>
        );
    }
});
