/** @jsx React.DOM */

var Post = React.createClass({
    propTypes: {
        handleUpvote: React.PropTypes.func.isRequired,
        handleRemoveUpvote: React.PropTypes.func.isRequired,
        post: React.PropTypes.shape({
            id: React.PropTypes.number,
            author: React.PropTypes.string,
            title: React.PropTypes.string,
            url: React.PropTypes.string,
            self_text: React.PropTypes.string,
            score: React.PropTypes.number,
            subpy: React.PropTypes.string,
            upvoted: React.PropTypes.bool,
            age: React.PropTypes.object
        }),
        upvoteImageURL: React.PropTypes.string.isRequired,
        upvotedImageURL: React.PropTypes.string.isRequired,
        commentsURL: React.PropTypes.string.isRequired
    },
    render: function() {
        var post = this.props.post;

        return (
            <li className="post">
                <UpvoteButton
                    handleUpvote={this.props.handleUpvote}
                    handleRemoveUpvote={this.props.handleRemoveUpvote}
                    postId={post.id}
                    upvoted={post.upvoted}
                    upvoteImageURL={this.props.upvoteImageURL}
                    upvotedImageURL={this.props.upvotedImageURL}
                />
                <PostTitle post={post} />
                <PostInfoBanner
                    score={post.score}
                    age={post.age}
                    author={post.author}
                    upvoted={post.upvoted}
                />
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
    grabFormattedAge: function() {
        var bannerAge = '';
        var age = this.props.age;

        if (age.seconds === undefined) {
            age.seconds = 0;
        }

        // Format the age accordingly
        if (age.days) {
            bannerAge = age.days;

            if (age.days === 1) {
                bannerAge += ' day ';
            } else {
                bannerAge += ' days ';
            }
        }
        else if (age.hours) {
            bannerAge = age.hours;

            if (age.hours === 1) {
                bannerAge += ' hour ';
            } else {
                bannerAge += ' hours ';
            }
        }
        else if (age.minutes) {
            bannerAge = age.minutes;

            if (age.minutes === 1) {
                bannerAge += ' minute ';
            } else {
                bannerAge += ' minutes ';
            }
        } else {
            bannerAge = age.seconds;

            if (age.seconds === 1) {
                bannerAge += ' second ';
            } else {
                bannerAge += ' seconds ';
            }
        }

        return bannerAge;
    },
    getPostPointsClassname: function() {
        var ret = 'post-points ';

        if (this.props.upvoted) {
            ret += 'post-points-upvoted'
        } else {
            ret += 'post-points-not-upvoted'
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
        var bannerAge = this.grabFormattedAge();
        var postPointsClassname = this.getPostPointsClassname();
        var formattedPointsText = this.getFormattedPointsText();
        var authorURL = '/u/' + this.props.author;

        return (
            <div className="post-info-banner">
                <p>
                    <span className={postPointsClassname}>{this.props.score}</span> {formattedPointsText} | Submitted by <a href={authorURL} className="post-author">{this.props.author}</a> <span className="post-age">{bannerAge}</span> ago
                </p>
            </div>
        );
    }
});

var UpvoteButton = React.createClass({
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

        if (this.props.upvoted) {
            upvoteFunction = this.props.handleRemoveUpvote;
        } else {
            upvoteFunction = this.props.handleUpvote;
        }

        return <img className="upvote-button" src={imageSrc} onClick={upvoteFunction.bind(null, this.props.postId)} className="upvote-button" />
    }
});
