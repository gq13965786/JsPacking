Object.assign(ape.gfx, function () {
  var Program = function (vertexShader, fragmentShader) {
    this.attributes = [];
    this.uniforms = [];

    var gl = Device.gl;
    this.programId = gl.createProgram();

    gl.attachShader(this.programId, vertexShader.shaderId);
    gl.attachShader(this.programId, fragmentShader.shaderId);
    gl.linkProgram(this.programId);

    var ok = gl.getProgramParameter(this.programId, gl.LINK_STATUS);
    if (!ok) {
        var error = gl.getProgramInfoLog(this.programId);
        logERROR("Failed to link shader program. Error: " + error);
    }

  }

  return {
    Program: Program
  };
}());
