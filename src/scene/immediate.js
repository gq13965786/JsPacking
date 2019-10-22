//write API to application
Object.assign(ape.Application.prototype, function () {
  var tempGraphNode = new ape.GraphNode();
  var identityGraphNode = new ape.GraphNode();
  var meshInstanceArray = [];
  var _deprecationWarning = false;

  var ImmediateData = function (device) {};
  ImmediateData.prototype.addLayer = function (layer) {};
  ImmediateData.prototype.getLayerIdx = function (layer) {};
  ImmediateData.prototype.addLayerIdx = function (idx, layer) {};

  var LineBatch = function () {};
  Object.assign(LineBatch.prototype, {
    init: function (device, vertexFormat, layer, linesToAdd) {},
    addLines: function (position, color) {},
    finalize: function () {}
  });

  function _initImmediate() {}
  function _addLines(position, color, options) {}
  function renderLine(start, end, color) {}
  function renderLines(position, color, options) {}
  //draw lines forming a transformed unit-sized cube at this frame
  //LineType is optional
  function renderWireCube(matrix, color, options) {}
  function _preRenderImmediate() {}
  function _postRenderImmediate() {}
  //draw meshInstance at this frame
  function renderMeshInstance(meshInstance, options) {}
  //draw mesh at this frame
  function renderMesh(mesh, material, matrix, options) {}
  //draw quad of size [-0.5, 0.5] at this frame
  function renderQuad(matrix, material, options) {}

  return {
    renderMeshInstance: renderMeshInstance,
    renderMesh: renderMesh,
    renderLine: renderLine,
    renderlines: renderLines,
    renderQuad: renderQuad,
    renderWireCube: renderWireCube,
    _addLines: _addLines,
    _initImmediate: _initImmediate,
    _preRenderImmediate: _preRenderImmediate,
    _postRenderImmediate: _postRenderImmediate
  };
}());
