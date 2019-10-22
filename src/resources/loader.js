//Resource loader

Object.assign(ape, function () {
  'use strict';

  var ResourceLoader = function (app) {
    this._handlers = {};
    this._requests = {};
    this._cache = {};
    this._app = app;
  };

  Object.assign(ResourceLoader.prototype, {
    addHandler: function (type, handler) {
      this._handlers[type] = handler;
      handler._loader = this;
    },
    removeHandler: function (type) {
      delete this._handlers[type];
    },
    getHandler: function (type) {
      return this._handlers[type];
    },
    load: function (url, type, callback, asset) {
      var handler = this._handlers[type];
      if (!handler) {
        var err = "No handler for asset type: " + type;
        callback(err);
        return;
      }

      var key = url + type;

      if (this._cache[key] !== undefined) {
          // in cache
          callback(null, this._cache[key]);
      } else if (this._requests[key]) {
          // existing request
          this._requests[key].push(callback);
      } else {
          // new request
          this._requests[key] = [callback];

          var handleLoad = function (err, urlObj) {
              if (err) {
                  console.error(err);
                  if (this._requests[key]) {
                      for (var i = 0, len = this._requests[key].length; i < len; i++) {
                          this._requests[key][i](err);
                      }
                  }
                  delete this._requests[key];
                  return;
              }

              handler.load(urlObj, function (err, data, extra) {
                  // make sure key exists because loader
                  // might have been destroyed by now
                  if (!this._requests[key])
                      return;

                  var i, len = this._requests[key].length;

                  var resource;
                  if (! err) {
                      try {
                          resource = handler.open(urlObj.original, data, asset);
                      } catch (ex) {
                          err = ex;
                      }
                  }

                  if (!err) {
                      this._cache[key] = resource;
                      for (i = 0; i < len; i++)
                          this._requests[key][i](null, resource, extra);
                  } else {
                      console.error(err);
                      for (i = 0; i < len; i++)
                          this._requests[key][i](err);
                  }
                  delete this._requests[key];
              }.bind(this), asset);
          }.bind(this);

          var normalizedUrl = url.split('?')[0];
          if (this._app.enableBundles && this._app.bundles.hasUrl(normalizedUrl)) {
              if (!this._app.bundles.canLoadUrl(normalizedUrl)) {
                  handleLoad('Bundle for ' + url + ' not loaded yet');
                  return;
              }

              this._app.bundles.loadUrl(normalizedUrl, function (err, fileUrlFromBundle) {
                  handleLoad(err, { load: fileUrlFromBundle, original: url });
              });
          } else {
              handleLoad(null, { load: url, original: url });
          }

      }      
    },
    open: function (type, data) {
      var handler = this._handlers[type];
      if (!handler) {
        console.warn("No resource handler found for: " + type);
        return data;
      }

      return handler.open(null, data);
    },
    patch: function (asset, assets) {
      var handler = this._handlers[asset.type];
      if (!handler) {
        console.warn("No resource handler found for: " + asset.type);
        return;
      }
      if (handler.patch) {
        handler.patch(asset, assets);
      }
    },
    clearCache: function (url, type) {
      delete this._cache[url + type];
    },
    getFromCache: function (url, type) {
      if (this._cache[url + type]) {
        return this._cache[url + type];
      }
    },
    destroy: function () {
      this._handlers = {};
      this._requests = {};
      this._cache = {};
    }
  });

  return {
    ResourceLoader: ResourceLoader
  };
}());
