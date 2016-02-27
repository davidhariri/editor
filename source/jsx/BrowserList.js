const BrowserList = React.createClass({
    getDefaultProps() {
        return {
            articles : [],
            selected : null
        }
    },

    render() {
        const template = (
            <div className="browser__list">
                {this.props.articles.map((article, i) => {
                    return (<BrowserListItem
                        key={i}
                        clickHandler={this.props.clickHandler}
                        article={article}
                        selected={article.id === this.props.selected}
                    />);
                })}
            </div>
        );

        return template;
    }
});
