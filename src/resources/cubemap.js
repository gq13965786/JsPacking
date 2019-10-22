Object.assign(ape, function () {
  var CubemapHandler = function (device, assets, loader) {};

  Object.assign(CubemapHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (assetCubeMap, assets) {},
    _patchTexture: function () {},
    _patchTextureFaces: function () {assetCubeMap, assets}
  });

  return {
    CubemapHandler: CubemapHandler
  };
}());
