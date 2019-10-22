Object.assign(ape.gfx, function () {
  var FrameBuffer = function (width, height, depth, isCube) {
    if ((width !== undefined) && (height !== undefined)) {
        this._width = width || 1;
        this._height = height || 1;
        this._colorBuffers = [];
        if (depth) {
          this._depthBuffers = [];
        }
        this._activeBuffer = 0;

        var device = Device;
        var gl = device.gl;
        if (isCube) {
            this._texture = new ape.gfx.TextureCube(width, height, ape.gfx.TextureFormat.RGBA);
        } else {
            this._texture = new ape.gfx.Texture2D(width, height, ape.gfx.TextureFormat.RGBA);
        }

        var numBuffers = isCube ? 6 : 1;

        for (var i = 0; i < numBuffers; i++) {
          // Create a new WebGL frame buffer object
          this._colorBuffers[i] = gl.createFramebuffer();

          // Attach the specified texture to the frame buffer
          gl.bindFramebuffer(gl.FRAMEBUFFER, this._colorBuffers[i]);
          gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                  gl.COLOR_ATTACHMENT0,
                                  isCube ? gl.TEXTURE_CUBE_MAP_POSITIVE_X + i : gl.TEXTURE_2D,
                                  this._texture._textureId,
                                  0);
          if (depth) {
              this._depthBuffers[i] = gl.createRenderbuffer();
              gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffers[i]);
              gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
              gl.bindRenderbuffer(gl.RENDERBUFFER, null);
              gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthBuffers[i]);
          }

          var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
          switch (status)
          {
              case gl.FRAMEBUFFER_COMPLETE:
                  logINFO("FrameBuffer status OK");
                  break;
              case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                  logERROR("FrameBuffer error: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                  break;
              case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                  logERROR("FrameBuffer error: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                  break;
              case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                  logERROR("FrameBuffer error: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                  break;
              case gl.FRAMEBUFFER_UNSUPPORTED:
                  logERROR("FrameBuffer error: FRAMEBUFFER_UNSUPPORTED");
                  break;
          }
        }

        //set current render target back to default frame buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  };

  FrameBuffer.getBackBuffer = function () {
    return new ape.gfx.FrameBuffer();
  };

  FrameBuffer.prototype.bind = function () {
    var gl = Device.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._colorBuffers ? this._colorBuffers[this._activeBuffer] : null);
  };
  FrameBuffer.prototype.setActiveBuffer = function (index) {
    this._activeBuffer = index;
  };
  FrameBuffer.prototype.getWidth = function () {
    var gl = Device.gl;
    return (this._colorBuffers) ? this._width : gl.canvas.width;
  };
  FrameBuffer.prototype.getHeight = function () {
    var gl = Device.gl;
    return (this._colorBuffers) ? this._height : gl.canvas.height;
  };
  FrameBuffer.prototype.getTexture = function () {
    return (this._colorBuffers) ? this._texture : null;
  };

  return {
    FrameBuffer: FrameBuffer
  };
}());
