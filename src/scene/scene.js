(function () {
  var enums = {};
  Object.assign(ape, enums);
}());

Object.assign(ape, function () {
  var Scene = function Scene() {};
  Scene.prototype.destroy = function () {};
  Object.defineProperty(Scene.prototype,'fog', {});
  Object.defineProperty(Scene.prototype,'gammaCorrection', {});
  Object.defineProperty(Scene.prototype,'toneMapping', {});
  Object.defineProperty(Scene.prototype,'skybox', {});
  Object.defineProperty(Scene.prototype,'skyboxIntensity', {});
  Object.defineProperty(Scene.prototype,'skyboxMip', {});
  Object.defineProperty(Scene.prototype,'skyboxPrefiltered128', {});
  Object.defineProperty(Scene.prototype,'skyboxprefiltered64', {});
  Object.defineProperty(Scene.prototype,'skyboxprefiltered32', {});
  Object.defineProperty(Scene.prototype,'skyboxPrefiltered16', {});
  Object.defineProperty(Scene.prototype,'skyboxPrefiltered8', {});
  Object.defineProperty(Scene.prototype,'skyboxPrefiltered4', {});
  Object.defineProperty(Scene.prototype,'drawCalls', {});
  Object.defineProperty(Scene.prototype,'layers', {});
  //make those function or method, events null below
  Scene.prototype.applySettings = function (settings) {};
  Scene.prototype._updateSkybox = function (device) {};
  Scene.prototype._resetSkyboxModel = function () {};
  Scene.prototype.setSkybox = function (cubemaps) {};
  Scene.prototype.destroy = function () {};
  //drawback
  Scene.prototype.addModel = function (model) {};
  Scene.prototype.addShadowCaster = function (model) {};
  Scene.prototype.removeModel = function (model) {};
  Scene.prototype.removeShadowCasters = function (model) {};
  Scene.prototype.containsModel = function(model) {};
  Scene.prototype.getModels = function (model) {};

  return {
    Scene: Scene
  };
}());
