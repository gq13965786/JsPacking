Object.assign(ape, function () {
  var SpriteHandler = function (assets, device) {
    this._assets = assets;
    this._device = device;
  };
//the scope of this function is the sprite asset
  var onTextureAtLoaded = function (atlasAsset) {

  };
//the scope of this function is the sprite asset
  var onTextureAtlasAdded = function (atlasAsset) {};

  Object.assign(SpriteHandler.prototype, {
    load: function (url, callback) {},
//create sprite resource
    open: function (url, data) {},
//set sprite data
    patch: function (asset, assets) {},
//load atlas
    _updateAtlas: function (asset) {},
    _onAssetChange: function (asset, attribute, value, oldValue) {}
  });

  return {
    SpriteHandler: SpriteHandler
  };
}());
