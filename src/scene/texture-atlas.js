Object.assign(ape, function () {
  'use strict';

  var TextureAtlas = function () {};

  TextureAtlas.prototype.setFrame = function (key, data) {};
  TextureAtlas.prototype.removeFrame = function (key) {};
  TextureAtlas.prototype.destroy = function () {};

  Object.defineProperty(TextureAtlas.prototype, 'texture', {});
  Object.defineProperty(TextureAtlas.prototype, 'frames', {});

  return {
    TextureAtlas: TextureAtlas
  };
}());
