var subpy = $('#subpy').text();

console.log('hihihihihi');
var App = React.createClass({
    getInitialState: function() {
        return {
            posts: []
        };
    },
    componentDidMount: function() {
        $.ajax({
            url: '/posts/' + subpy,
            dataType: 'json',
            success: function(data) {
                this.setState({posts: data});
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div className="postsApp">
                <PostsList posts={this.state.posts}/>
            </div>
        );
    }
});

var PostsList = React.createClass({
    render: function() {
        var posts = this.props.posts.map(function(post) {
            return (
                <Post post={post} />
            );
        });

        return (
            <ol className="postsList">
                {posts}
            </ol>
        );
    }
});

var Post = React.createClass({
    render: function() {
        var post = this.props.post;
        console.log(post);

        return (
            <li className="post">
                <div class="row">
                    <Score postId={post.id} postScore={post.score} className="two columns" />
                    <a href={post.url} className="post-title">{post.title}</a>
                </div>
                <div className="post-author-age row">
                    <p>Submitted by {post.author}</p>
                </div>
            </li>
        );
    }
});

var TextPost = React.createClass({
    render: function() {
        var post = this.props.post;
        console.log(post);

        return (
            <li className="post">
            <p>
                <span class="post-score">{post.score}</span>
                <span class="post-title">{post.title}</span>
            </p>
            </li>
        );
    }
});

// Upvote, downvote, and score
var Score = React.createClass({
    render: function() {
        var postId = this.props.postId;
        var postScore = this.props.postScore;

        return (
            <span className="score">
                <span className="fa fa-chevron-up"></span>
                <span className="post-score">{postScore}</span>
            </span>
        );
    }
});

React.render(
    <App />,
    document.getElementById("posts-app")
);
