Object.assign(ape, function () {
  'use strict';

  ape.SPRITE_RENDERMODE_SIMPLE = 0;
  ape.SPRITE_RENDERMODE_SLICED = 1;
  ape.SPRITE_RENDERMODE_TILED = 2;

  var spriteNormals = [];
  var spriteIndices = [];

  var Sprite = function (device, options) {};
  Sprite.prototype._createMeshes = function () {};
  Sprite.prototype._createSimpleMesh = function (frame) {};
  Sprite.prototype._create9SliceMesh = function () {};
  Sprite.prototype._onSetFrames = function (frames) {};
  Sprite.prototype._onFrameChanged = function (frameKey, frame) {};
  Sprite.prototype._onFrameRemoved = function (frameKey) {};
  Sprite.prototype.startUpdate = function () {};
  Sprite.prototype.endUpdate = function () {};
  Sprite.prototype.destroy = function () {};

  Object.defineProperty(Sprite.prototype,'frameKeys',{});
  Object.defineProperty(Sprite.prototype,'atlas', {});
  Object.defineProperty(Sprite.prototype,'pixelsPerUnit',{});
  Object.defineProperty(Sprite.prototype,'renderMode', {});
  Object.defineProperty(Sprite.prototype,'meshes', {});

  return {
    Sprite: Sprite
  };
}());
