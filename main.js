'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var options = {
    client_id: 'zjdmn6jek8xd5v6yz9eptc8m',
    // redirect_uri: "http://localhost/main.js",
    redirect_uri: "http://localhost/notifusion/index.html",
    response_type: 'code'
};
var isUrl = 'https://signin.infusionsoft.com/app/oauth/authorize?';
var authUrl = isUrl + 'client_id=' + options.client_id + '&redirect_uri=' + options.redirect_uri + '&response_type=' + options.response_type;


function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 960,
        height: 960,
        'webPreferences': {
          'nodeIntegration': false,
          'webSecurity': false
        }
    });

    mainWindow.$ = require('jQuery');
    mainWindow.jQuery = require('jQuery');

    // and load the index.html of the app.
    mainWindow.loadURL(authUrl);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // listen for the access token
    mainWindow.webContents.on('did-get-redirect-request', function (event, arg) {
      console.log(event);
      console.log(arg);
    });

    function handleCallback (url) {
      var raw_code = /code=([^&]*)/.exec(url) || null;
      var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(url);

      if (code || error) {
          // Close the browser if code found or error
          console.log('code or error')
          //authWindow.destroy();
      }

      // If there is a code, proceed to get token from IS
      if (code) {
          //self.requestGithubToken(options, code);
          console.log(code);
      } else if (error) {
          alert('Oops! Something went wrong and we couldn\'t' +
          'log you into Infusionsoft. Please try again.');
      }
    }

    mainWindow.webContents.on('will-navigate', function (event, url) {
      handleCallback(url);
    });

    mainWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
      handleCallback(newUrl);
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
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
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }

  // Reset the authWindow on close
  mainWindow.on('close', function() {
      mainWindow = null;
  }, false);
});
