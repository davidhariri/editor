const Browser = React.createClass({
    getInitialState() {
        return {
            articles : [],
            article : null,
            editing : true
        }
    },

    componentWillMount() {
        // Set the debounce save method
        this.debouncedHandleSave = debounce(() => {
            this.handleSave();
        }, 500, false);
    },

    handleSave() {
        Net.put(`${APIURL}/articles/${this.state.article.id}`, this.state.article)
        .then((response) => {
            this.setState({
                article : response.json
            }, () => {
                // TODO: Update the state of the application
            });
        });
    },

    componentDidMount() {
        Net
        .get(`${APIURL}/articles/`)
        .then((response) => {
            this.setState({
                articles : response.json
            }, () => {
                this.handleArticleSelect(this.state.articles[0]);
            })
        })
    },

    handleArticleSelect(article) {
        this.setState({
            article : article
        });
    },

    handleNewClick() {
        Net
        .post(`${APIURL}/articles/`)
        .then((response) => {
            const articles = this.state.articles;
            articles.unshift(response.json);
            this.setState({
                articles : articles,
                article : articles[0]
            });
        });
    },

    handleEditKeyClick() {
        const keyPrompt = prompt("Speciy a url-safe key for this article.", this.state.article.key);

        if (keyPrompt != null || keyPrompt != "") {
            let article = this.state.article;
            article.key = keyPrompt;
            this.setState({
                article
            }, () => {
                this.handleSaveClick();
            });
        }
    },

    handleDeleteClick() {
        if(confirm("Are you sure you want to delete this article?")) {
            Net
            .delete(`${APIURL}/articles/${this.state.article.id}`)
            .then((response) => {
                // Remove the article from the articles body to reflect the change
                let index = -1;
                const articles = this.state.articles;

                articles.map((article, i) => {
                    if(this.state.article.id === article.id) {
                        index = i;
                        return;
                    }
                });

                if (index > -1) {
                    articles.splice(index, 1);
                }

                this.setState({
                    article : null,
                    articles
                });
            });
        }
    },

    handlePublishClick() {
        const article = this.state.article;
        article.published = !article.published;
        this.setState({ article }, () => {
            this.handleSaveClick();
        })
    },

    handlePreviewClick() {
        this.setState({
            editing : !this.state.editing
        });
    },

    handleArticleChange(article) {
        this.setState({ article });
        this.debouncedHandleSave();
    },

    render() {
        let publishLabel = "Publish";
        let keyLabel = "Add Key";
        let previewLabel = "Preview";

        if(this.state.article && this.state.article.published) {
            publishLabel = "Unpublish";
        }

        if(this.state.article && this.state.article.key) {
            keyLabel = "Edit Key";
        }

        if(!this.state.editing) {
            previewLabel = "Edit";
        }

        const template = (
            <div className="browser">
                <div className="menu browser__menu">
                    <div className="button" onClick={this.handleNewClick}>New</div>
                    <div className={`button ${this.state.article && this.state.article.published ? 'button--disabled' : ''}`} onClick={this.handleEditKeyClick}>{keyLabel}</div>
                    <div className={`button ${this.state.article && this.state.article.key.length > 0 ? '' : 'button--disabled'}`} onClick={this.handlePublishClick}>{publishLabel}</div>
                    <div className={`button ${this.state.article ? '' : 'button--disabled'}`} onClick={this.handlePreviewClick}>{previewLabel}</div>
                    <div className={`button ${this.state.article ? '' : 'button--disabled'}`} onClick={this.handleDeleteClick}>Delete</div>
                </div>
                <BrowserList clickHandler={this.handleArticleSelect} articles={this.state.articles} selected={this.state.article ? this.state.article.id : null}/>
                {this.state.editing ? <Editor article={this.state.article} onArticleChange={this.handleArticleChange}/> : <Previewer article={this.state.article} />}
            </div>
        );

        return template;
    }
});
