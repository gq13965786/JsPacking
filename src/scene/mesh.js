Object.assign(ape, function () {
  var id = 0;
  var _tmpAabb = new ape.BoundingBox();
  var Mesh = function () {};
  Object.defineProperty(Mesh.prototype, 'aabb', {});

  var MeshInstance = function MeshInstance(node, mesh, material) {};
  Object.defineProperty(MeshInstance.prototype,'mesh', {});
  Object.defineProperty(MeshInstance.prototype,'aabb', {});
  Object.defineProperty(MeshInstance.prototype,'material', {});
  Object.defineProperty(MeshInstance.prototype,'layer', {});
  Object.defineProperty(MeshInstance.prototype,'receiveShadow', {});
  Object.defineProperty(MeshInstance.prototype,'skinInstance', {});
  Object.defineProperty(MeshInstance.prototype,'screenSpace', {});
  Object.defineProperty(MeshInstance.prototype,'key', {});
  Object.defineProperty(MeshInstance.prototype,'mask', {});
  Object.assign(MeshInstance.prototype, {
    syncAabb: function () {},
    updateKey: function () {},
    setParameter: ape.Material.prototype.setParameter,
    setParameters: ape.Material.prototype.setParameters,
    deleteParameter: ape.Material.prototype.deleteParameter,
    getParameter: ape.Material.prototype.getParameter,
    getParameters: ape.Material.prototype.getParameters,
    clearParameters: ape.Material.prototype.clearParameters
  });

  var Command = function (layer, blendType, command) {};
  Object.defineProperty(Command.prototype, 'key', {});

  var InstancingData = function (numObjects, dynamic, instanceSize) {};
  Object.assign(InstancingData.prototype, {
    update: function () {}
  });

  function getKey(layer, blendType, isCommand, materialId) {}

  return {
    Command: Command,
    Mesh: Mesh,
    MeshInstance: MeshInstance,
    InstancingData: InstancingData,
    _getDrawcallSortKey: getKey
  }
}());
