const Browser = React.createClass({
    getInitialState() {
        return {
            articles : [],
            page: 1,
            article : null,
            editing : true,
            status : "",
            caretPosition: null,
            textarea : null
        }
    },

    componentWillMount() {
        // Set the debounce save method
        this.debouncedHandleSave = debounce(() => {
            this.handleSave();
        }, 500, false);
    },

    handleSave() {
        API.patch(`/articles/${this.state.article._id}/`, {
            content: this.state.article.content,
            title: this.state.article.title,
            shared: this.state.article.shared,
            published: this.state.article.published
        }).then((response) => {
            if(response.status.code === 200) {
                this.setState({
                    article: response.json,
                    status : "Saved"
                });
            } else {
                this.setState({
                    status : "Error"
                });
                console.log(response);
            }
        });
    },

    componentDidMount() {
        API.get(`/articles/?page=${this.state.page}&size=20&order=-created`)
        .then((response) => {
            this.setState({
                articles : response.json.articles
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
        API.post(`/articles/`, {
            'title': '',
            'content': ''
        }).then((response) => {
            const articles = this.state.articles;
            articles.unshift(response.json);
            this.setState({
                articles : articles,
                article : articles[0]
            });
        });
    },

    handleDeleteClick() {
        if(confirm("Are you sure you want to delete this article?")) {
            API
            .delete(`/articles/${this.state.article._id}`)
            .then((response) => {
                // Remove the article from the articles body to reflect the change
                let index = -1;
                const articles = this.state.articles;

                articles.map((article, i) => {
                    if(this.state.article._id === article._id) {
                        index = i;
                        return;
                    }
                });

                if (index > -1) {
                    articles.splice(index, 1);
                }

                this.setState({
                    articles,
                    article : articles[0]
                });
            });
        }
    },

    handleShareClick() {
        const article = this.state.article;
        article.shared = !article.shared;

        this.setState({ article }, () => {
            this.handleSave();

            if(article.shared) {
                this.openArticle();
            }
        })
    },

    handlePublishClick() {
        const article = this.state.article;
        article.published = !article.published;

        this.setState({ article }, () => {
            this.handleSave();

            if(article.published) {
                this.openArticle();
            }
        })
    },

    handleUploadChange(event) {
        const reader = new FileReader();
        const file = event.target.files[0];
        const rootComponent = this;
        const articleState = rootComponent.state;

        reader.onload = (upload) => {
            const formData = new FormData();
            const uploadRequest = new XMLHttpRequest();
            const authChain = window.btoa(`${sessionStorage.getItem("user")}:${sessionStorage.getItem("password")}`);

            formData.append('file', file);
            uploadRequest.open('POST', `/images/`);
            uploadRequest.setRequestHeader('Authorization', `Basic ${authChain}`);
            uploadRequest.onload = () => {
                if(uploadRequest.status === 201) {
                    const article = articleState.article;
                    const jsonResponse = JSON.parse(uploadRequest.responseText);
                    const mdImage = `![](${jsonResponse.url})`;
                    const oldContent = article.content;

                    article.content = [oldContent.slice(0, articleState.caretPosition), mdImage, oldContent.slice(articleState.caretPosition)].join('');

                    rootComponent.setState({ article }, () => {
                        rootComponent.handleSave();

                        if(articleState.textarea != null) {
                            articleState.textarea.focus();
                            articleState.textarea.setSelectionRange(articleState.textarea.selectionStart+2, articleState.textarea.selectionStart+2);
                        }
                    });
                } else {
                    console.warn(uploadRequest);
                }
            };

            uploadRequest.send(formData);
        }

        reader.readAsDataURL(file);
    },

    openArticle() {
        window.open(`https://dhariri.com/posts/${this.state.article._id}`);
    },

    handlePreviewClick() {
        this.setState({
            editing : !this.state.editing
        });
    },

    handleArticleChange(article) {
        this.debouncedHandleSave();
        this.setState({
            article,
            status : "Edited"
        });
    },

    handleCaretUpdate(textarea) {
        this.setState({
            caretPosition: textarea.selectionStart,
            textarea
        });
    },

    render() {
        let publishLabel = "Publish";
        let shareLabel = "Share";
        let previewLabel = "Preview";

        if(this.state.article && this.state.article.published) {
            publishLabel = "Unpublish";
        }

        if(this.state.article && this.state.article.shared) {
            shareLabel = "Unshare";
        }

        if(!this.state.editing) {
            previewLabel = "Edit";
        }

        const template = (
            <div className="browser">
                <div className="menu browser__menu">
                    <div className="button" onClick={this.handleNewClick}>New</div>
                    <div className={`button ${this.state.article && !this.state.article.published ? '' : 'button--disabled'}`} onClick={this.handleShareClick}>{shareLabel}</div>
                    <div className={`button ${this.state.article ? '' : 'button--disabled'}`} onClick={this.handlePublishClick}>{publishLabel}</div>
                    <div className={`button ${this.state.article ? '' : 'button--disabled'}`} onClick={this.handlePreviewClick}>{previewLabel}</div>
                    <div className={`button ${this.state.article && (this.state.article.published || this.state.article.shared) ? '' : 'button--disabled'}`} onClick={this.openArticle}>Open</div>
                    <div className={`button ${this.state.article ? '' : 'button--disabled'}`} onClick={this.handleDeleteClick}>Delete</div>
                    <div className={`button ${this.state.article && this.state.editing && this.state.caretPosition !== null ? '' : 'button--disabled'}`}>
                        <span>Insert Image</span>
                        <input type="file" name="file" id="file" onChange={this.handleUploadChange} accept="image/*"/>
                    </div>
                    <div className="menu__status">{this.state.status}</div>
                </div>
                <BrowserList clickHandler={this.handleArticleSelect} articles={this.state.articles} selected={this.state.article ? this.state.article._id : null}/>
                {this.state.editing ? <Editor article={this.state.article} onCaretUpdate={this.handleCaretUpdate} onArticleChange={this.handleArticleChange} /> : <Previewer article={this.state.article} />}
            </div>
        );

        return template;
    }
});
