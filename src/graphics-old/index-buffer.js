Object.assign(ape, function () {
  'use strict';

  var IndexBuffer = function (graphicsDevice, format, numIndices, usage, initialData) {};

  Object.assign(IndexBuffer.prototype, {
    destroy: function () {},
    getFormat: function () {},
    getNumIndices: function () {},
    lock: function () {},
    unlock: function () {},
    setData: function (data) {}
  });

  return {
    IndexBuffer: IndexBuffer
  };
}());
