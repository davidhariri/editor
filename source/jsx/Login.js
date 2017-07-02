const Login = React.createClass({
    getInitialState() {
        return {
            password : ''
        }
    },

    componentDidMount() {
        const savedPassword = localStorage.getItem('password') || '';
        
        if (savedPassword !== '') {
            this.setState({
                password: savedPassword
            }, () => {
                authenticate();
            })
        }
    },

    handlePasswordChange(event) {
        this.setState({
            password : event.target.value
        });
    },

    handleLogin() {
        localStorage.setItem('password', this.state.password);
        authenticate();
        // this.setState(this.getInitialState());
    },

    render() {
        const template = (
            <div className="login">
                <div className="login__input-container">
                    <input autoFocus="true" spellCheck="false" className="login__input-container__input" type="password" onChange={this.handlePasswordChange} value={this.state.password} placeholder="Token"/>
                </div>
                <div className="login__button button" onClick={this.handleLogin}>Sign In</div>
            </div>
        );

        return template;
    }
});
