//embedding two functions to
Object.assign(ape, (function () {
  'use strict';
  //draw shaded full-screen quad in a single call
  var _postEffectQuadVB = null;
  var _postEffectQuadDraw = {
    type: ape.PRIMITIVE_TRISTRIP,
    base: 0,
    count: 4,
    indexed: false
  };

  function drawQuadWithShader(device, target, shader, rect, scissorRect, useBlend) {}

  function destroyPostEffectQuad() {}

  return {
    drawQuadWithShader: drawQuadWithShader,
    destroyPostEffectQuad: destroyPostEffectQuad
  };
}()));
