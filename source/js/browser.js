let user = sessionStorage.getItem("user");
let password = sessionStorage.getItem("password");
const APIURL = 'https://dhariri-api.herokuapp.com'
const API = new Net(APIURL);

if(user && password) {
    authenticate();
} else {
    renderLogin();
}

function renderLogin() {
    ReactDOM.render(<Login/>, document.getElementById("app"));
}

// FIXME: ES6ify
var timeNow = function() {
   return (new Date()).getTime();
};

var debounce = function(func, wait, immediate) {
	var timeout, args, context, timestamp, result;

	var later = function() {
		var last = timeNow() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;

			if (!immediate) {
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
	};

  	return function() {
		context = this;
		args = arguments;
		timestamp = timeNow();
		var callNow = immediate && !timeout;

		if (!timeout) timeout = setTimeout(later, wait);

		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
};

function authenticate(callback) {
    const password = localStorage.getItem('password');

    API.setHeaders({
        'Authorization' : password,
        'Content-Type' : 'application/json; charset=utf-8'
    });

    API.get('/auth/')
    .then((response) => {
        if(response.status.code === 200) {
            ReactDOM.render(<Browser/>, document.getElementById("app"));
        } else {
            renderLogin();
        }
    });
}
