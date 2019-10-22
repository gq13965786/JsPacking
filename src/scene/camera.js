Object.assign(ape, function () {
  //pre-allocated temp variables
  var _deviceCoord = new ape.Vec3();
  var _far = new ape.Vec3();
  var _farW = new ape.Vec3();
  var _invViewProjMat = new ape.Mat4();
  var Camera = function () {};

  Object.assign(Camera.prototype, {
    clone: function () {},
    worldToScreen: function (worldCoord, cw, ch, screenCoord) {},
    screenToWorld: function (x, y, z, cw, ch, worldCoord) {},
    getClearOptions: function () {},
    getProjectionMatrix: function () {},
    getRect: function () {},
    setClearOptions: function () {},
    setRect: function () {},
    setScissorRect: function () {},
    requestDepthMap: function () {},
    releaseDepthMap: function () {}
  });

  Object.defineProperty(Camera.prototype, 'aspectRatio', {});
  Object.defineProperty(Camera.prototype, 'projection', {});
  Object.defineProperty(Camera.prototype, 'nearClip', {});
  Object.defineProperty(Camera.prototype, 'farClip', {});
  Object.defineProperty(Camera.prototype, 'fov', {});
  Object.defineProperty(Camera.prototype, 'horizontalFov', {});
  Object.defineProperty(Camera.prototype, 'orthoHeight', {});
  Object.defineProperty(Camera.prototype, 'clearColor', {});
  Object.defineProperty(Camera.prototype, 'clearDepth', {});
  Object.defineProperty(Camera.prototype, 'clearStencil', {});
  Object.defineProperty(Camera.prototype, 'clearFlags', {});

  return {
    Camera: Camera
  };
}());
