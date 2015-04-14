/** @jsx React.DOM */
var converter = new Showdown.converter();

var ReplyBox = React.createClass({
    getInitialState: function() {
        return {
            isSubmitting: false
        };
    },
    propTypes: {
        onReply: React.PropTypes.func.isRequired
    },
    handleReplySubmit: function(text) {
        this.props.onReply(text);
        this.setState({isSubmitting: true});
    },
    render: function() {
        return (
            <ReplyButton isSubmitting={this.state.isSubmitting} onReplySubmit={this.handleReplySubmit} />
        );
    }
});

var ReplyButton = React.createClass({
    propTypes: {
        isSubmitting: React.PropTypes.bool.isRequired,
        onReplySubmit: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {isSubmitting: this.props.isSubmitting};
    },
    mountId: "text-area-mount",
    startSubmit: function() {
        this.setState({isSubmitting: true});
    },
    handleSubmit: function(e) {
        var text = React.findDOMNode(this.refs.textArea).value;
        this.props.onReplySubmit(text);
        this.setState({isSubmitting: false});
    },
    getOnClickFunction: function() {
        return this.state.isSubmitting ? this.handleSubmit : this.startSubmit;
    },
    render: function() {
        var textareaComponent;
        if (this.state.isSubmitting) {
            textareaComponent = <textarea ref="textArea" />;
        }

        return (
            <div>
                <div ref="textareaMount" />
                {textareaComponent}
                <input type="button" value="reply" onClick={this.getOnClickFunction()} />
            </div>
        );
    }
});
