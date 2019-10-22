Object.assign(ape, function () {
  var log = {
    write: function(text) {
      console.log(text);
    },
    open: function(text) {
      //function above
      ape.log.write("Powered by 9 arts, ape engine" + ape.version + " ^_^ " );
    },
    info: function(text) {
      console.info("INFO:   " + text);
    },
    debug: function(text) {
      console.debug("DEBUG:   " + text);
    },
    error: function(text) {
      console.error("ERROR:   " + text);
    },
    warning: function(text) {
      console.warn("WARNING:    " + text);
    },
    alert: function(text) {
      ape.log.write("ALERT:   " + text);
      alert(text);
    },
    assert: function(condition, text) {
      if (condition === false) {
        ape.log.write("ASSET:   " + text);
      }
    }
  };
  return {
    log: log
  };
}());

// Shortcuts to logging functions
// ESLint disabled here because these vars may be accessed from other files
// once all sources have been concatenated together and wrapped by the closure.
/* eslint-disable no-unused-vars */
var logINFO = ape.log.info;
var logDEBUG = ape.log.debug;
var logWARNING = ape.log.warning;
var logERROR = ape.log.error;

var logALERT = ape.log.alert;
var logASSERT = ape.log.assert;
/* eslint-enable no-unused-vars */
