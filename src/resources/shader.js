Object.assign(ape, function () {
  'use strict';

  var ShaderHandler = function () {};

  Object.assign(ShaderHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {}
  });

  return {
    ShaderHandler: ShaderHandler
  };
}());
