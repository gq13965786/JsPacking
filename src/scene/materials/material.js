Object.assign(ape, function () {
  var id = 0;
  var Material = function Material() {};

  Object.defineProperty(Material.prototype, 'shader', {});
  Object.defineProperty(Material.prototype, 'blendType', {});

  Material.prototype._cloneInternal = function (clone) {};
  Material.prototype.clone = function () {};
  Material.prototype._updateMeshInstanceKeys = function () {};
  Material.prototype.updateUniforms = function () {};
  Material.prototype.updateShader = function (device, scene, objDefs) {};
  Material.prototype.update = function () {};
  //parameter management
  Material.prototype.clearParameters = function () {};
  Material.prototype.getParameters = function () {};
  Material.prototype.clearVariants = function () {};
  Material.prototype.getParameter = function (name) {};
  Material.prototype.setParameter = function (name, data, passFlags) {};
  Material.prototype.deleteParameter = function (name) {};
  Material.prototype.setParameter = function () {};
  Material.prototype.destroy = function () {};

  return {
    Material: Material
  };
}());
