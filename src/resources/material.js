Object.assign(ape, function () {
  'use strict';

  var PLACEHOLDER_MAP = {};

  var MaterialHandler = function (app) {};

  Object.assign(MaterialHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    _createPlaceholders: function () {},
    patch: function (asset, assets) {},
    _onAssetUnload: function (asset) {},
    _assignTexture: function (parameterName, MaterialAsset, texture) {},
    //assign a placeholder texture while waiting for one to load
    //placeholder textures do not replace the data[parameterName] value
    //in the asset.data thus preserving the final asset id until it is loaded
    _assignPlaceholderTexture: function (parameterName, materialAsset) {},
    _onTextureLoad: function (parameterName, materialAsset, textureAsset) {},
    _onTextureAdd: function (parameterName, materialAsset, textureAsset) {},
    _onTextureRemove: function (parameterName, materialAsset, textureAsset) {},
    _assignCubemap: function (parameterName, aterialAsset, textures) {},
    _onCubemapLoad: function (parameterName, materialAsset, cubemapAsset) {},
    _onCubemapAdd: function (parameterName, materialAsset, cubemapAsset) {},
    _onCubemapRemove: function (parameterName, materialAsset, cubemapAsset) {},
    _bindAndAssignAssets: function (materialAsset, assets) {}
  });

  return {
    MaterialHandler: MaterialHandler
  };
}());
