Object.assign(ape, function () {
  var keyA,keyB,sortPos,sortDir;

  function sortManual(drawCallA, drawCallB) {}
  function sortMaterialMesh(drawCallA, drawCallB) {}
  function sortBackToFront(drawCallA, drawCallB) {}
  function sortFrontToBack(drawCallA, drawCallB) {}
  var sortCallbacks = [null, sortManual, sortMaterialMesh, sortBackToFront, sortFrontToBack];
  function sortCameras(camA, camB) {}
  function sortLights(lightA, lightB) {}

  //Layers
  var layerCounter = 0;
  var VisibleInstanceList = function () {};
  var InstanceList = function () {};
  InstanceList.prototype.clearVisibleLists = function (cameraPass) {};

  var Layer = function (options) {};
  Object.defineProperty(Layer.prototype, "enabled", {});
  Object.defineProperty(Layer.prototype, "clearColor", {});
  Layer.prototype._updateClearFlags = function () {};
  Object.defineProperty(Layer.prototype, "clearColorBuffer", {});
  Object.defineProperty(Layer.prototype, "clearDepthBuffer", {});
  Object.defineProperty(Layer.prototype, "clearStencilBuffer", {});

  Layer.prototype.incrementCounter = function () {};
  Layer.prototype.decrementCounter = function () {};
  Layer.prototype.addMeshInstances = function (meshInstances, skipShadowCasters) {};
  Layer.prototype.removeMeshInstances = function (meshInstances, skipShadowCasters) {};
  Layer.prototype.clearMeshInstances = function (skipShadowCasters) {};
  Layer.prototype.addLight = function (light) {};
  Layer.prototype.removeLight = function (light) {};
  Layer.prototype.clearLights = function () {};
  Layer.prototype.addShadowCasters = function (meshInstances) {};
  Layer.prototype.removeShadowCasters = function (meshInstances) {};
  Layer.prototype._generateLightHash = function () {};
  Layer.prototype._generateCameraHash = function () {};
  Layer.prototype.addCamera = function (camera) {};
  Layer.prototype.removeCamera = function (camera) {};
  Layer.prototype.clearCameras = function () {};
  Layer.prototype._sortCameras = function () {};
  Layer.prototype._calculateSortDistances = function (drawCalls, drawCallsCount, camPos, camFwd) {};
  Layer.prototype._sortVisible = function (transparent, cameraNode, cameraPass) {};

  return {
    Layer: Layer,
    InstanceList: InstanceList,
    VisibleInstanceList: VisibleInstanceList
  };
}());
