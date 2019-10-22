Object.assign(ape, function () {
  'use strict';

  var Shader = function (graphicsDevice, definition) {
    this.device = graphicsDevice;
    this.definition = definition;

    this.attributes = [];
    this.uniforms = [];
    this.samplers = [];

    this.ready = false;
    //Used for shader variants (see ape.Material)
    this._refCount = 0;

    this.device.createShader(this);
  }

  Object.assign(Shader.prototype, {
    destroy: function () {
      this.device.destroyShader(this);
    }
  });
  return {
    Shader: Shader
  };
}());
