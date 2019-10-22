ape.gfx.IndexFormat = {
    /** 8-bit unsigned per index. */
    UINT8: 0,
    /** 16-bit unsigned per index. */
    UINT16: 1
};

Object.assign(ape.gfx, function () {
  'use strict';

  var IndexBuffer = function (format, numIndices) {
    this.format = format;
    this.numIndices = numIndices;

    // Calculate the size
    var bytesPerIndex = (format === ape.gfx.IndexFormat.UINT8) ? 1 : 2;
    this.numBytes = this.numIndices * bytesPerIndex;

    var gl = Device.gl;
    this.bufferId = gl.createBuffer();

    // Allocate the storage
    this.storage = new ArrayBuffer(this.numBytes);
    this.typedStorage = (format === ape.gfx.IndexFormat.UINT8) ?
                            new Uint8Array(this.storage) :
                            new Uint16Array(this.storage);
  };

  Object.assign(IndexBuffer.prototype, {
    getFormat: function () {
      return this.format;
    },
    getNumIndices: function () {
      return this.numIndices;
    },
    lock: function () {
      return this.storage;
    },
    unlock: function () {
      //upload the index buffer data
      var gl = Device.gl;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferId);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.typedStorage, gl.STATIC_DRAW);
    }
  });

  return {
    IndexBuffer: IndexBuffer
  };
}());
