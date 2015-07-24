/* structure:

- CommentModule
    - CommentForm
    - CommentList
        - Comment
*/

var CommentModule = React.createClass({
    getInitialState: function () {
        return {data: []};
    },
    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    handleCommentSubmit: function (comment) {
        var comments = this.state.data;
        comments = comments.concat([comment]);
        this.setState({data: comments});

        console.log(comments);

        /* needs to point to a server-side script to save the file */
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="comment-module">
                <h1>Comments</h1>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <CommentList data={this.state.data} />
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function () {
        return {error: ""};
    },
    submitForm: function (e) {
        var authorNode, textNode;

        e.preventDefault();
        authorNode = React.findDOMNode(this.refs.author);
        textNode = React.findDOMNode(this.refs.text);


        author = authorNode.value.trim();
        text = textNode.value.trim();

        if(!author || !text) {
            return;
        }

        this.props.onCommentSubmit({author: author, text: text});

        authorNode.value = '';
        textNode.value = '';

        return;
    },
    render: function () {
        return (
            <form className="comment-form" onSubmit={this.submitForm}>
                <input type="text" placeholder="name" ref="author" />
                <textarea type="text" placeholder="message" ref="text"></textarea>
                <button type="submit" value="submit">submit</button>
            </form>
        );
    }
});

var CommentList = React.createClass({
    render: function () {
        var comments = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="comment-list">{comments}</div>
        );
    }
});

var Comment = React.createClass({
    render: function () {
        return (
            <div className="comment">
                <p className="author">{this.props.author}</p>
                <p>{this.props.children}</p>
            </div>
        );
    }
});

React.render(<CommentModule url="comments.json" pollInterval={2000} />, document.getElementById('content'));
