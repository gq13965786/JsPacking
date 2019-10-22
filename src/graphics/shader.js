ape.gfx.ShaderType = {
  VERTEX: 0,
  FRAGMENT: 1
};

Object.assign(ape.gfx, function () {
  'use strict';

  var Shader = function (type, src) {
      this.type = type;
      this.src = src;

      var gl = Device.gl;
      var glType = (this.type === ape.gfx.ShaderType.VERTEX) ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
      this.shaderId = gl.createShader(glType);

      //compile the shader
      gl.shaderSource(this.shaderId, this.src);
      gl.compileShader(this.shaderId);

      var ok = gl.getShaderParameter(this.shaderId, gl.COMPILE_STATUS);
      if (!ok) {
          var error = gl.getShaderInfoLog(this.shaderId);
          var typeName = (this.type === pc.gfx.ShaderType.VERTEX) ? "vertex" : "fragment";
          logERROR("Failed to compile " + typeName + " shader:\n" + src + "\n" + error);
      }
  }

  Shader.prototype.getType = function () {
    return this.type;
  };
  Shader.prototype.getSource = function () {
    return this.src;
  };
  return {
    Shader: Shader
  }
}());
