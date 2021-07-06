let APIURL = '';
let IMGURL = '';

switch (window.location.hostname) {
    // this is the local host name of your react app
    case 'localhost' || '127.0.0.1':
        // this is the local host name of your API
        APIURL = 'http://localhost:3000';
        IMGURL = 'http://localhost:3001';
        break;
    // this is the deployed react application
    case 'myrunjournal.herokuapp.com':
        // this is the full url of your deployed API
        APIURL = 'https://runjournal-server.herokuapp.com';
        IMGURL = 'https://myrunjournal.herokuapp.com';
}

export {APIURL, IMGURL};