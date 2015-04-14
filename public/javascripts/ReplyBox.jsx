/** @jsx React.DOM */
var converter = new Showdown.converter();

var ReplyBox = React.createClass({
    propTypes: {
        onReply: React.PropTypes.func.isRequired,
        defaultClassName: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            isSubmitting: false
        };
    },
    handleReplySubmit: function(text) {
        this.props.onReply(text);
        this.setState({isSubmitting: true});
    },
    render: function() {
        return (
            <span className={this.props.defaultClassName}>
                <ReplyButton isSubmitting={this.state.isSubmitting} onReplySubmit={this.handleReplySubmit} defaultClassName={this.props.defaultClassName} />
            </span>
        );
    }
});

var ReplyButton = React.createClass({
    propTypes: {
        isSubmitting: React.PropTypes.bool.isRequired,
        onReplySubmit: React.PropTypes.func.isRequired,
        defaultClassName: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {isSubmitting: this.props.isSubmitting};
    },
    mountId: "text-area-mount",
    startSubmit: function() {
        this.setState({isSubmitting: true});
    },
    handleSubmit: function(e) {
        this.setState({isSubmitting: false});
        var text = React.findDOMNode(this.refs.textArea).value;
        if (text === '') {
            return;
        }
        this.props.onReplySubmit(text);
    },
    getOnClickFunction: function() {
        return this.state.isSubmitting ? this.handleSubmit : this.startSubmit;
    },
    render: function() {
        var textareaComponent;
        if (this.state.isSubmitting) {
            textareaComponent = <textarea className={this.props.defaultClassName + "-textarea"} ref="textArea" />;
        }

        return (
            <div>
                <div ref="textareaMount" />
                {textareaComponent}
                <a className={this.props.defaultClassName + "-reply-button"} onClick={this.getOnClickFunction()}>reply</a>
            </div>
        );
    }
});
