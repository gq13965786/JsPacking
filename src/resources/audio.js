Object.assign(ape, function () {
  'use strict';

  //checks if user is running IE
  var ie = (function () {});

  var AudioHandler = function (manager) {
    this.manager = manager;
  };

  Object.assign(AudioHandler.prototype, {
    _isSupported: function (url) {},
    load: function (url, callback) {},
    open: function (url, data) {}
  });

  if(ape.SoundManager.hasAudioContext()) {
    AudioHandler.prototype._createSound = function (url, success, err) {};
  } else if (ape.SoundManager.hasAudio()) {}

  return {
    AudioHandler: AudioHandler
  };
}());
