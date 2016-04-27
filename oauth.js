passport.use(new InfusionsoftStrategy({
    clientID: 'zjdmn6jek8xd5v6yz9eptc8m',
    clientSecret: 'ReFbmkmPWq'
    callbackURL: 'index.html'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ userId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

// require app
var app = require('app');
// require browser-window
var BrowserWindow = require('browser-window');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// IS app key stuff
var options = {
    client_id: 'zjdmn6jek8xd5v6yz9eptc8m',
    client_secret: 'ReFbmkmPWq',
    redirect_uri: __dirname + 'index.html',
    response_type: 'code'
};

// Build the OAuth consent page URL
var authWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
var isUrl = 'https://signin.infusionsoft.com/app/oauth/authorize?';
var authUrl = isUrl + 'client_id=' + options.client_id + '&client_secret=' + options.client_secret + '&redirect_uri=' + options.redirect_uri + '&response_type=' + options.response_type;
authWindow.loadUrl(authUrl);
authWindow.show();

function handleCallback (url) {
  var raw_code = /code=([^&]*)/.exec(url) || null;
  var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
  var error = /\?error=(.+)$/.exec(url);

  if (code || error) {
    // Close the browser if code found or error
    authWindow.destroy();
  }

  // If there is a code, proceed to get token from IS
  if (code) {
    //self.requestGithubToken(options, code);

  } else if (error) {
    alert('Oops! Something went wrong and we couldn\'t' +
      'log you into Infusionsoft. Please try again.');
  }
}

// Handle the response from GitHub - See Update from 4/12/2015

authWindow.webContents.on('will-navigate', function (event, url) {
  handleCallback(url);
});

authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
  handleCallback(newUrl);
});

// Reset the authWindow on close
authWindow.on('close', function() {
    authWindow = null;
}, false);
