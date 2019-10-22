Object.assign(ape, function () {
  'use strict';

  var JSON_PRIMITIVE_TYPE = {};
  var JSON_VERTEX_ELEMENT_TYPE = {};
  //take JSON model data and create ape.model
  var JsonModelParser = function (device) {};

  Object.assign(JsonModelParser.prototype, {
    parse: function (data) {},
    _parseNodes: function (data) {},
    _parseSkins: function (data, nodes) {},
    _parseMorphs: function (data, nodes) {},
    //optimized ape.calculateTangents for many calls with  different
    //index buffer but same vertex buffer
    _calculateTangentsMorphTarget: function (positions, normals, uvs, indices,
        tan1, tan2, mtIndices, tangents) {},
    _initMorphs: function (data, morphs, vertexBuffers, meshes) {},
    _parseVertexBuffers: function (data) {},
    _parseIndexBuffers: function (data, vertexBuffers) {},
    _parseMeshes: function (data, skins, morphs, vertexBuffers, indexBuffer, indexData) {},
    _parseMeshInstances: function (data, nodes, meshes, skins, skinInstances, morphs, morphInstances) {}
  });

  return {
    JsonModelParser: JsonModelParser
  };
}());
