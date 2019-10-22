Object.assign(ape, function () {
  var Batch = function (meshInstances, dynamic, batchGroupId) {};
  var BatchGroup = function (id, name, dynamic, maxAabbSize, layers) {};
  var SKinBatchInstance = function (device, nodes, rootNode) {};

  Object.assign(SKinBatchInstance.prototype, {
    updateMatrices: function () {},
    updateMatrixPalette: function () {}
  });

//////////////////////////////////////
  function paramsIdentical(a, b) {
      if (a && !b) return false;
      if (!a && b) return false;
      a = a.data;
      b = b.data;
      if (a === b) return true;
      if (a instanceof Float32Array && b instanceof Float32Array) {
          if (a.length !== b.length) return false;
          for (var i = 0; i < a.length; i++) {
              if (a[i] !== b[i]) return false;
          }
          return true;
      }
      return false;
  }
/////////////////////////////////////
var BatchManager = function (device, root, scene) {};

BatchManager.prototype.destroyManager = function () {};
BatchManager.prototype.addGroup = function (name, dynamic, maxAabbSize, id, layers) {};
BatchManager.prototype.removeGroup = function (id) {};
BatchManager.prototype.markGroupDirty = function (id) {};
BatchManager.prototype.getGroupByName = function (name) {};
BatchManager.prototype.getBatches = function (batchGroupId) {};
BatchManager.prototype._removeModelsFromBatchGroup = function (node, id) {};
BatchManager.prototype._collectAndRemoveModels = function (node, groupMeshInstances, groupIds) {};
BatchManager.prototype._registerEntities = function (batch, meshInstances) {};
BatchManager.prototype.generate = function (groupIds) {};
BatchManager.prototype.prepare = function (meshInstances, dynamic, maxAabbSize) {};
BatchManager.prototype.create = function (meshInstances, dynamic, batchGroupId) {};
BatchManager.prototype.update = function (batch) {};
BatchManager.prototype.updateAll = function () {};
BatchManager.prototype.clone = function (batch, clonedMeshInstances) {};
BatchManager.prototype.destroy = function (batch) {};
BatchManager.prototype.decrement = function (batch) {};
BatchManager.prototype.register = function (batch, entities) {};

return {
  Batch: Batch,
  BatchGroup: BatchGroup,
  BatchManager: BatchManager
};
}());
