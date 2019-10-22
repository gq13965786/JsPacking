Object.assign(ape, function () {
  'use strict';

  var BinaryHandler = function () {};

  Object.assign(BinaryHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {}
  });

  return {
    BinaryHandler: BinaryHandler
  };
}())
