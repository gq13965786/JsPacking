Object.assign(ape, function () {
  'use strict';

  var TransformFeedback = function (inputBuffer, usage) {
    usage = usage || ape.BUFFER_GPUDYNAMIC;
    this.device = inputBuffer.device;
    var gl = this.device.gl;

    this._inputBuffer = inputBuffer;
    if (usage === ape.BUFFER_GPUDYNAMIC && inputBuffer.usage !== usage) {
      gl.bindBuffer(gl.ARRAY_BUFFER, inputBuffer.bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, inputBuffer.storage, gl.DYNAMIC_COPY);
    }
    this._outputBuffer = new pc.VertexBuffer(inputBuffer.device, inputBuffer.format, inputBuffer.numVertices, usage, inputBuffer.storage);
  };

  TransformFeedback.createShader = function (graphicsDevice, vsCode, name) {
    return pc.shaderChunks.createShaderFromCode(graphicsDevice, vsCode, null, name, true);
  };

  Object.assign(TransformFeedback.prototype, {
    destroy: function () {
      this._outputBuffer.destroy();
    },
    process: function (shader, swap) {
      if (swap === undefined) swap = true;

      var device = this.device;
      device.setRenderTarget(null);
      device.updateBegin();
      device.setVertexBuffer(this._inputBuffer, 0);
      device.setRaster(false);
      device.setTransformFeedbackBuffer(this._outputBuffer);
      device.setShader(shader);
      device.draw({
        type: ape.PRIMITIVE_POINTS,
        base: 0,
        count: this._inputBuffer.numVertices,
        indexed: false
      });
      device.setTransformFeedbackBuffer(null);
      device.setRaster(true);
      device.updateEnd()

      if(swap) {
        var tmp = this._inputBuffer.bufferId;
        this._inputBuffer.bufferId = this._outputBuffer.bufferId;
        this._outputBuffer.bufferId = tmp;
      }
    }
  });

  Object.defineProperty(TransformFeedback.prototype, 'inputBuffer', {
    get: function () {
      return this._inputBuffer;
    }
  });

  Object.defineProperty(TransformFeedback.prototype, 'outputBuffer', {
    get: function () {
      return this._outputBuffer;
    }
  });

  return {
    TransformFeedback: TransformFeedback
  };
}());
