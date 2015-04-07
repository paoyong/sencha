var subpy = $('#subpy').text();

var App = React.createClass({
    getInitialState: function() {
        return {posts: []}
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
        <div className="postsApp">
            <PostsList posts={this.state.posts}/>
        </div>
    }
});

var PostsList = React.createClass({

});
