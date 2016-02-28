let user = sessionStorage.getItem("user");
let password = sessionStorage.getItem("password");
const APIURL = 'https://api.dhariri.com';

if(user && password) {
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

    Net.get(APIURL)
    .then((response) => {
        if(response.status.code === 200) {
            ReactDOM.render(<Browser/>, document.getElementById("app"));
        } else {
            renderLogin();
        }
    });
}
