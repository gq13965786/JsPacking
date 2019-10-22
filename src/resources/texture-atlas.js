Object.assign(ape, function () {
  var JSON_ADDRESS_MODE = {};
  var JSON_FILTER_MODE = {};

  var regexFrame = /^data\.frames\.(\d+)$/;

  var TextureAtlasHandler = function (loader) {};

  Object.assign(TextureAtlasHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {},
    _onAssetChange: function (asset, attribute, value) {}
  });

  return {
    TextureAtlasHandler: TextureAtlasHandler
  };
}());
