const Login = React.createClass({
    getInitialState() {
        return {
            user : "",
            password : ""
        }
    },

    handleEmailChange(event) {
        this.setState({
            user : event.target.value
        });
    },

    handlePasswordChange(event) {
        this.setState({
            password : event.target.value
        });
    },

    handleLogin() {
        sessionStorage.setItem('user', this.state.user);
        sessionStorage.setItem('password', this.state.password);
        authenticate();
        this.setState(this.getInitialState());
    },

    render() {
        const template = (
            <div className="login">
                <div className="login__input-container">
                    <input className="login__input-container__input" type="email" onChange={this.handleEmailChange} value={this.state.user} placeholder="User"/>
                    <input className="login__input-container__input" type="password" onChange={this.handlePasswordChange} value={this.state.password} placeholder="Password"/>
                </div>
                <div className="login__button button" onClick={this.handleLogin}>Sign In</div>
            </div>
        );

        return template;
    }
});
