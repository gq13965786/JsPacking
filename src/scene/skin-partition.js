Object.assign(ape, function () {
  function PartitionedVertex() {}
  function SkinPartition() {}

  Object.assign(SkinPartition.prototype, {
    addVertex: function (vertex, idx, vertexArray) {},
    addPrimitive: function (vertices, vertexIndices, vertexArray, boneLimit) {},
    getBoneRemap: function (boneIndex) {}
  });

  function indicesToReferences(model) {}
  function referencesToIndices(model) {}
  function partitionSkin(model, materialMappings, boneLimit) {}

  return {
    partitionSkin: partitionSkin
  };
}());
