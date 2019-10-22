Object.assign(ape, function () {
  'use strict';

  var ScriptHandler = function (app) {};
  ScriptHandler._types = [];
  ScriptHandler._push = function (Type) {};

  Object.assign(ScriptHandler.prototype, {
    load: function (url) {},
    open: function (url, data) {},
    patch: function (asset, assets) {},
    _loadScript: function (url, callback) {}
  });

  return {
    ScriptHandler: ScriptHandler
  };
}());
