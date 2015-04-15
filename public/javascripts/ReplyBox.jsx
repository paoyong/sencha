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
        var ReplyButtonProps = {
            isSubmitting: this.state.isSubmitting,
            onReplySubmit: this.handleReplySubmit,
            defaultClassName: this.props.defaultClassName
        };

        return (
            <span className={this.props.defaultClassName}>
                <ReplyButton  {...ReplyButtonProps}/>
            </span>
        );
    }
});

var ReplyButton = React.createClass({
    propTypes: {
        isSubmitting: React.PropTypes.bool.isRequired,
        onReplySubmit: React.PropTypes.func.isRequired,
        defaultClassName: React.PropTypes.string.isRequired,
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
    cancel: function() {
        this.setState({isSubmitting: false});
    },
    render: function() {
        var textareaComponent, cancelButtonComponent;

        if (this.state.isSubmitting) {
            textareaComponent = (
                <div>
                    <textarea className={this.props.defaultClassName + "-textarea"} ref="textArea" />
                </div>
            );

            cancelButtonComponent = (
                <span>
                    {' • '}
                    <a className={this.props.defaultClassName + "-cancel-button"} onClick={this.cancel}>cancel</a>
                </span>
            );
        }

        return (
            <span className={this.props.defaultClassName + "-banner"}>
                {textareaComponent}
                <a className={this.props.defaultClassName + "-reply-button"} onClick={this.getOnClickFunction()}>reply</a>
                {cancelButtonComponent}
            </span>
        );
    }
});
