ape.gfx.PrimType = {
  /** List of distinct points. */
  POINTS: 0,
  /** Discrete list of line segments. */
  LINES: 1,
  /** List of points that are linked sequentially by line segments. */
  LINE_STRIP: 2,
  /** Discrete list of triangles. */
  TRIANGLES: 3,
  /** Connected strip of triangles where a specified vertex forms a triangle using the previous two. */
  TRIANGLE_STRIP: 4
};
ape.gfx.BlendMode = {
  ZERO: 0,
  ONE: 1,
  SRC_COLOR: 2,
  ONE_MINUS_SRC_COLOR: 3,
  DST_COLOR: 4,
  ONE_MINUS_DST_COLOR: 5,
  SRC_ALPHA: 6,
  SRC_ALPHA_SATURATE: 7,
  ONE_MINUS_SRC_ALPHA: 8,
  DST_ALPHA: 9,
  ONE_MINUS_DST_ALPHA: 10
};
ape.gfx.DepthFunc = {
  LEQUAL: 0
};
ape.gfx.FrontFace = {
  CW: 0,
  CCW: 1
};




Object.assign(ape.gfx, function () {

/**demo shader program
  *
  *const vsSource =
  *attribute vec4 aVertexPosition
  *uniform mat4 uModelViewMatrix
  *uniform mat4 uProjectionMatrix
  *
  *void main() {
  *  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  *}
  *;//Vertex shader program
  *const fsSource =
  *  void main() {
  *    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  *}
  *;//Fragment shader program
  *const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  *
  *const programInfo = {
  *  program: shaderProgram,
  *  attribLocations : {
  *    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
  *  },
  *  uniformLocations: {
  *    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
  *    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  *  },
  *}
  *
  *const buffers = initBuffers(gl);
  *drawScene(gl, programInfo, buffers);
  */

/**function initBuffers(gl) {
  *const positionBuffer = gl.createBuffer();
  *gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  *const positions = [
  * 1.0, 1.0,
  *-1.0, 1.0,
  * 1.0,-1.0,
  *-1.0,-1.0
  *];
  *
  *gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  *
  *return {
  * position: positionBuffer,
  *};
  *}
  */
/**function drawScene(gl, progrmaInfo, buffers) {
  *gl.clearColor(0.0, 0.0, 0.0, 1.0); //clear to black, fully opaque
  *gl.clearDepth(1.0);                //clear everything
  *gl.enable(gl.DEPTH_TEST);          //Enable depth testing
  *gl.depthFunc(gl.LEQUAL);           //Near things obscure far things
  * //clear the canvas before we start drawing on it.
  *
  *gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  *
  *
  *const fieldOfView = 45 * Math.PI / 180;
  *const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  *const zNear = 0.1;
  *const zFar = 100.0;
  *const projectionMatrix = mat4.create();
  *
  *mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  *
  *const modelViewMatrix = mat4.create();
  *
  *mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  *
  * //tell webGL how to pull out the positions from the position
  * //buffer into the vertexPosition attribute.
  *
  *   {
  *const numComponents = 2;
  *const type = gl.FLOAT;
  *const normalize = false;
  *const stride = 0;
  *const offset = 0;
  *gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  *gl.vertexAttribPointer(
  * programInfo.attribLocations.vertexPosition,
  * numComponents,
  * type,
  * normalize,
  * stride,
  * offset
  *);
  *
  *gl.enableVertexAttribArray(
  *programInfo.attribLocations.vertexPosition
  *);
  *
  *
  *   }
  *
  * //tell WebGL to use our program when drawing
  *gl.useProgram(programInfo.program);
  *
  * //set the shader uniforms
  *
  *gl.uniformMatrix4fv(
  * programInfo.uniformLocations.projectionMatrix,
  * false,
  * projectionMatrix
  *);
  *
  *gl.uniformMatrix4fv(
  * programInfo.uniformLocations.modelViewMatrix,
  * false,
  * modelViewMatrix
  *);
  *
  *{
  * const offset = 0;
  * const vertexCount = 4;
  * gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  *}
  *
  *
  *}
  */
/**function initShaderProgram(gl, vsSource, fsSource) {
  * const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  * const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  *
  * const shaderProgram = gl.createProgram();
  * gl.attachShader(shaderProgram, vertexShader);
  * gl.attachShader(shaderProgram, fragmentShader);
  * gl.linkProgram(shaderProgram);
  *
  * if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  * alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
  * return null;
  *}
  *return shaderProgram
  *
  *}
  */
/**function loadShader(gl, type, source) {
  * const shader = gl.createShader(type);
  * gl.shaderSource(shader, source);
  * gl.compileShader(shader);
  *
  * if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  * alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
  * gl.deleteShader(shader);
  * return null;
  *}
  *
  * return shader;
  *}
  */
  var _defaultClearOptions = {
      color: [0, 0, 0, 1],
      depth: 1,
      flags: ape.gfx.ClearFlag.COLOR | ape.gfx.ClearFlag.DEPTH
  };
  var _createContext = function (canvas, options) {
    var i;
    // Retrieve the WebGL context
    var preferWebGl2 = (options && options.preferWebGl2 !== undefined) ? options.preferWebGl2 : true;

    var names = preferWebGl2 ? ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl"] :
        ["webgl", "experimental-webgl"];
    var gl = null;
    options = options || {};
    options.stencil = true;

    for (i = 0; i < names.length; i++) {
        try {
            gl = canvas.getContext(names[i], options);
        } catch (e) { }

        if (gl) {
            this.webgl2 = preferWebGl2 && i < 2;
            break;
        }
    }

    if (!gl) {
        throw new Error("WebGL not supported");
    }

    return gl;
  }
  var _contextLostHandler = function () {
    logWARNING("Context lost.");
  };
  var _contextRestoredHandler = function () {
    logINFO("Context restored.");
  };

  var GraphicsDevice = function (canvas, options){
    canvas.addEventListener("webglcontextlost", _contextLostHandler, false);
    canvas.addEventListener("webglcontextrestored", _contextRestoredHandler, false);

    this.gl = _createContext(canvas, options);
    this.canvas = canvas;
    this.program = null;
    this.indexBuffer = null;
    this.vertexBuffer = [];

    var gl = this.gl;
    logINFO("Device started");
    logINFO("WebGL version:             " + gl.getParameter(gl.VERSION));
    logINFO("WebGL shader version:      " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    logINFO("WebGL vendor:              " + gl.getParameter(gl.VENDOR));
    logINFO("WebGL renderer:            " + gl.getParameter(gl.RENDERER));
    // Note that gl.getSupportedExtensions is not actually available in Chrome 9.
    try {
        logINFO("WebGL extensions:          " + gl.getSupportedExtensions());
    }
    catch (e) {
        logINFO("WebGL extensions:          Extensions unavailable");
    }
    logINFO("WebGL num texture units:   " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
    logINFO("WebGL max texture size:    " + gl.getParameter(gl.MAX_TEXTURE_SIZE));
    logINFO("WebGL max cubemap size:    " + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
    logINFO("WebGL max vertex attribs:  " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
    logINFO("WebGL max vshader vectors: " + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
    logINFO("WebGL max fshader vectors: " + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
    logINFO("WebGL max varying vectors: " + gl.getParameter(gl.MAX_VARYING_VECTORS));

    this.lookup = {
          prim: [
              gl.POINTS,
              gl.LINES,
              gl.LINE_STRIP,
              gl.TRIANGLES,
              gl.TRIANGLE_STRIP
          ],
          blendMode: [
              gl.ZERO,
              gl.ONE,
              gl.SRC_COLOR,
              gl.ONE_MINUS_SRC_COLOR,
              gl.DST_COLOR,
              gl.ONE_MINUS_DST_COLOR,
              gl.SRC_ALPHA,
              gl.SRC_ALPHA_SATURATE,
              gl.ONE_MINUS_SRC_ALPHA,
              gl.DST_ALPHA,
              gl.ONE_MINUS_DST_ALPHA
          ],
          clear: [
              0,
              gl.COLOR_BUFFER_BIT,
              gl.DEPTH_BUFFER_BIT,
              gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT,
              gl.STENCIL_BUFFER_BIT,
              gl.STENCIL_BUFFER_BIT|gl.COLOR_BUFFER_BIT,
              gl.STENCIL_BUFFER_BIT|gl.DEPTH_BUFFER_BIT,
              gl.STENCIL_BUFFER_BIT|gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT
          ],
          elementType: [
              gl.BYTE,
              gl.UNSIGNED_BYTE,
              gl.SHORT,
              gl.UNSIGNED_SHORT,
              gl.INT,
              gl.UNSIGNED_INT,
              gl.FLOAT
          ],
          frontFace: [
              gl.CW,
              gl.CCW
          ]
      };
//initialize Extensions
    this.extTextureFloat = null;
    this.extStandardDerivatives = gl.getExtension("OES_standard_derivatives");

//create the default render target
    var backBuffer = ape.gfx.FrameBuffer.getBackBuffer();//new FrameBuffer
    var viewport = {x: 0, y: 0, width: canvas.width, height: canvas.height};
    this.renderTarget = new ape.gfx.RenderTarget(backBuffer, viewport);
//Create the scopeNamespace for shader attributes and variables
    this.scope = new ape.gfx.ScopeSpace("Device");

//Define the uniform commit functions
    var self = this;

    this.commitFunction = {};
    this.commitFunction[ape.gfx.ShaderInputType.BOOL ] = function (locationId, value) { self.gl.uniform1i(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.INT  ] = function (locationId, value) { self.gl.uniform1i(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.FLOAT] = function (locationId, value) {
        if (typeof value == "number")
            self.gl.uniform1f(locationId, value);
        else
            self.gl.uniform1fv(locationId, value);
        };
    this.commitFunction[ape.gfx.ShaderInputType.VEC2 ] = function (locationId, value) { self.gl.uniform2fv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.VEC3 ] = function (locationId, value) { self.gl.uniform3fv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.VEC4 ] = function (locationId, value) { self.gl.uniform4fv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.IVEC2] = function (locationId, value) { self.gl.uniform2iv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.BVEC2] = function (locationId, value) { self.gl.uniform2iv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.IVEC3] = function (locationId, value) { self.gl.uniform3iv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.BVEC3] = function (locationId, value) { self.gl.uniform3iv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.IVEC4] = function (locationId, value) { self.gl.uniform4iv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.BVEC4] = function (locationId, value) { self.gl.uniform4iv(locationId, value); };
    this.commitFunction[ape.gfx.ShaderInputType.MAT2 ] = function (locationId, value) { self.gl.uniformMatrix2fv(locationId, self.gl.FALSE, value); };
    this.commitFunction[ape.gfx.ShaderInputType.MAT3 ] = function (locationId, value) { self.gl.uniformMatrix3fv(locationId, self.gl.FALSE, value); };
    this.commitFunction[ape.gfx.ShaderInputType.MAT4 ] = function (locationId, value) { self.gl.uniformMatrix4fv(locationId, self.gl.FALSE, value); };

    // Set the default render state
    var gl = this.gl; //again
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.depthFunc(gl.LEQUAL);
    gl.depthRange(0.0, 1.0);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.enable(gl.SCISSOR_TEST);

    this.scope.resolve("fog_color").setValue([0.0, 0.0, 0.0, 1.0]);
    this.scope.resolve("fog_density").setValue(0.0);
    this.scope.resolve("alpha_ref").setValue(0.0);

    //set up render state
    var _getStartupState = function () {
      return {
        alphaTest: false,
        alphaRef: 0.0,
        blend: true,
        blendModes: {},
        colorWrite: {},
        cull: true,
        depthTest: true,
        depthWrite: true,
        depthFunc: ape.gfx.DepthFunc.LEQUAL,
        fog: false,
        fogColor: [0, 0, 0],
        fogDensity: 0,
        frontFace: ape.gfx.FrontFace.CCW
      };
    };
    this._globalState = _getStartupState();
    this._currentState = _getStartupState();
    this._localState = {};

    this._stateFuncs = {};
    this._stateFuncs["blend"] = function (value) {
      if (self._currentState.blend !== value) {
        if (value) {
          self.gl.enable(gl.BLEND);
        } else {
          self.gl.disable(gl.BLEND);
        }

        self._currentState.blend = value;
      }
    };
    this._stateFuncs["blendModes"] = function (value) {
      if ((self._currentState.blendModes.srcBlend !== value.srcBlend) ||
          (self._currentState.blendModes.dstBlend !== value.dstBlend)) {
            self.gl.blendFunc(self.lookup.blendMode[value.srcBlend], self.lookup.blendMode[value.dstBlend]);
            self._currentState.blendModes.srcBlend = value.srcBlend;
            self._currentState.blendModes.dstBlend = value.dstBlend;
          }
    };
    this._stateFuncs["colorWrite"] = function (value) {
      self.gl.colorMask(value.red, value.green, value.blue, value.alpha);
      self._currentState.culling = value;
    };
    this._stateFuncs["cull"] = function (value) {
      if (self._currentState.cull !== value) {
        if (value) {
          self.gl.enable(gl.CULL_FACE);
        } else {
          self.gl.disable(gl.CULL_FACE);
        }
        self._currentState.cull = value;
      }
    };
    this._stateFuncs["depthTest"] = function (value) {
      if (self._currentState.depthTest !== value) {
        if (value) {
          self.gl.enable(gl.DEPTH_TEST);
        } else {
          self.gl.disable(gl.DEPTH_TEST);
        }
        self._currentState.depthTest = value;
      }
    };
    this._stateFuncs["depthWrite"] = function (value) {
      if (self._currentState.depthWrite !== value) {
        self.gl.depthMask(value);
        self._currentState.depthWrite = value;
      }
    };
    this._stateFuncs["fog"] = function (value) {
        self._currentState.fog = value;
    };
    this._stateFuncs["fogColor"] = function (value) {
        self.scope.resolve("fog_color").setValue(value);
        self._currentState.fogColor = value;
    };
    this._stateFuncs["fogDensity"] = function (value) {
        if (self._currentState.fogDensity !== value) {
          self.scope.resolve("fog_density").setValue(value);
          self._currentState.fogDensity = value;
        }
    };
    this._stateFuncs["frontFace"] = function (value) {
        if (self._currentState.frontFace !== value) {
          self.gl.frontFace(self.lookup.frontFace[value]);
          self._currentState.frontFace = value;
        }
    };


    this.programLib = null;
    // Calculate a estimate of the maximum number of bones that can be uploaded to the GPU
    // based on the number of available uniforms and the number of uniforms required for non-
    // bone data.  This is based off of the Phong shader.  A user defined shader may have
    // even less space available for bones so this calculated value can be overridden via
    // ape.Device.setBoneLimit.
    var numUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    numUniforms -= 4 * 4; // Model, view, projection and shadow matrices
    numUniforms -= 8;     // 8 lights max, each specifying a position vector
    numUniforms -= 1;     // Eye position
    numUniforms -= 4 * 4; // Up to 4 texture transforms
    this.boneLimit = Math.floor(numUniforms / 4);

    ape.extend(this, ape.events);//attach

    this.boundBuffer = null;
    this._current = null;
  };


    GraphicsDevice.prototype.setCurrent = function () {
      Device = this;
      //console.log(this._current);
    };
    GraphicsDevice.prototype.getCurrent = function () {
      //console.log(this._current);
      return Device;
    };
    GraphicsDevice.prototype.getProgramLibrary = function () {
      return this.programLib;
    };
    GraphicsDevice.prototype.setProgramLibrary = function (programLib) {
      this.programLib = programLib;
    };

    GraphicsDevice.prototype.updateBegin = function() {
      logASSERT(this.canvas != null, "Device has not been started");
      this.renderTarget.bind();
    };
    GraphicsDevice.prototype.updateEnd = function () {};

    GraphicsDevice.prototype.draw = function () {
      // Check there is anything to draw
      if (options.numVertices > 0) {
          // Commit the vertex buffer inputs
          this.commitAttributes(options.startVertex || 0);

          // Commit the shader program variables
          this.commitUniforms();

          var gl = this.gl;
          if (options.useIndexBuffer) {
              var glFormat = (this.indexBuffer.getFormat() === ape.gfx.IndexFormat.UINT8) ? gl.UNSIGNED_BYTE : gl.UNSIGNED_SHORT;
              gl.drawElements(this.lookup.prim[options.primitiveType],
                              options.numVertices,
                              glFormat,
                              0);
          } else {
              gl.drawArrays(this.lookup.prim[options.primitiveType],
                            0,
                            options.numVertices);
          }
      }
    };
    GraphicsDevice.prototype.clear = function (options) {
      logASSERT(this.canvas != null, "Device has not been started");

      options = options || _defaultClearOptions;
      options.color = options.color || _defaultClearOptions.color;
      options.depth = options.depth || _defaultClearOptions.depth;
      options.flags = options.flags || _defaultClearOptions.flags;

      // Set the clear color
      var gl = this.gl;
      if (options.flags & ape.gfx.ClearFlag.COLOR) {
          gl.clearColor(options.color[0], options.color[1], options.color[2], options.color[3]);
      }

      if (options.flags & ape.gfx.ClearFlag.DEPTH) {
          // Set the clear depth
          gl.clearDepth(options.depth);
      }

      // Clear the frame buffer
      gl.clear(this.lookup.clear[options.flags]);
    };

    GraphicsDevice.prototype.getGlobalState = function (state) {
      return this._globalState;
    };
    GraphicsDevice.prototype.updateGlobalState = function (delta) {
      for (var key in delta) {
        if (this._localState[key] === undefined) {
            this._stateFuncs[key](delta[key]);
        }
        this._globalState[key] = delta[key];
      }
    };
    GraphicsDevice.prototype.getLocalState = function (state) {
      return this._localState;
    };
    GraphicsDevice.prototype.updateLocalState = function (localState) {
      for (var key in localState) {
        this._stateFuncs[key](localState[key]);
        this._localState[key] = localState[key];
      }
    };
    GraphicsDevice.prototype.clearLocalState = function () {
      for (var key in this._localState) {
        //Reset to global state
        this._stateFuncs[key](this._globalState[key]);
      }
      this._localState = {};
    };
    GraphicsDevice.prototype.getCurrentState = function () {
      return this._currentState;
    };

    GraphicsDevice.prototype.setRenderTarget = function () {
      this.renderTarget = renderTarget;
    };
    GraphicsDevice.prototype.getRenderTarget = function () {
      return this.renderTarget;
    };

    GraphicsDevice.prototype.setIndexBuffer = function () {
      // Store the index buffer
      this.indexBuffer = indexBuffer

      // Set the active index buffer object
      var gl = this.gl;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer ? indexBuffer.bufferId : null);
    };
    GraphicsDevice.prototype.setVertexBuffer = function () {
      // Store the vertex buffer for this stream index
      this.vertexBuffers[stream] = vertexBuffer;

      // Push each vertex element in scope
      var vertexFormat = vertexBuffer.getFormat();
      var i = 0;
      var elements = vertexFormat.elements;
      var numElements = vertexFormat.numElements;
      while (i < numElements) {
          var vertexElement = elements[i++];
          vertexElement.stream = stream;
          vertexElement.scopeId.setValue(vertexElement);
      }
    };

    GraphicsDevice.prototype.setProgram = function (program) {
      if (program !== this.program) {
        //Store program
        this.program = program;

        //set the active shader program
        var gl = this.gl;
        gl.useProgram(program.program.Id);
      }
    };

    GraphicsDevice.prototype.commitAttributes = function (startVertex) {
      var i, len, attribute, element, vertexBuffer;
      var attributes = this.program.attributes;
      var gl = this.gl;

      for (i = 0, len = attributes.length; i < len; i++) {
          attribute = attributes[i];

          // Retrieve vertex element for this shader attribute
          element = attribute.scopeId.value;

          // Check the vertex element is valid
          if (element !== null) {
              // Retrieve the vertex buffer that contains this element
              vertexBuffer = this.vertexBuffers[element.stream];

              // Set the active vertex buffer object
              if (this.boundBuffer !== vertexBuffer.bufferId) {
                  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.bufferId);
                  this.boundBuffer = vertexBuffer.bufferId;
              }

              // Hook the vertex buffer to the shader program
              gl.enableVertexAttribArray(attribute.locationId);
              gl.vertexAttribPointer(attribute.locationId,
                                     element.numComponents,
                                     this.lookup.elementType[element.dataType],
                                     gl.FALSE,
                                     element.stride,
                                     startVertex * element.stride + element.offset);
          }
      }
    };
    GraphicsDevice.prototype.commitUniforms = function () {
      var textureUnit = 0;
      var i, len, uniform;
      var uniforms = this.program.uniforms;
      var gl = this.gl;

      for (i = 0, len = uniforms.length; i < len; i++) {
          uniform = uniforms[i];

          // Check the value is valid
          if (uniform.scopeId.value != null) {

              // Handle textures differently, as its probably safer
              // to always set them rather than try to track which
              // one is currently set!
              if ((uniform.dataType === ape.ShaderInputType.TEXTURE2D) ||
                  (uniform.dataType === ape.ShaderInputType.TEXTURECUBE)) {
                  var texture = uniform.scopeId.value;

                  gl.activeTexture(gl.TEXTURE0 + textureUnit);
                  texture.bind();
                  gl.uniform1i(uniform.locationId, textureUnit);

                  textureUnit++;
              } else {
                  // Check if the value is out of date
                  if (uniform.version.notequals(uniform.scopeId.versionObject.version)) {

                      // Copy the version to track that its now up to date
                      uniform.version.copy(uniform.scopeId.versionObject.version);

                      // Retrieve value for this shader uniform
                      var value = uniform.scopeId.value;

                      // Call the function to commit the uniform value
                      this.commitFunction[uniform.dataType](uniform.locationId, value);
                  }
              }
          }
      }
    };

    GraphicsDevice.prototype.getBoneLimit = function () {
      return this.boneLimit;
    };
    GraphicsDevice.prototype.setBoneLimit = function (maxBones) {
      this.boneLiit = maxBones;
    };

    GraphicsDevice.prototype.enableValidation = function (enable) {
      if (enable === true) {
          if (this.gl instanceof WebGLRenderingContext) {

              // Create a new WebGLValidator object to
              // usurp the real WebGL context
              this.gl = new WebGLValidator(this.gl);
          }
      } else {
          if (this.gl instanceof WebGLValidator) {

              // Unwrap the real WebGL context
              this.gl = Context.gl;
          }
      }
    };
    GraphicsDevice.prototype.validate = function () {
      var gl = this.gl;
      var error = gl.getError();

      if (error !== gl.NO_ERROR) {
          Log.error("WebGL error: " + WebGLValidator.ErrorString[error]);
          return false;
      }

      return true;
    };


  return {
    GraphicsDevice: GraphicsDevice
  };
}());
