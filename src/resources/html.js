Object.assign(ape, function () {
  'use strict';

  var HtmlHandler = function () {};

  Object.assign(HtmlHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {}
  });

  return {
    HtmlHandler: HtmlHandler
  };
}());
