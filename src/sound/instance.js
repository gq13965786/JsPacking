Object.assign(ape, function () {
  'use strict';

  var SoundInstance;
  var STATE_PLAYING = 0;
  var STATE_PAUSED = 1;
  var STATE_STOPPED = 2;
//Return time % duration but always return a number
//instead of NaN when duration is 0
  var capTime = function (time, duration) {
    return (time % duration) || 0;
  };

  if(ape.SoundManager.hasAudioContext()) {
    SoundInstance = function (manager, sound, options) {
      ape.event.attach(this);

      options = options || {};

      this._volume = options.volume !== undefined ? ape.math.clamp(Number(options.volume) || 0, 0, 1) : 1;
      this._pitch = options.pitch !== undefined ? Math.max(0.01, Number(options.pitch) || 0) : 1;
      this._loop = !!(options.loop !== undefined ? options.loop : false);

      this._sound = sound;

      //start at 'stopped'
      this._state = STATE_STOPPED;

      //true if the manager was suspended
      this._suspended = false;
      //true if we want to suspend the event handle to the 'onended' event
      this._suspendedEndEvent = false;
      //true if we want to suspend firing instance events
      this._suspendInstanceEvents = false;

      this._startTime = Math.max(0, Number(options.startTime) || 0);
      this._duration = Math.max(0, Number(options.duration) || 0);

      this._startedAt = 0;
      this._startOffset = null;
      //manually keep track of the playback position
      //because the web Audio API does not provide a way to do this
      //accurately if the playbackRate is not 1
      this._currentTime = 0;
      this._currentOffset = 0;
      //if true then the instance will start playing its source
      //when its created
      this._playWhenLoaded = true;

      this._manager = manager;

      //The input node is the one that is connected to the source.
      this._inputNode = null;
      //the connected node is the one that is connected to the destination
      //(speakers).Any external nodes will be connected to this node
      this._connectorNode = null;

      //the first external node set by a user
      this._firstNode = null;
      //the last external node set by a user
      this._lastNode = null;

      this._initializeNodes();

      //external event handlers
      this._onPlayCallback = options.onPlay;
      this._onPauseCallback = options.onPause;
      this._onResumeCallback = options.onResume;
      this._onStopCallback = options.onStop;
      this._onEndCallback = options.onEnd;

      //bind internal event handlers to 'this'
      this._endedHandler = this._onEnded.bind(this);

      //source is _initialized when play() is called
      this.source = null;
    };
    Object.assign(SoundInstance.prototype, {
      _initializeNodes: function () {
        //create gain node for volume control
        this.gain = this._manager.context.createGain();
        this._inputNode = this.gain;
        //the gain node is also the connector node for 2D sound instances
        this._connectorNode = this.gain;
        this._connectorNode.connect(this._manager.context.destination);
      },
      play: function () {
        if (this._state !== STATE_STOPPED) {
            this.stop();
        }

        if (!this.source) {
            this._createSource();
        }

        // calculate start offset
        var offset = capTime(this._startOffset, this.duration);
        offset = capTime(this._startTime + offset, this._sound.duration);
        // reset start offset now that we started the sound
        this._startOffset = null;

        // start source with specified offset and duration
        if (this._duration) {
            this.source.start(0, offset, this._duration);
        } else {
            this.source.start(0, offset);
        }

        // reset times
        this._startedAt = this._manager.context.currentTime;
        this._currentTime = 0;
        this._currentOffset = offset;

        // set state to playing
        this._state = STATE_PLAYING;
        // no need for this anymore
        this._playWhenLoaded = false;

        // Initialize volume and loop - note moved to be after start() because of Chrome bug
        this.volume = this._volume;
        this.loop = this._loop;
        this.pitch = this._pitch;

        // handle suspend events / volumechange events
        this._manager.on('volumechange', this._onManagerVolumeChange, this);
        this._manager.on('suspend', this._onManagerSuspend, this);
        this._manager.on('resume', this._onManagerResume, this);
        this._manager.on('destroy', this._onManagerDestroy, this);

        // suspend immediately if manager is suspended
        if (this._manager.suspended) {
            this._onManagerSuspend();
        }

        if (!this._suspendInstanceEvents)
            this._onPlay();

        return true;
      },
      pause: function () {
        if (this._state !== STATE_PLAYING || !this.source)
            return false;

        // store current time
        this._updateCurrentTime();

        // set state to paused
        this._state = STATE_PAUSED;

        // Stop the source and re-create it because we cannot reuse the same source.
        // Suspend the end event as we are manually stopping the source
        this._suspendEndEvent = true;
        this.source.stop(0);
        this.source = null;

        // no need for this anymore
        this._playWhenLoaded = false;
        // reset user-set start offset
        this._startOffset = null;

        if (!this._suspendInstanceEvents)
            this._onPause();

        return true;
      },
      resume: function () {
        if (this._state !== STATE_PAUSED) {
            return false;
        }

        if (!this.source) {
            this._createSource();
        }

        // start at point where sound was paused
        var offset = this.currentTime;

        // if the user set the 'currentTime' property while the sound
        // was paused then use that as the offset instead
        if (this._startOffset !== null) {
            offset = capTime(this._startOffset, this.duration);
            offset = capTime(this._startTime + offset, this._sound.duration);

            // reset offset
            this._startOffset = null;
        }

        // start source
        if (this._duration) {
            this.source.start(0, offset, this._duration);
        } else {
            this.source.start(0, offset);
        }

        // set state back to playing
        this._state = STATE_PLAYING;

        this._startedAt = this._manager.context.currentTime;
        this._currentOffset = offset;

        // Initialize parameters
        this.volume = this._volume;
        this.loop = this._loop;
        this.pitch = this._pitch;
        this._playWhenLoaded = false;

        if (!this._suspendInstanceEvents)
            this._onResume();

        return true;
      },
      stop: function () {
        if (this._state === STATE_STOPPED || !this.source)
            return false;

        // unsubscribe from manager events
        this._manager.off('volumechange', this._onManagerVolumeChange, this);
        this._manager.off('suspend', this._onManagerSuspend, this);
        this._manager.off('resume', this._onManagerResume, this);
        this._manager.off('destroy', this._onManagerDestroy, this);

        // reset stored times
        this._startedAt = 0;
        this._currentTime = 0;
        this._currentOffset = 0;

        this._startOffset = null;
        this._playWhenLoaded = false;

        this._suspendEndEvent = true;
        if (this._state === STATE_PLAYING) {
            this.source.stop(0);
        }
        this.source = null;

        // set the state to stopped
        this._state = STATE_STOPPED;

        if (!this._suspendInstanceEvents)
            this._onStop();

        return true;
      },
      setExternalNodes: function (firstNode, lastNode) {
        if (!firstNode) {
            console.error('The firstNode must be a valid Audio Node');
            return;
        }

        if (!lastNode) {
            lastNode = firstNode;
        }

        // connections are:
        // source -> inputNode -> connectorNode -> [firstNode -> ... -> lastNode] -> speakers

        var speakers = this._manager.context.destination;

        if (this._firstNode !== firstNode) {
            if (this._firstNode) {
                // if firstNode already exists means the connector node
                // is connected to it so disconnect it
                this._connectorNode.disconnect(this._firstNode);
            } else {
                // if firstNode does not exist means that its connected
                // to the speakers so disconnect it
                this._connectorNode.disconnect(speakers);
            }

            // set first node and connect with connector node
            this._firstNode = firstNode;
            this._connectorNode.connect(firstNode);
        }

        if (this._lastNode !== lastNode) {
            if (this._lastNode) {
                // if last node exists means it's connected to the speakers so disconnect it
                this._lastNode.disconnect(speakers);
            }

            // set last node and connect with speakers
            this._lastNode = lastNode;
            this._lastNode.connect(speakers);
        }
      },
      clearExternalNodes: function () {
        var speakers = this._manager.context.destination;

        // break existing connections
        if (this._firstNode) {
            this._connectorNode.disconnect(this._firstNode);
            this._firstNode = null;
        }

        if (this._lastNode) {
            this._lastNode.disconnect(speakers);
            this._lastNode = null;
        }

        // reset connect to speakers
        this._connectorNode.connect(speakers);
      },
      getExternalNodes: function () {
        return [this._firstNode, this._lastNode];
      },
      _createSource: function () {
        if (!this._sound) {
            return null;
        }

        var context = this._manager.context;

        if (this._sound.buffer) {
            this.source = context.createBufferSource();
            this.source.buffer = this._sound.buffer;

            // Connect up the nodes
            this.source.connect(this._inputNode);

            // set events
            this.source.onended = this._endedHandler;

            // set loopStart and loopEnd so that the source starts and ends at the correct user-set times
            this.source.loopStart = capTime(this._startTime, this.source.buffer.duration);
            if (this._duration) {
                this.source.loopEnd = Math.max(this.source.loopStart, capTime(this._startTime + this._duration, this.source.buffer.duration));
            }
        }

        return this.source;
      },
      _updateCurrentTime: function () {
        this._currentTime = capTime((this._manager.context.currentTime - this._startedAt) * this._pitch + this._currentOffset, this.duration);
      },
      _onManagerDestroy: function () {
        if (this.source && this._state === STATE_PLAYING) {
          this.source.stop(0);
          this.source = null;
        }
      }
    });

    Object.defineProperty(SoundInstance.prototype, 'volume', {
      get: function () {
        return this._volume;
      },
      set: function (volume) {
        volume = ape.math.clamp(volume, 0, 1);
        this._volume = volume;
        if (this.gain) {
          this.gain.gain.value = volume * this._manager.volume;
        }
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'pitch', {
      get: function () {
        return this._pitch;
      },
      set: function (pitch) {
        //set offset to current time so that
        //we calculate the rest of the time with the new pitch
        //from now on
        this._currentOffset = this.currentTime;
        this._startedAt = this._manager.context.currentTime;

        this._pitch = Math.max(Number(pitch) || 0, 0.01);
        if (this.source) {
          this.source.playbackRate.value = this._pitch;
        }
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'loop', {
      get: function () {
        return this._loop;
      },
      set: function (loop) {
        this._loop = !!loop;
        if (this.source) {
          this.source.loop = this._loop;
        }
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'sound', {
      get: function () {
        return this._sound
      },
      set: function (value) {
        this._sound = value;
        if (this._state !== STATE_STOPPED) {
          this.stop();
        } else {
          this._createSource();
        }
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'currentTime', {
      get: function () {
        if (this._startOffset !== null) {
          return this._startOffset;
        }
        if (this._state === STATE_PAUSED) {
          return this._currentTime;
        }
        if (this._state === STATE_STOPPED || !this.source) {
          return 0;
        }
        this._updateCurrentTime();
        return this._currentTime;
      },
      set: function (value) {
        if (value < 0) return;

        if (this._state === STATE_PLAYING) {
          this.stop();
          var suspend = this._suspendInstanceEvents;
          this._suspendInstanceEvents = true;
          this._startOffset = value;
          this.play();
          this._suspendInstanceEvents = suspend;
        }else{
          // set _startOffset which will be used when the instance will start playing
          this._startOffset = value;
          // set _currentTime
          this._currentTime = value;
        }
      }
    });
///////////////////////////////////////////////////
  } else if (ape.SoundManager.hasAudio()) {
    SoundInstance = function (manager, resource, options) {
      ape.events.attach(this);

      options = options || {};

      this._volume = options.volume !== undefined ? ape.math.clamp(Number(options.volume) || 0, 0, 1) : 1;
      this._pitch = options.pitch !== undefined ? Math.max(0.01, Number(options.pitch) || 0) : 1;
      this._loop = !!(options.loop !== undefined ? options.loop : false);

      this._sound = resource;
      this._state = STATE_STOPPED;
      this._suspended = false;
      this._suspendEndEvent = false;
      this._suspendInstanceEvents = false;
      this._playWhenLoaded = true;

      this._startTime = Math.max(0, Number(options.startTime) || 0);
      this._duration = Math.max(0, Number(options.duration) || 0);
      this._startOffset = null;

      this._isReady = false;

      this._manager = manager;

      this._loadedMetadataHandler = this._onLoadedMetadata.bind(this);
      this._timeUpdateHandler = this._onTimeUpdate.bind(this);
      this._endedHandler = this._onEnded.bind(this);

      // external event handlers
      this._onPlayCallback = options.onPlay;
      this._onPauseCallback = options.onPause;
      this._onResumeCallback = options.onResume;
      this._onStopCallback = options.onStop;
      this._onEndCallback = options.onEnd;

      this.source = null;
      this._createSource();
    };

    Object.assign(SoundInstance.prototype, {
      play: function () {
        if (this._state !== STATE_STOPPED) {
            this.stop();
        }

        if (!this.source) {
            if (!this._createSource()) {
                return false;
            }
        }

        this.volume = this._volume;
        this.pitch = this._pitch;
        this.loop = this._loop;

        this.source.play();
        this._state = STATE_PLAYING;
        this._playWhenLoaded = false;

        this._manager.on('volumechange', this._onManagerVolumeChange, this);
        this._manager.on('suspend', this._onManagerSuspend, this);
        this._manager.on('resume', this._onManagerResume, this);
        this._manager.on('destroy', this._onManagerDestroy, this);

        // suspend immediately if manager is suspended
        if (this._manager.suspended)
            this._onManagerSuspend();

        if (!this._suspendInstanceEvents)
            this._onPlay();

        return true;

      },
      pause: function () {
        if (!this.source || this._state !== STATE_PLAYING)
            return false;

        this._suspendEndEvent = true;
        this.source.pause();
        this._playWhenLoaded = false;
        this._state = STATE_PAUSED;
        this._startOffset = null;

        if (!this._suspendInstanceEvents)
            this._onPause();

        return true;
      },
      resume: function () {
        if (!this.source || this._state !== STATE_PAUSED)
            return false;

        this._state = STATE_PLAYING;
        this._playWhenLoaded = false;
        if (this.source.paused) {
          this.source.play();

          if (!this._suspendInstanceEvents)
              this._onResume();
        }
        return true;
      },
      stop: function () {
        if (!this.source || this._state === STATE_STOPPED)
            return false;

            this._manager.off('volumechange', this._onManagerVolumeChange, this);
            this._manager.off('suspend', this._onManagerSuspend, this);
            this._manager.off('resume', this._onManagerResume, this);
            this._manager.off('destroy', this._onManagerDestroy, this);

            this._suspendEndEvent = true;
            this.source.pause();
            this._playWhenLoaded = false;
            this._state = STATE_STOPPED;
            this._startOffset = null;

            if (!this._suspendInstanceEvents)
                this._onStop();

            return true;
      },
//not support three funcitons below
      setExternalNodes: function () {
        //not support
      },
      clearExternalNodes: function () {
        //not support
      },
      getExternalNodes: function () {
        //not support but return same type of results
        return [null, null];
      },
      //sets start time after loadedmetadata if fired which is
      //required by most browsers
      _onLoadedMetadata: function () {
        this.source.removeEventListener('loadedmetadata', this._loadedMetadataHandler);

        this._isReady = true;

        // calculate start time for source
        var offset = capTime(this._startOffset, this.duration);
        offset = capTime(this._startTime + offset, this._sound.duration);
        // reset currentTime
        this._startOffset = null;

        // set offset on source
        this.source.currentTime = offset;
      },
      _createSource: function () {
        if (this._sound && this._sound.audio) {

            this._isReady = false;
            this.source = this._sound.audio.cloneNode(true);

            // set events
            this.source.addEventListener('loadedmetadata', this._loadedMetadataHandler);
            this.source.addEventListener('timeupdate', this._timeUpdateHandler);
            this.source.onended = this._endedHandler;
        }

        return this.source;
      },
      //called every time the 'currentTime' is changed
      _onTimeUpdate: function () {
        if (!this._duration)
            return;

        // if the currentTime passes the end then if looping go back to the beginning
        // otherwise manually stop
        if (this.source.currentTime > capTime(this._startTime + this._duration, this.source.duration)) {
            if (this.loop) {
                this.source.currentTime = capTime(this._startTime, this.source.duration);
            } else {
                // remove listener to prevent multiple calls
                this.source.removeEventListener('timeupdate', this._timeUpdateHandler);
                this.source.pause();

                // call this manually because it doesn't work in all browsers in this case
                this._onEnded();
            }
        }
      },
      //handle the manager's 'destroy', event
      _onManagerDestroy: function () {
        if (this.source) {
          this.source.pause();
        }
      }
    });

    Object.defineProperty(SoundInstance.prototype, 'volume',{
      get: function () {
        return this._volume;
      },
      set: function (volume) {
        volume = ape.math.clamp(volume, 0, 1);
        this._volume = volume;
        if (this.source) {
          this.source.volume = volume * this._manager.volume;
        }
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'pitch',{
      get: function () {
        return this._pitch;
      },
      set: function (pitch) {
        this._pitch = Math.max(Number(pitch) || 0, 0.01);
        if (this.source) {
          this.source.playbackRate = this._pitch;
        }
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'loop',{
      get: function () {
        return this._loop;
      },
      set: function (loop) {
        this._loop = !!loop;
        if (this.source) {
          this.source.loop = this._loop;
        }
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'sound',{
      get: function () {
        return this._sound;
      },
      set: function (value) {
        this.stop();
        this._sound = value;
      }
    });
    Object.defineProperty(SoundInstance.prototype, 'currentTime',{
      get: function () {
        if (this._startOffset !== null) {
          return this._startOffset;
        }

        if (this._state === STATE_STOPPED || !this.source) {
          return 0;
        }

        return this.source.currentTime - this._startTime;
      },
      set: function (value) {
        if (value < 0) return;

        this._startOffset = value;
        if (this.source && this._isReady) {
          this.source.currentTime = capTime(this._startTime + capTime(value, this.duration), this._sound.duration);
          this._startOffset = null;
        }
      }
    });
////////////////////////////////////////
  } else {
    SoundInstance = function () {};
  }
//Add function which don't depend on source type
  Object.assign(SoundInstance.prototype, {
    _onPlay: function () {
      this.fire('play');

      if (this._onPlayCallback)
          this._onPlayCallback(this);
    },
    _onPause: function () {
      this.fire('pause');

      if (this._onPauseCallback)
          this._onPauseCallback(this);
    },
    _onResume: function () {
      this.fire('resume');

      if (this._onResumeCallback)
          this._onResumeCallback(this);
    },
    _onStop: function () {
      this.fire('stop');

      if (this._onStopCallback)
          this._onStopCallback(this);
    },
    _onEnded: function () {
      if (this._suspendEndEvent) {
        this._suspendEndEvent = false;
        return;
      }

      this.fire('end');

      if (this._onEndCallback)
          this._onEndCallback(this);

      this.stop();
    },
    _onManagerVolumeChange: function () {
      this.volume = this._volume;
    },
    _onManagerSuspend: function () {
      if (this._state === STATE_PLAYING && !this._suspended){
        this._suspended = true;
        this.pause();
      }
    },
    _onManagerResume: function () {
      if (this._suspended) {
          this._suspended = false;
          this.resume();
      }
    }
  });
  Object.defineProperty(SoundInstance.prototype, 'startTime', {
    get: function () {
      return this._startTime;
    },
    set: function (value) {
      this._startTime = Math.max(0, Number(value) || 0);
      //restart
      var isPlaying = this._state === STATE_PLAYING;
      this.stop();
      if (isPlaying) {
        this.play();
      }
    }
  });
  Object.defineProperty(SoundInstance.prototype, 'duration', {
    get: function () {
      if (!this._sound) {
        return 0;
      }
      if (this._duration) {
        return capTime(this._duration, this._sound.duration);
      }
      return this._sound.duration;
    },
    set: function (value) {
      this._duration = Math.max(0, Number(value) || 0);

      //restart
      var isPlaying = this._state === STATE_PLAYING;
      this.stop();
      if (isPlaying) {
        this.play();
      }
    }
  });
  Object.defineProperty(SoundInstance.prototype, 'isPlaying', {
    get: function () {
      return this._state === STATE_PLAYING;
    }
  });
  Object.defineProperty(SoundInstance.prototype, 'isPaused', {
    get: function () {
      return this._state === STATE_PAUSED;
    }
  });
  Object.defineProperty(SoundInstance.prototype, 'isStopped', {
    get: function () {
      return this._state === STATE_STOPPED;
    }
  });
  Object.defineProperty(SoundInstance.prototype, 'isSuspended', {
    get: function () {
      return this._suspended;
    }
  });

  return {
    SoundInstance: SoundInstance
  };
}());
