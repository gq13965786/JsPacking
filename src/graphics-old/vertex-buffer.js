Object.assign(ape, function () {
  'use strict';

  var VertexBuffer = function (graphicsDevice, format, numVertices, usage, initialData) {
    //by default, vertex buffers are static (better for performance since buffer data can be cached in VRAM)
    this.usage = usage || ape.BUFFER_STATIC;
    this.format = format;
    this.numVertices = numVertices;

    //calculate the size
    this.numBytes = format.size * numVertices;
    graphicsDevice._vram.vb += this.numBytes;

    //Create the WebGL vertex buffer object
    this.device = graphicsDevice;

    //Allocate the storage
    if (initialData) {
      this.setData(initialData);
    } else {
      this.storage = new ArrayBuffer(this.numBytes);
    }

    this.device.buffers.push(this);
  };

  Object.assign(VertexBuffer.prototype, {
    destroy: function () {
      var device = this.device;
      var idx = device.buffers.indexOf(this);
      if (idx !== -1) {
        device.buffers.splice(idx, 1);
      }

      if (this.bufferId) {
        var gl = device.gl;
        gl.deleteBuffer(this.bufferId);
        device._vram.vb -= this.storage.byteLength;
        this.bufferId = null;

        //If this buffer was bound, must clean up attribute-buffer bindings to prevent GL errors
        device.boundBuffer = null;
        device.vertexBuffers.length = 0;
        device.vbOffsets.length = 0;
        device.attributesInvalidated = true;
        for (var loc in device.enabledAttributes) {
          gl.disableVertexAttribArray(loc);
        }
        device.enabledAttributes = {};
      }
    },
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
      //Upload the new vertex data
      var gl = this.device.gl;

      if (!this.bufferId) {
        this.bufferId = gl.createBuffer();
      }

      var glUsage;
      switch (this.usage) {
          case ape.BUFFER_STATIC:
              glUsage = gl.STATIC_DRAW;
              break;
          case ape.BUFFER_DYNAMIC:
              glUsage = gl.DYNAMIC_DRAW;
              break;
          case ape.BUFFER_STREAM:
              glUsage = gl.STREAM_DRAW;
              break;
          case ape.BUFFER_GPUDYNAMIC:
              if (this.device.webgl2) {
                  glUsage = gl.DYNAMIC_COPY;
              } else {
                  glUsage = gl.STATIC_DRAW;
              }
              break;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, this.storage, glUsage);
    },
    setData: function (data) {
      if (data.byteLength !== this.numBytes) {
        console.error("VertexBuffer: wrong initial data size: expected " + this.numBytes + ", got " + data.byteLength);
        return false;
      }
      this.storage = data;
      this.unlock();
      return true;
    }
  });

  return {
    VertexBuffer: VertexBuffer
  };
}());
