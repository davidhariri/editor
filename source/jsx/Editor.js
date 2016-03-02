const Editor = React.createClass({
    getDefaultProps() {
        return {
            article : null
        }
    },

    handleChangeTitle(value) {
        this.props.article.title = value;
        this.props.onArticleChange(this.props.article);
    },

    handleChangeContent(value) {
        this.props.article.content.markdown = value;
        this.props.onArticleChange(this.props.article);
    },

    render() {
        if(this.props.article) {
            const template = (
                <div className="editor">
                    <Textarea
                        minHeight={36}
                        className={"editor__title"}
                        placeholder={"Article title"}
                        changeHandler={this.handleChangeTitle}
                        content_id={this.props.article._id.$oid}
                        value={this.props.article ? this.props.article.title : ''}
                    />
                    <Textarea
                        minHeight={36}
                        className={"editor__content"}
                        placeholder={"Some markdown content"}
                        changeHandler={this.handleChangeContent}
                        content_id={this.props.article._id.$oid}
                        value={this.props.article ? this.props.article.content.markdown : ''}
                    />
                </div>
            );

            return template;
        }

        return (<div className="editor"/>);
    }
});
