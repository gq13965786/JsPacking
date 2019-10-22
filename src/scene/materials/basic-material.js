Object.assign(ape, function () {

  var BasicMaterial = function () {};
  BasicMaterial.prototype = Object.create(ape.Material.prototype);
  BasicMaterial.prototype.constructor = BasicMaterial;

  Object.assign(BasicMaterial.prototype, {
    clone: function () {},
    updateUniforms: function () {},
    updateShader: function (device, scene, objDefs, staticLightList, pass, sortedLights) {}
  });

  return {
    BasicMaterial: BasicMaterial
  };
}());
