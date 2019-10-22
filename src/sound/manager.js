Object.assign(ape, function () {
  'use strict';

  function hasAudio() {
    return (typeof Audio !== 'undefined');
  }
  function hasAudioContext() {
    return !!(typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined');
  }

  var SoundManager = function (options) {};
  SoundManager.hasAudio = hasAudio;
  SoundManager.hasAudioContext = hasAudioContext;

  Object.assign(SoundManager.prototype, {
    suspend: function () {
      this.suspend = true;
      this.fire('suspend');
    },
    resume: function () {
      this.suspend = false;
      this.fire('resume');
    },
    destroy: function () {
      window.removeEventListener('mousedown', this.resumeContext);
      window.removeEventListener('touchend', this.resumeContext);

      this.fire('destroy');
      if (this.context && this.context.close) {
        this.context.close();
        this.context = null;
      }
    },
    getListener: function () {
      console.warn('DEPRECATED: getListener is deprecated. Get the "getListener" field instead.');
      return this.listener;
    },
    getVolume: function () {
      console.warn('DEPRECATED: getVolume is deprecated. Get the "volume" property instead.');
      return this.volume;
    },
    setVolume: function (volume) {
      console.warn('DEPRECATED: setVolume is deprecated. Set the "volume" property instead.');
      this.volume = volume;
    },
    playSound: function (sound, options) {
      options = options || {};
      var channel = null;
      if (ape.Channel) {
        channel = new ape.Channel(this, sound, options);
        channel.play();
      }
      return channel;
    },
    playSound3d: function (sound, position, options) {
      options = options || {};
      var channel = null;
      if (ape.Channel3d) {
          channel = new ape.Channel3d(this, sound, options);
          channel.setPosition(position);
          if (options.volume) {
              channel.setVolume(options.volume);
          }
          if (options.loop) {
              channel.setLoop(options.loop);
          }
          if (options.maxDistance) {
              channel.setMaxDistance(options.maxDistance);
          }
          if (options.minDistance) {
              channel.setMinDistance(options.minDistance);
          }
          if (options.rollOffFactor) {
              channel.setRollOffFactor(options.rollOffFactor);
          }
          if (options.distanceModel) {
              channel.setDistanceModel(options.distanceModel);
          }

          channel.play();
      }

      return channel;
    }
  });
  Object.defineProperty(SoundManager.prototype, 'volume', {
    get: function () {
      return this._volume;
    },
    set: function (volume) {
      volume = ape.math.clamp(volume, 0, 1);
      this._volume = volume;
      this.fire('volumechange', volume);
    }
  });

  ape.AudioManager = SoundManager;
  return {
    SoundManager: SoundManager
  };
}());
