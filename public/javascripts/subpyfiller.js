var subpy = $('#subpy').text();
var defaultURL = '/subpylist?limit=10';

// Milliseconds for every ajax call to the server
var pollInterval = 4000;

var App = React.createClass({
    getListOfSubpys: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({subpys: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return { subpys: [] };
    },
    componentDidMount: function() {
        this.getListOfSubpys();
    },
    render: function() {
        return (
            <ul className="subpys-list-app">
                <SubpysList subpys={this.state.subpys} />
            </ul>
        );
    }
});

var SubpysList = React.createClass({
    render: function() {
        var subpys = this.props.subpys.map(function(subpy) {
            return (
                <Subpy subpy={subpy.name} />
            );
        })

        return (
            <ul className="subpys-list">
                {subpys}
            </ul>
        );
    }
});

var Subpy = React.createClass({
    render: function() {
        var subpy = this.props.subpy;
        var link = '/r/' + subpy;

        return (
            <li className="subpy-list-item">
                <a href={link}>{subpy}</a>
            </li>
        );
    }
})

React.render(
    <App url={defaultURL} />,
    document.getElementById("react-subpyfiller-app-mount")
);
