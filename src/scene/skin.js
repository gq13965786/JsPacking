Object.assign(ape, function () {
  var _invMatrix = new ape.Mat4();

  var Skin = function (graphicsDevice, ibp, boneNames) {};

  var SkinInstance = function (skin) {};
  Object.assign(SkinInstance.prototype, {
    updateMatrices: function (rootNode) {},
    updateMatrixPalette: function () {}
  });

  return {
    Skin: Skin,
    SkinInstance: SkinInstance
  };
}());
