/** @jsx React.DOM */

var Post = React.createClass({
    propTypes: {
        handleUpvote: React.PropTypes.func.isRequired,
        handleRemoveUpvote: React.PropTypes.func.isRequired,
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
        return (
            <li className="post">
                <UpvoteButton {...UpvoteButtonProps} />
                <PostTitle post={post} />
                <PostInfoBanner {...PostInfoBannerProps} />
            </li>
        );
    }
});

var PostTitle = React.createClass({
    render: function() {
        var post = this.props.post;

        // TODO: Handle case where no self text but is not link
        if (post.selfText) {
            return (
                <span className="post-title">{post.title}</span>
            );
        } else {
            return (
                <a href={post.url} className="post-title">{post.title}</a>
            );
        }
    }
});

var PostInfoBanner = React.createClass({
    render: function() {
        var bannerAge = getAgeString(this.props.age);
        var authorURL = '/u/' + this.props.author;
        var commentString = getCommentCountString(this.props.commentCount);

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
