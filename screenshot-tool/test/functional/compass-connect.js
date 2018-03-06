const { launchCompass, quitCompass } = require('./support/spectron-support');
const electron = require('electron');
const $ = require('jquery');
const fs = require('fs');
const util = require('./util.js');

describe('#compass-screenshot', function() {
  this.slow(30000);
  this.timeout(60000);
  let app = null;
  let client = null;

  var screenshot_filename = 'init';

  before(function() {
    return launchCompass().then(function(application) {
      app = application;
      client = application.client;
    });
  });

  it('displays the feature tour modal', function() {
    return client
      .waitForFeatureTourModal()
      .getText('h2[data-hook=title]')
      .should.eventually.equal('Welcome to MongoDB Compass')
      .then(takeScreenshot('./compass-screenshots-temp/feature-tour.png'));
  });

  it('displays the privacy settings', function() {
    return client
      .clickCloseFeatureTourButton()
      .waitForPrivacySettingsModal()
      .clickEnableProductFeedbackCheckbox()
      .clickEnableCrashReportsCheckbox()
      .clickEnableUsageStatsCheckbox()
      .clickEnableAutoUpdatesCheckbox()
      .getModalTitle()
      .should.eventually.equal('Privacy Settings')
      .then(takeScreenshot('./compass-screenshots-temp/privacy-settings.png'));
  });

  it('renders the connect screen', function() {
    return client
      .clickClosePrivacySettingsButton()
      .waitForConnectView()
      .getConnectHeaderText()
      .should.eventually.be.equal('Connect to Host')
      .then(takeScreenshot('./compass-screenshots-temp/connect.png'))
  });

  it('should select id file', function() {
    return client
      .waitUntilWindowLoaded()
      .selectSSHIdentityFile()
  });

  after(function() {
    var elem_size = {};
    var elem_pos = {};
    var rectangle = {};

    return client
      .getLocation('#ssh-tunnel')
      .then(function(sshPosition) {
        elem_pos = sshPosition;
      })
      .getElementSize('#ssh-tunnel')
      .then(function(sshSize) {
        elem_size = sshSize;
        rectangle = {x: elem_pos.x, y: elem_pos.y, width: elem_size.width, height: elem_size.height};
        return rectangle;
      })
      .then(takeScreenshot('./compass-screenshots-temp/connect-ssh-tunnel.png', rectangle));
    });

  function screenshotAndQuit(filename, rectangle = {x: 0, y: 0, width: 1500, height: 1000}) {
    app.app.browserWindow.capturePage(rectangle).then(function(imageBuffer) {
      fs.writeFile(filename, imageBuffer, function(err) {
        if (err) return done(err);
        console.log("Took screenshot! ", filename);
      });
    });
  }

  function takeScreenshot(filename, rectangle = {x: 0, y: 0, width: 1500, height: 1000}) {
    return function(done) {
      app.app.browserWindow.capturePage(rectangle).then(function(imageBuffer) {
        fs.writeFile(filename, imageBuffer, function(err) {
          if (err) return done(err);
          console.log("Took screenshot: ", filename);
          return;
        });
      });
    };
  }
});
