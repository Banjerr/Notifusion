'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// need this to build the post string for the access_token
var request = require('request');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var options =
{
    client_id: 'zjdmn6jek8xd5v6yz9eptc8m',
    redirect_uri: "https://localhost/notifusion/index.html",
    response_type: 'code',
    client_secret: 'ReFbmkmPWq'
};
var isUrl = 'https://signin.infusionsoft.com/app/oauth/authorize?';
var authUrl = isUrl + 'client_id=' + options.client_id + '&redirect_uri=' + options.redirect_uri + '&response_type=' + options.response_type;

function createWindow ()
{
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 960,
        height: 960,
        'webPreferences': {
          'nodeIntegration': false,
          'webSecurity': false
        }
    });

    // require jQuery
    mainWindow.$ = require('jQuery');
    mainWindow.jQuery = require('jQuery');

    // and load the index.html of the app.
    // mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.loadURL(authUrl);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // listen for the access token
    mainWindow.webContents.on('did-get-redirect-request', function (event, arg)
    {
      console.log(event);
      console.log(arg);
    });

    function handleCallback (url)
    {
      var raw_code = /code=([^&]*)/.exec(url) || null;
      var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(url);

      if (code || error) {
          // Close the browser if code found or error
          console.log('code or error');
          //authWindow.destroy();
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
                    console.log(body)
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

    mainWindow.webContents.on('will-navigate', function (event, url)
    {
      handleCallback(url);
    });

    mainWindow.webContents.on('did-get-redirect-request', function (event, url)
    {
      handleCallback(url);
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function()
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function ()
{
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function ()
{
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }

  // Reset the authWindow on close
  mainWindow.on('close', function()
  {
      mainWindow = null;
  }, false);
});

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // oAuth stuff \\
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\
//
// function oAuthTokenRequest()
// {
//     // make the auth window
//     authWindow = new BrowserWindow({
//         width: 960,
//         height: 960,
//         'webPreferences': {
//           'nodeIntegration': false,
//           'webSecurity': false
//         }
//     });
//
//     // oAuth stuff
//     var options =
//     {
//         client_id: 'zjdmn6jek8xd5v6yz9eptc8m',
//         redirect_uri: "https://localhost/notifusion/index.html",
//         response_type: 'code',
//         client_secret: 'ReFbmkmPWq'
//     };
//     var isUrl = 'https://signin.infusionsoft.com/app/oauth/authorize?';
//     var authUrl = isUrl + 'client_id=' + options.client_id + '&redirect_uri=' + options.redirect_uri + '&response_type=' + options.response_type;
//
//     // listen for the access token
//     authWindow.webContents.on('did-get-redirect-request', function (event, arg)
//     {
//       console.log(event);
//       console.log(arg);
//     });
//
//     authWindow.webContents.on('will-navigate', function (event, url)
//     {
//       handleCallback(url);
//     });
//
//     authWindow.webContents.on('did-get-redirect-request', function (event, url)
//     {
//       handleCallback(url);
//     });
// }
//
// function handleCallback (url)
// {
//   var raw_code = /code=([^&]*)/.exec(url) || null;
//   var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
//   var error = /\?error=(.+)$/.exec(url);
//
//   if (code || error) {
//       // Close the browser if code found or error
//       console.log('code or error');
//       authWindow.destroy();
//   }
//
//   // If there is a code, proceed to get token from IS
//   if (code) {
//       console.log(code);
//       console.log(options.client_id);
//       console.log('get an access token, ya big dummy!');
//
//     // send a post to request the access_token
//     request.post(
//         'https://api.infusionsoft.com/token',
//         { form: {
//                 client_id: options.client_id,
//                 client_secret: options.client_secret,
//                 code: code,
//                 grant_type: 'authorization_code',
//                 redirect_uri: options.redirect_uri
//             }
//         },
//         function (error, response, body)
//         {
//             if (!error && response.statusCode == 200)
//             {
//                 console.log(body)
//             }
//
//             if (error)
//             {
//                 console.log('somethin goofed');
//                 console.log(error);
//             }
//
//         }
//     );
//
//   }
//   else if (error)
//   {
//       alert('Oops! Something went wrong and we couldn\'t' +
//       'log you into Infusionsoft. Please try again.');
//   }
// }
//
// // function to grab query vars
// function getQueryVariable(variable)
// {
//    var query = window.location.search.substring(1);
//    var vars = query.split("&");
//    for (var i=0;i<vars.length;i++) {
//            var pair = vars[i].split("=");
//            if(pair[0] == variable){return pair[1];}
//    }
//    return(false);
// }
