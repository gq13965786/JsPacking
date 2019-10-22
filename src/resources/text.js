Object.assign(ape, function () {
  'use strict';

  var TextHandler = function () {};

  Object.assign(TextHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {}
  });

  return {
    TextHandler: TextHandler
  };
}());
