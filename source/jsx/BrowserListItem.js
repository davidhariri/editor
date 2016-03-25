const BrowserListItem = React.createClass({
    passArticleUp() {
        this.props.clickHandler(this.props.article);
    },

    renderDate() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date(this.props.article.made.$date);

        return `${monthNames[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
    },

    render() {
        let selected = "";

        if(this.props.selected) {
            selected = 'browser__list__item--selected';
        }

        const articleTitle = this.props.article.title ? this.props.article.title : 'Untitled';
        let articleStatus = "";

        if(this.props.article.shared) {
            articleStatus = "S";
        } else if(this.props.article.published) {
            articleStatus = "P";
        }

        const template = (
            <div className={`browser__list__item ${selected}`} key={this.props.id} onClick={this.passArticleUp}>
                <div className="browser__list__item__status">{articleStatus}</div>
                <div className="browser__list__item__title">{articleTitle}</div>
                <div className="browser__list__item__subtitle">{this.renderDate()}</div>
            </div>
        );

        return template;
    }
});
