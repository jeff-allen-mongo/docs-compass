let viewport = {
  h: 1000,
  w: 1600
}

var utils = {
  screenshotAndQuit: function(filename, app, rectangle = {x: 0, y: 0, width: viewport.w, height: viewport.h}) {
	return function(done) {
	  app.app.browserWindow.capturePage(rectangle).then(function(imageBuffer) {
	    fs.writeFile(filename, imageBuffer, function(err) {
	      if (err) return done(err);
	      console.log("Took screenshot! ", filename);
	      done();
	    });
	  });
	};
  },
  takeScreenshot: function(filename, app, rectangle = {x: 0, y: 0, width: viewport.w, height: viewport.h}) {
    return function(done) {
      console.log(app);
      app.app.browserWindow.capturePage(rectangle).then(function(imageBuffer) {
        fs.writeFile(filename, imageBuffer, function(err) {
          if (err) return done(err);
          console.log("Took screenshot: ", filename);
        });
      });
    };
  }
}

module.exports = utils;
