Object.assign(ape, function () {
  'use strict';

  var defaultOptions = {
    depth: true,
    face: 0
  };

  var RenderTarget = function (options) {};

  Object.assign(RenderTarget.prototype, {
    destroy: function () {},
    resolve: function (color, depth) {},
    copy: function (source, color, depth) {}
  });

  Object.defineProperty(RenderTarget.prototype, 'colorBuffer', {});
  Object.defineProperty(RenderTarget.prototype, 'depthBuffer', {});
  Object.defineProperty(RenderTarget.prototype, 'face', {});
  Object.defineProperty(RenderTarget.prototype, 'width', {});
  Object.defineProperty(RenderTarget.prototype, 'height', {});

  return {
    RenderTarget: RenderTarget
  };
}());
