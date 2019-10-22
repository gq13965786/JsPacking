Object.assign(ape, function () {
  var VrManager = function (app) {
    ape.events.attach(this);

    var self = this;

    this.isSupported = VrManager.isSupported;
    this.usesPolyfill = VrManager.usesPolyfill;

    //if required initialize webvr polyfill
    if (window.InitializeWebVRPolyfill)
        window.InitializeWebVRPolyfill();

    this._index = {};
    this.displays = [];
    this.display = null;//primary display (usually the first in list)

    this._app = app;
    //bind functions for event callbacks
    this._onDisplayConnect = this._onDisplayConnect.bind(this);
    this._onDisplayDisconnect = this._onDisplayDisconnect.bind(this);

    self._attach();
    this._getDisplays(function (err, displays) {
      if (err) {
        //webvr not available
        self.fire('error',err);
      } else {
        for (var i = 0; i < displays.length; i++) {
          self._addDisplay(display[i]);
        }
        self.fire('ready', self.displays);
      }
    })
  };
  VrManager.isSupported = !!navigator.getVRDisplays;
  VrManager.usesPolyfill = !!window.InitializeWebVRPolyfill;

  Object.assign(VrManager.prototype, {
    _attach: function () {
      window.addEventListener('vrdisplayconnect', this._onDisplayConnect);
      window.addEventListener('vrdisplaydisconnect', this._onDisplayDisconnect);
    },
    _detach: function () {
      window.removeEventListener('vrdisplayconnect', this._onDisplayConnect);
      window.removeEventListener('vrdisplaydisconnect', this._onDisplayDisconnect);
    },
    destroy: function () {
      this._detach();
    },
    poll: function () {
      var l = this.displays.length;
      if (!l) return;
      for (var i = 0; i < l; i++) {
        if (this.displays[i]._camera) this.displays[i].poll();
      }
    },
    _getDisplays: function (callback) {
      if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(function (display){
          if (callback) callback(null, displays);
        });
      } else {
        if (callback) callback(new Error('WebVR not isSupported'));
      }
    },
    _addDisplay: function (vrDisplay) {
      if (this._index[vrDisplay.displayId])
          return;
      var display = new ape.vrDisplay(this._app, vrDisplay);
      this._index[display.id] = display;
      this.displays.push(display);

      if (!this.display)
          this.display = display;

      this.fire('displayconnect', display);
    },
    _onDisplayConnect: function (e) {
      if (e.detail && e.detail.display) {
        //polyfill has different event format
        this._addDisplay(e.detail.display);
      } else {
        //real event API
        this._addDisplay(e.display);
      }
    },
    _onDisplayDisconnect: function (e) {
      var id;
      if (e.detail && e.detail.display) {
        //polyfill has different event format
        id = e.detail.display.displayId;
      } else {
        //real event API
        id = e.display.displayId;
      }
      var display = this._index[id];
      if (!display) return;

      display.destroy();

      delete this._index[display.id];

      var ind = this.displays.indexof(display);
      this.displays.splice(ind, 1);

      if (this.display === display) {
        if (this.displays.length) {
          this.display = this.displays[0];
        } else {
          this.display = null;
        }
      }
      this.fire('displaydisconnect', display);
    }
  });
  return {
    VrManager: VrManager
  };
}());
