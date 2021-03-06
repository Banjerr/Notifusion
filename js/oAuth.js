'use strict';

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // oAuth stuff \\
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\

const electron = require('electron');

// Module to control application life.
const app = electron.app;

// Modules to create native browser window.
var remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

// need this to build the post string for the access_token
var request = require('request');

// this is db stuff
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low('db.json', { storage });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let authWindow;

// IS oAuth stuff
var options =
{
    client_id: 'zjdmn6jek8xd5v6yz9eptc8m',
    redirect_uri: "https://localhost/notifusion/index.html",
    response_type: 'code',
    client_secret: 'ReFbmkmPWq'
};
var isUrl = 'https://signin.infusionsoft.com/app/oauth/authorize?';
var authUrl = isUrl + 'client_id=' + options.client_id + '&redirect_uri=' + options.redirect_uri + '&response_type=' + options.response_type;

function oAuthTokenRequest()
{
    // make the auth window
    authWindow = new BrowserWindow({
        width: 360,
        height: 440,
        'webPreferences': {
          'nodeIntegration': false,
          'webSecurity': false
      },
      frame: false
    });

    // call the handleCallback function
    authWindow.webContents.on('will-navigate', function (event, url)
    {
      handleCallback(url);
    });

    // call the handleCallback function
    authWindow.webContents.on('did-get-redirect-request', function (event, url)
    {
      handleCallback(url);
    });

    // open the IS auth page
    authWindow.loadURL(authUrl);
}

function handleCallback (url)
{
  var raw_code = /code=([^&]*)/.exec(url) || null;
  var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
  var error = /\?error=(.+)$/.exec(url);

  if (code || error) {
      authWindow.destroy();
  }

  // If there is a code, proceed to get token from IS
  if (code) {
      console.log(code);
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

                var epochTime = date.getTime();

               db('access_token').push({
                   access_token: parsed.access_token,
                   token_type: parsed.token_type,
                   refresh_token: parsed.refresh_token,
                   expires_in: parsed.expires_in,
                   scope: parsed.scope,
                   created: epochTime,
               });

               // remove the authorization button cause we dont need it
               var authorize_btn_parent = document.getElementById('authorizeMe');
               var authorize_btn = document.getElementById('authorizeMeBtn');
               authorize_btn_parent.removeChild(authorizeMeBtn)
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

/**
 * deleted the access_token jsob object
*/
function deleteDB()
{
    db('access_token').remove();
}

/**
 * returns 'true' if the token is valid, if not it fetches a new token
*/
function tokenVerification()
{
    // current time
    var current_date = new Date();
    var current_epoch_time = current_date.getTime();

    // time the token was stored + milliseconds in 23.75 hours
    // TODO should be plus, minus for testing
    var token_expiration_time = ((db('access_token').__wrapped__[0].created) + 85500000);

    // the refresh token
    var refresh_token = db('access_token').__wrapped__[0].refresh_token;

    if(current_epoch_time >= token_expiration_time)
    {
        // delete the old junk
        deleteDB();

        console.log('you need a new token');

        // send a post to request the new access_token object
        request.post(
            'https://api.infusionsoft.com/token',
            { form: {
                        grant_type: 'refresh_token',
                        refresh_token: refresh_token,
            },
            headers: {
                        Authorization: 'Basic ' + btoa(options.client_id + ':' + options.client_secret)
                     }
            },
            function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    var json = body;
                    var parsed = JSON.parse(json);

                    var date = new Date();

                    var epochTime = date.getTime();

                   db('access_token').push({
                       access_token: parsed.access_token,
                       token_type: parsed.token_type,
                       refresh_token: parsed.refresh_token,
                       expires_in: parsed.expires_in,
                       scope: parsed.scope,
                       created: epochTime,
                   });
                }

                if (error)
                {
                    console.log('somethin goofed');
                    console.log(error);
                }
            }
        );
        return true;
    }
    else
    {
        var authorize_btn = document.getElementsByClassName('authorizeMe');
        return false;
    }
}

jQuery(function(){
    // check if there is currently a token saved in the db
    function token_check()
    {
        if(db('access_token').__wrapped__[0])
        {
            // make sure its still valid, if not, refresh it
            if(tokenVerification() === false)
            {
                tokenVerification();
            }
            var authorize_btn = jQuery('.authorizeMe');
            authorize_btn.remove();
            return true;
        }
    }

    token_check();
});
