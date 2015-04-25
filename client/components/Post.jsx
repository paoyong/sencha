/** @jsx React.DOM */

var PointsBanner = require('./PointsBanner.jsx');
var UpvoteButton = require('./UpvoteButton.jsx')
var helpers = require('../helper-functions.js');
var React = require('react');

var Post = React.createClass({
    propTypes: {
        handleUpvote: React.PropTypes.func,
        handleRemoveUpvote: React.PropTypes.func,
        post: React.PropTypes.shape({
            id: React.PropTypes.string,
            author: React.PropTypes.string,
            title: React.PropTypes.string,
            url: React.PropTypes.string,
            self_text: React.PropTypes.string,
            score: React.PropTypes.number,
            subpy: React.PropTypes.string,
            upvoted: React.PropTypes.bool,
            comment_count: React.PropTypes.number,
            age: React.PropTypes.object
        }),
        upvoteImageURL: React.PropTypes.string.isRequired,
        upvotedImageURL: React.PropTypes.string.isRequired,
        commentsURL: React.PropTypes.string.isRequired
    },
    render: function() {
        var post = this.props.post;

        var UpvoteButtonProps = {
            upvoted: post.upvoted,
            onUpvote: this.props.handleUpvote,
            onRemoveUpvote: this.props.handleRemoveUpvote,
            upvoteImageURL: this.props.upvoteImageURL,
            upvotedImageURL: this.props.upvotedImageURL,
            targetId: post.id,
            defaultClassName: "post-upvote-button"
        };

        var PostInfoBannerProps = {
            score: post.score,
            age: post.age,
            author: post.author,
            upvoted: post.upvoted,
            commentsURL: this.props.commentsURL,
            commentCount: post.comment_count
        }

        var selfTextBanner = '';
        if (post.self_text) {
            selfTextBanner = <p className="self-text-banner">{post.self_text}</p>
        }
        return (
            <li className="post">
                <UpvoteButton {...UpvoteButtonProps} />
                <PostTitle post={post} commentsURL={this.props.commentsURL} /> <br />
                {selfTextBanner}
                <PostInfoBanner {...PostInfoBannerProps} />
            </li>
        );
    }
});

var PostTitle = React.createClass({
    render: function() {
        var post = this.props.post;
        var postURL = post.url;

        if (postURL === null) {
            postURL = this.props.commentsURL;
        }

        return (
            <a href={postURL} className="post-title">{post.title}</a>
        );
    }
});

var PostInfoBanner = React.createClass({
    render: function() {
        var bannerAge = helpers.getAgeString(this.props.age);
        var authorURL = '/u/' + this.props.author;
        var commentString = helpers.getCommentCountString(this.props.commentCount);

        return (
            <div className="post-info-banner">
                <p>
                    <PointsBanner
                        upvoted={this.props.upvoted}
                        score={this.props.score}
                        defaultClassName="post-points-banner"
                    />
                    &nbsp;• Submitted by <a href={authorURL} className="post-author">{this.props.author}</a> <span className="post-age">{bannerAge}</span> ago • <a href={this.props.commentsURL}>{commentString}</a>
                </p>
            </div>
        );
    }
});

module.exports = Post;
