Object.assign(ape.gfx, function () {
  var RenderTarget = function (framebuffer, viewport) {
    this._framebuffer = framebuffer || ape.gfx.FrameBuffer.getBackBuffer();
    this._viewport = viewport ||
    {
      x: 0,
      y: 0,
      width: this._framebuffer.getWidth(),
      height: this._framebuffer.getHeight()
    };
  };

  RenderTarget.prototype.setViewport = function (viewport) {
    this._viewport = viewport;
  };
  RenderTarget.prototype.getViewport = function () {
    return this._viewport;
  };
  RenderTarget.prototype.setFrameBuffer = function (framebuffer) {
    this._framebuffer = framebuffer;
  };
  RenderTarget.prototype.getFrameBuffer = function () {
    return this._framebuffer;
  };
  RenderTarget.prototype.bind = function () {
    var gl = ape.gfx.GraphicsDevice.getCurrent().gl;
    gl.viewport(this._viewport.x, this._viewport.y, this._viewport.width, this._viewport.height);
    gl.scissor(this._viewport.x, this._viewport.y, this._viewport.width, this._viewport.height);
    this._framebuffer.bind();
  };

  return {
    RenderTarget: RenderTarget
  };
}());
