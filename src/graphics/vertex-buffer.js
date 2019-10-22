ape.gfx.VertexBufferUsage = {
    /** The data store contents will be modified repeatedly and used many times. */
    DYNAMIC: 0,
    /** The data store contents will be modified once and used many times. */
    STATIC: 1
};

Object.assign(ape.gfx, function () {
  'use strict';

  var VertexBuffer = function (format, numVertices,usage) {
    usage = usage || ape.gfx.VertexBufferUsage.STATIC;
    var gl = Device.gl;

    this.usage = (usage === ape.gfx.VertexBufferUsage.DYNAMIC) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    this.format = format;
    this.numVertices = numVertices;
    this.bufferId = gl.createBuffer();

    this.numBytes = format.size * numVertices;
    this.storage = new ArrayBuffer(this.numBytes);
  };

  Object.assign(VertexBuffer.prototype, {
    getFormat: function () {
      return this.format;
    },
    getUsage: function () {
      return this.usage;
    },
    getNumVertices: function () {
      return this.numVertices;
    },
    lock: function () {
      return this.storage;
    },
    unlock: function () {
      var gl = Device.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.storage), this.usage);
    }
  });

  return {
    VertexBuffer: VertexBuffer
  };
}());
