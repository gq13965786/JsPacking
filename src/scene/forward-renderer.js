Object.assign(ape, function () {
  //Global shadowmap resources
  var scaleShift = new ape.Mat4().mul2();

  var opChanId = { r: 1, g: 2, b: 3, a: 4};

  var pointLightRotations = [];

  var numShadowModes = 5;
  var shadowMapCache = [{},{},{},{},{}];// must be a size of numShadowModes

  var directionalShadowEpsilon = 0.01;
  var pixelOffset = new Float32Array(2);
  var blurScissorRect = {x:1,y:1,z:0,w:0};

  var shadowCamView = new ape.Mat4();
  var shadowCamViewProj = new ape.Mat4();
  var c2sc = new ape.Mat4();

  var viewInvMat = new ape.Mat4();
  var viewMat = new ape.Mat4();
  var viewMat3 = new ape.Mat4();
  var viewProjMat = new ape.Mat4();
  var projMat;

  var viewInvL = new ape.Mat4();
  var viewInvR = new ape.Mat4();
  var viewL = new ape.Mat4();
  var viewR = new ape.Mat4();
  var viewPosL = new ape.Vec3();
  var viewPosR = new ape.Vec3();
  var projL, projR;
  var viewMat3L = new ape.Mat4();
  var viewMat3R = new ape.Mat4();
  var viewProjMatL = new ape.Mat4();
  var viewProjMatR = new ape.Mat4();

  var frustumDiagonal = new ape.Vec3();
  var tempSphere = {center: null, radius: 0};
  var meshPos;
  var visibleSceneAabb = new ape.BoundingBox();
  var boneTextureSize = [0,0];
  var boneTexture, instancingData, modelMatrix, normalMatrix;

  var shadowMapCubeCache = {};
  var maxBlurSize = 25;

  var keyA, keyB;

  var frustumPoints = [];
  for (var fp = 0; fp < 8; fp++) {}

  function _getFrustumPoints(camera, farClip, points) {}

  var _sceneAABB_LS = [];

  function _getZFromAABBSimple(w2sc, aabbMin, aabbMax, lcamMinX, lcamMaxX, lcamMinY, lcamMaxY) {}
  //shadow mapping support functions
  function getShadowFormat(device, shadowType) {}
  function getShadowFiltering(device, shadowType) {}
  function createShadowMap(device, width, height, shadowType) {}
  function createShadowCubeMap(device, size) {}
  function gauss(x, sigma) {}
  function gaussWeights(kernelSize) {}
  function createShadowCamera(device, shadowType, type) {}
  function getShadowMapFromCache(device, res, mode, layer) {}
  function createShadowBuffer(device, light) {}
  function getDepthKey(meshInstance) {}
  function ForwardRenderer(graphicsDevice) {}
  function mat3FromMat4(m3, m4) {}

  Object.assign(ForwardRenderer.prototype, {
    sortCompare: function (drawCallA, drawCallB) {},
    sortCompareMesh: function (drawCallA, drawCallB) {},
    depthSortCompare: function (drawCallA, drawCallB) {},
    lightCompare: function (lightA, lightB) {},
    _isVisible: function (camera, meshInstance) {},
    getShadowCamera: function (device, light) {},
    updateCameraFrustum: function (camera) {},
    setCamera: function (camera, target, clear, cullBorder) {},
    dispatchGlobalLight: function (scene) {},
    _resolveLight: function (scope, i) {},
    dispatchDirectLights: function (dirs, scene, mask) {},
    dispatchPointLight: function (scene, scope, point, cnt) {},
    dispatchSpotLight: function (scene, scope, spot, cnt) {},
    dispatchLocalLights: function (sorteLights, scene, mask, usedDirLights, staticLightList) {},
    cull: function (camera, drawCalls, visibleList) {},
    cullLights: function (camera, lights) {},
    updateCpuSkinMatrices: function (drawCalls) {},
    updateGpuSkinMatrices: function (drawCalls) {},
    updateMorphedBounds: function (drawCalls) {},
    updateMorphing: function (drawCalls) {},
    setBaseConstants: function (device, material) {},
    setSkinning: function (device, meshInstance, material) {},
    drawInstance: function (device, meshInstance, mesh, style, normal) {},
    // used for stereo
    drawInstance2: function (device, meshInstance, mesh, style) {},
    renderShadows: function (lights, cameraPass) {},
    updateShader: function (meshInstance, objDefs, staticLightList, pass, sortedLights) {},
    renderForward: function (camera, drawCalls, drawCallsCount, sortedLights, pass, cullingMask, drawCallback, layer) {},
    setupInstancing: function (device) {},
    revertStaticMeshes: function(meshInstances) {},
    prepareStaticMeshes: function (meshInstance, lights) {},
    updateShaders: function (drawCalls) {},
    updateLitShaders: function (drawCalls) {},
    beginFrame: function (comp) {},
    beginLayers: function (comp) {},
    cullLocalShadowmap: function (light, drawCalls) {},
    cullDirectionalShadowmap: function (light, drawCalls, camera, pass) {},
    gpuUpdate: function (drawCalls) {},
    clearView: function (camera, target, options) {},
    setSceneConstants: function () {},
    renderComposition: function () {}
  });

  return {
    ForwardRenderer: ForwardRenderer,
    gaussWeights: gaussWeights
  };
}());
