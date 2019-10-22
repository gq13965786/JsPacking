Object.assign(ape, function () {
  var particleVerts = [];
  var _createTexture = function (device, width, height, pixelData, format, mult8Bit, filter) {};

  function frac(f) {}
  function encodeFloatRGBA(v) {}
  function encodeFloatRG(v) {}
  function saturate(x) {}
  function glMod(x, y) {}

  var default0Curve = new ape.Curve([0,0,1,0]);
  var default1Curve = new ape.Curve([0,1,1,1]);
  var default2Curve = new ape.Curve([0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]);
  var default3Curve = new ape.Curve([0, 1, 1, 1], [0, 1, 1, 1], [0, 1, 1, 1]);

  var particleTexHeight = 2;
  var particleTexChannels = 4;

  var velocityVec = new ape.Vec3();
  var localVelocityVec = new ape.Vec3();
  var velocityVec2 = new ape.Vec3();
  var localVelocityVec2 = new ape.Vec3();
  var rndFactor3Vec = new ape.Vec3();
  var particlePosPrev = new ape.Vec3();
  var particlePos = new ape.Vec3();
  var particleFinalPos = new ape.Vec3();
  var moveDirVec = new ape.Vec3();
  var rotMat = new ape.Mat4();
  var spawnMatrix3 = new ape.Mat3();
  var emitterMatrix3 = new ape.Mat3();
  var uniformScale = 1;
  var nonUniformScale;
  var spawnMatrix = new ape.Mat4();
  var randomPos = new ape.Vec3();
  var randomPosTformed = new ape.Vec3();
  var tmpVec3 = new ape.Vec3();
  var bMin = new ape.Vec3();
  var bMax = new ape.Vec3();

  var setPropertyTarget;
  var setPropertyOptions;

  function setProperty(pName, defaultVal) {}
  function pack3NFloats(a, b, c) {}
  function packTextureXYZ_NXYZ(qXYZ, qXYZ2) {}
  function packTextureRGBA(qRGB, qA) {}
  function packTexture5Floats(qA, qB, qC, qD, qE) {}
  var ParticleEmitter = function (graphicsDevice, options) {};
  function calcEndTime(emitter) {}
  function subGraph(A, B) {}
  function maxUnsignedGraphValue(A, outUMax) {}
  function normalizeGraph(A, uMax) {}
  function divGraphFrom2Curves(curve1, curve2, outUMax) {}
  function mat4ToMat3(mat4, mat3) {}

  Object.assign(ParticleEmitter.prototype, {
    onChangeCamera: function () {},
    calculateBoundsMad: function () {},
    calculateWorldBounds: function () {},
    calculateLocalBounds: function () {},
    rebuild: function () {},
    _isAnimated: function () {},
    calcSpawnPosition: function (emitterPos, i) {},
    rebuildGraphs: function () {},
    _initializeTextures: function () {},
    regenShader: function () {},
    resetMaterial: function () {},
    //Declears vertex format, creates VB and IB
    _allocate: function (numParticles) {},
    reset: function () {},
    prewarm: function (time) {},
    resetTime: function () {},
    finishFrame: function () {},
    addTime: function (delta, isOnStop) {},
    _destroyResources: function () {},
    destroy: function () {}
  });

  return {
    ParticleEmitter: ParticleEmitter
  };
}());
