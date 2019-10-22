Object.assign(ape, function () {
  //Primitive for drawFullscreenQuad
  var primitive = {
    type: ape.PRIMITIVE_TRISTRIP,
    base: 0,
    count: 4,
    indexed: false
  };

  var PostEffect = function (graphicsDevice) {
    this.device = graphicsDevice;
    this.shader = null;
    this.depthMap = null;
    this.vertexBuffer = ape.createFullscreenQuad(graphicsDevice);
    this.needsDepthBuffer = false;
  };

  Object.assign(PostEffect.prototype, {
    render: function (inputTarget, outputTarget, rect) {}
  });

  function createFullscreenQuad(device) {}
  function drawFullscreenQuad(device, target,vertexBuffer, shader, rect) {}

  return {
    PostEffect: PostEffect,
    createFullscreenQuad: createFullscreenQuad,
    drawFullscreenQuad: drawFullscreenQuad
  }
}());
