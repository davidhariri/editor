const Previewer = React.createClass({
    getDefaultProps() {
        return {
            article : null
        }
    },

    renderHTML(html) {
        html = `<h1>${this.props.article.title}</h1>` + html;

        return {
             __html : html
        }
    },

    render() {
        if(this.props.article) {
            const template = (
                <div className="editor">
                    <article dangerouslySetInnerHTML={this.renderHTML(this.props.article.html_content)} />
                </div>
            );

            return template;
        }

        return (<div className="editor"/>);
    }
});
