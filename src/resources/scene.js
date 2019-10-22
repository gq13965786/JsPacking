Object.assign(ape, function () {
  'use strict';

  var SceneHandler = function (app) {
    this._app = app;
  };

  Object.assign(SceneHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {}
  });

  return {
    SceneHandler: SceneHandler
  };
}());
