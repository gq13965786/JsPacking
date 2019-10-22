Object.assign(ape, function () {
  'use strict';

  var CssHandler = function () {};

  Object.assign(CssHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {}
  });

  var createStyle = function (cssString) {};

  return {
    CssHandler: CssHandler,
    createStyle: createStyle
  };
}());
