Object.assign(ape, function () {
  var spotCenter = new ape.Vec3();
  var spotEndPoint = new ape.Vec3();
  var tmpVec = new ape.Vec3();

  var chanId = {r:0, g:1, b:2, a:3};

  var Light = function Light() {};
  Object.assign(Light.prototype, {
    destroy: function () {},
    clone: function () {},
    getColor: function () {},
    getBoundingSphere: function (sphere) {},
    getBoundingBox: function (box) {},
    _updateFinalColor: function () {},
    setColor: function () {},
    _destroyShadowMap: function () {},
    updateShadow: function () {},
    updateKey: function () {}
  });

  Object.defineProperty(Light.prototype,'enabled', {});
  Object.defineProperty(Light.prototype,'type', {});
  Object.defineProperty(Light.prototype,'mask', {});
  Object.defineProperty(Light.prototype,'shadowType', {});
  Object.defineProperty(Light.prototype,'castShadows', {});
  Object.defineProperty(Light.prototype,'shadowResolution', {});
  Object.defineProperty(Light.prototype,'vsmBlurSize', {});
  Object.defineProperty(Light.prototype,'normalOffsetBias', {});
  Object.defineProperty(Light.prototype,'falloffMode', {});
  Object.defineProperty(Light.prototype,'innerConeAngle', {});
  Object.defineProperty(Light.prototype,'outerConeAngle', {});
  Object.defineProperty(Light.prototype,'intensity', {});
  Object.defineProperty(Light.prototype,'cookie', {});
  Object.defineProperty(Light.prototype,'cookieFalloff', {});
  Object.defineProperty(Light.prototype,'cookieChannel', {});
  Object.defineProperty(Light.prototype,'cookieTransform', {});
  Object.defineProperty(Light.prototype,'cookieOffset', {});

  return {
    Light: Light
  };
}());
