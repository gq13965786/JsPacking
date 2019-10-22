Object.assign(ape, function () {

  var DepthMaterial = function () {};
  DepthMaterial.prototype = Object.create(ape.Material.prototype);
  DepthMaterial.prototype.constructor = DepthMaterial;

  Object.assign(DepthMaterial.prototype, {
    clone: function () {},
    updateShader: function (device) {}
  });

  return {
    DepthMaterial: DepthMaterial
  };
}());
