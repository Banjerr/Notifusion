'use strict';

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // oAuth stuff \\
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\

// IS stuff
var options =
{
    client_id: 'zjdmn6jek8xd5v6yz9eptc8m',
    redirect_uri: "https://localhost/notifusion/index.html",
    response_type: 'code',
    client_secret: 'ReFbmkmPWq'
};
var isUrl = 'https://signin.infusionsoft.com/app/oauth/authorize?';
var authUrl = isUrl + 'client_id=' + options.client_id + '&redirect_uri=' + options.redirect_uri + '&response_type=' + options.response_type;

const electron = require('electron');

// Module to control application life.
const app = electron.app;

// Modules to create native browser window.
var remote = require('remote');
var BrowserWindow = remote.require('browser-window');

// need this to build the post string for the access_token
var request = require('request');

// this is db stuff
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low('db.json', { storage });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let authWindow;

function oAuthTokenRequest()
{
    // make the auth window
    authWindow = new BrowserWindow({
        width: 960,
        height: 960,
        'webPreferences': {
          'nodeIntegration': true,
          'webSecurity': false
        }
    });

    // oAuth stuff
    var options =
    {
        client_id: 'zjdmn6jek8xd5v6yz9eptc8m',
        redirect_uri: "http://localhost/notifusion/index.html",
        response_type: 'code',
        client_secret: 'ReFbmkmPWq'
    };
    var isUrl = 'https://signin.infusionsoft.com/app/oauth/authorize?';
    var authUrl = isUrl + 'client_id=' + options.client_id + '&redirect_uri=' + options.redirect_uri + '&response_type=' + options.response_type;


    // listen for the access token
    authWindow.webContents.on('did-get-redirect-request', function (event, arg)
    {
      console.log(event);
      console.log(arg);
    });

    authWindow.webContents.on('will-navigate', function (event, url)
    {
      handleCallback(url);
    });

    authWindow.webContents.on('did-get-redirect-request', function (event, url)
    {
      handleCallback(url);
    });

    authWindow.loadURL(authUrl);
}

function handleCallback (url)
{
  var raw_code = /code=([^&]*)/.exec(url) || null;
  var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
  var error = /\?error=(.+)$/.exec(url);

  if (code || error) {
      // Close the browser if code found or error
      console.log('code or error');
      authWindow.destroy();
  }

  // If there is a code, proceed to get token from IS
  if (code) {
      console.log(code);
      console.log(options.client_id);
      console.log('get an access token, ya big dummy!');

    // send a post to request the access_token
    request.post(
        'https://api.infusionsoft.com/token',
        { form: {
                client_id: options.client_id,
                client_secret: options.client_secret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: options.redirect_uri
            }
        },
        function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
               var json = body;
               var parsed = JSON.parse(json);

               var date = new Date();
               var expires_at = (date + 86400) / 1000; // this is wrong

               var timestamp = ({
                 year: date.getFullYear(),
                 month: date.getMonth()+1,
                 day : date.getDate(),
                 time: date.toTimeString().split(' ')[0],
                 minute: date.getMinutes(),
                 second: date.getSeconds()

               })
               console.log(timestamp);

               // TODO validate / sanatize information before push
               db('access_token').push({
                   access_token: parsed.access_token,
                   token_type: parsed.token_type,
                   refresh_token: parsed.refresh_token,
                   expires_in: parsed.expires_in,
                  //  expaires_at: expires_at,
                   created: timestamp,
                   hasExpired: false
               });

               console.log(db('access_token').__wrapper__[0].refresh_token);
            }

            if (error)
            {
                console.log('somethin goofed');
                console.log(error);
            }

        }
    );

  }
  else if (error)
  {
      alert('Oops! Something went wrong and we couldn\'t' +
      'log you into Infusionsoft. Please try again.');
  }
}

// function to grab query vars
function getQueryVariable(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}
