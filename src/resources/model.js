Object.assign(ape, function () {
  var ModelHandler = function (device, defaultMaterial) {};

  Object.assign(ModelHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    patch: function (asset, assets) {},
    addParser: function (parser, decider) {}
  });

  return {
    ModelHandler: ModelHandler
  };
}());
