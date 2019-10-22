Object.assign(ape, function () {
  'use strict';

  function upgradeDataSchema(data) {}

  var FontHandler = function (loader) {};

  Object.assign(FontHandler.prototype, {
    load: function (url, callback, asset) {},
    _loadTextures: function (url, data, callback) {},
    open: function (url, data, asset) {},
    patch: function (asset, assets) {}
  });

  return {
    FontHandler: FontHandler
  };
}());
