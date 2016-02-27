let user = sessionStorage.getItem("user");
let password = sessionStorage.getItem("password");

if(user && password) {
    // Try to authenticate and callback to rendering the browser
    authenticate();
} else {
    renderLogin();
}

function renderLogin() {
    ReactDOM.render(<Login/>, document.getElementById("app"));
}

function authenticate(callback) {
    user = sessionStorage.getItem("user");
    password = sessionStorage.getItem("password");
    const chain = window.btoa(`${user}:${password}`);

    Net.setup({
        headers : {
            'Authorization' : `Basic ${chain}`
        }
    });

    Net.get('https://api.dhariri.com/')
    .then((response) => {
        if(response.status.code === 200) {
            ReactDOM.render(<Browser/>, document.getElementById("app"));
        } else {
            renderLogin();
        }
    });
}
