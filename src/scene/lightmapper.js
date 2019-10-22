Object.assign(ape, function () {
  var maxSize = 2048;
  var maskBaked = 2;
  var maskLightmap = 4;

  var sceneLightmaps = [];
  var sceneLightmapsNode = [];
  var lmCamera;
  var tempVec = new ape.Vec3();
  var bounds = new ape.BoundingBox();
  var lightBounds = new ape.BoundingBox();
  var tempSphere = {};

  var PASS_COLOR = 0;
  var PASS_DIR = 1;

  var passTexName = ["texture_lightMap", "texture_dirLightMap"];
  var passMaterial = [];

  function collectModels(node, nodes, nodesMeshInstances, allNodes) {}

  var Lightmapper = function (device, root, scene, renderer, assets) {};
  Object.assign(Lightmapper.prototype, {
    destroy: function () {},
    calculateLightmapSize: function (node) {},
    bake: function (nodes, mode) {}
  });

  return {
    Lightmapper: Lightmapper
  };
}());
