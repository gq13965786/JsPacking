//smilar approch as simple-post-effect
Object.assign(ape, (function () {
  'use strict';

  function syncToCpu(device, targ, face) {}
  function prefilterCubemap(options) {}
  // https://seblagarde.wordpress.com/2012/06/10/amd-cubemapgen-for-physically-based-rendering/
  function areaElement(x, y) {}
  function texelCoordSolidAngle(u, v, size) {}
  function shFromCubemap(source, dontFlipX) {}

  return {
    prefilterCubemap: prefilterCubemap,
    shFromCubemap: shFromCubemap
  };
}()));
