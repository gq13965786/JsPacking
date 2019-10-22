//element.getBoundingClientRect()
//event.preventDefault()
//canvas.getContext()
//gl.getSupportedExtensions()
Object.assign(ape, function () {
  'use strict';

  var GraphicsDevice = function (canvas, options) {
    var i;
    this.canvas = canvas;
    this.shader = null;
    this.indexBuffers = [];
    this.vbOffsets = [];
    this._enableAutoInstancing = false;
    this.autoInstancingMaxObjects = 16384;//limits
    this.attributesInvalidated = true;
    this.boundBuffer = null;
    this.boundElementBuffer = {};
    this.instancedAttribs = {};
    this.enabledAttributes = {};
    this.transformFeedbackBuffer = null;
    this.activeFramebuffer = null;
    this.textureUnit = 0;
    this.textureUnits = [];
    this._maxPixelRadio = 1;
    this.renderTarget = null;
    this.feedback = null;
    //this.clientRect
//local width/height without pixelRatio applied
    this._width = 0;
    this._height = 0;

    this.updateClientRect();
    //Shader code to WebGL shader cache
    this.vertexShaderCache = {};
    this.fragmentShaderCache = {};
//Array of WebGL objects that need to be re-initialized after a context resore event
    this.shaders = [];
    this.buffers = [];
    this.textures = [];
    this.targets = [];

//add handlers for when the webGl context is lost or restored
    this.contextLost = false;
    this._contextLostHandler = function (event) {
      event.preventDefault();
      this.contextLost = true;
      console.log('ape.GraphicsDevice: WebGL context lost.');

      //fire('devicelost')
    }.bind(this);

    this._contextRestoredHandler = function () {
      console.log('ape.GraphicsDevice: WebGL context restored');
      this.initializeContext();
      this.contextLost = false;

      //fire('devicerestored')
    }.bind(this);
    canvas.addEventListener("webglcontextlost", this._contextLostHandler, false);
    canvas.addEventListener("webglcontextrestored", this._contextRestoredHandler, false);
    ///////////////////////////////////////////////////////////////////
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

    this.gl = gl;

    this.initializeExtension();
    this.initializeCapabilities();
    this.initializeRenderState();
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
    this.initializeGrabPassTexture();
};


  Object.assign(GraphicsDevice.prototype, {
    initializeExtensions: function () {
        var gl = this.gl;
        var ext;

        var supportedExtensions = gl.getSupportedExtensions();
        var getExtension = function () {
            var extension = null;
            for (var i = 0; i < arguments.length; i++) {
                if (supportedExtensions.indexOf(arguments[i]) !== -1) {
                    extension = gl.getExtension(arguments[i]);
                }
            }
            return extension;
        };

        if (this.webgl2) {
            this.extBlendMinmax = true;
            this.extDrawBuffers = true;
            this.extInstancing = true;
            this.extStandardDerivatives = true;
            this.extTextureFloat = true;
            this.extTextureHalfFloat = true;
            this.extTextureHalfFloatLinear = true;
            this.extTextureLod = true;
            this.extUintElement = true;
            this.extVertexArrayObject = true;
            this.extColorBufferFloat = getExtension('EXT_color_buffer_float');
        } else {
            this.extBlendMinmax = getExtension("EXT_blend_minmax");
            this.extDrawBuffers = getExtension('EXT_draw_buffers');
            this.extInstancing = getExtension("ANGLE_instanced_arrays");
            if (this.extInstancing) {
                // Install the WebGL 2 Instancing API for WebGL 1.0
                ext = this.extInstancing;
                gl.drawArraysInstanced = ext.drawArraysInstancedANGLE.bind(ext);
                gl.drawElementsInstanced = ext.drawElementsInstancedANGLE.bind(ext);
                gl.vertexAttribDivisor = ext.vertexAttribDivisorANGLE.bind(ext);
            }

            this.extStandardDerivatives = getExtension("OES_standard_derivatives");
            this.extTextureFloat = getExtension("OES_texture_float");
            this.extTextureHalfFloat = getExtension("OES_texture_half_float");
            this.extTextureHalfFloatLinear = getExtension("OES_texture_half_float_linear");
            this.extTextureLod = getExtension('EXT_shader_texture_lod');
            this.extUintElement = getExtension("OES_element_index_uint");
            this.extVertexArrayObject = getExtension("OES_vertex_array_object");
            if (this.extVertexArrayObject) {
                // Install the WebGL 2 VAO API for WebGL 1.0
                ext = this.extVertexArrayObject;
                gl.createVertexArray = ext.createVertexArrayOES.bind(ext);
                gl.deleteVertexArray = ext.deleteVertexArrayOES.bind(ext);
                gl.isVertexArray = ext.isVertexArrayOES.bind(ext);
                gl.bindVertexArray = ext.bindVertexArrayOES.bind(ext);
            }
            this.extColorBufferFloat = null;
        }

        this.extDebugRendererInfo = getExtension('WEBGL_debug_renderer_info');
        this.extTextureFloatLinear = getExtension("OES_texture_float_linear");
        this.extTextureFilterAnisotropic = getExtension('EXT_texture_filter_anisotropic', 'WEBKIT_EXT_texture_filter_anisotropic');
        this.extCompressedTextureETC1 = getExtension('WEBGL_compressed_texture_etc1');
        this.extCompressedTextureETC = getExtension('WEBGL_compressed_texture_etc');
        this.extCompressedTexturePVRTC = getExtension('WEBGL_compressed_texture_pvrtc', 'WEBKIT_WEBGL_compressed_texture_pvrtc');
        this.extCompressedTextureS3TC = getExtension('WEBGL_compressed_texture_s3tc', 'WEBKIT_WEBGL_compressed_texture_s3tc');
        this.extParallelShaderCompile = getExtension('KHR_parallel_shader_compile');
    },
    initializeCapabilities: function () {
        var gl = this.gl;
        var ext;

        this.maxPrecision = this.precision = this.getPrecision();

        var contextAttribs = gl.getContextAttributes();
        this.supportsMsaa = contextAttribs.antialias;
        this.supportsStencil = contextAttribs.stencil;

        // Query parameter values from the WebGL context
        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.maxCubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this.maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this.maxCombinedTextures = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this.vertexUniformsCount = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this.fragmentUniformsCount = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        if (this.webgl2) {
            this.maxDrawBuffers = gl.getParameter(gl.MAX_DRAW_BUFFERS);
            this.maxColorAttachments = gl.getParameter(gl.MAX_COLOR_ATTACHMENTS);
            this.maxVolumeSize = gl.getParameter(gl.MAX_3D_TEXTURE_SIZE);
        } else {
            ext = this.extDrawBuffers;
            this.maxDrawBuffers = ext ? gl.getParameter(ext.MAX_DRAW_BUFFERS_EXT) : 1;
            this.maxColorAttachments = ext ? gl.getParameter(ext.MAX_COLOR_ATTACHMENTS_EXT) : 1;
            this.maxVolumeSize = 1;
        }

        ext = this.extDebugRendererInfo;
        this.unmaskedRenderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
        this.unmaskedVendor = ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : '';

        ext = this.extTextureFilterAnisotropic;
        this.maxAnisotropy = ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
    },
    initializeRenderState: function () {
        var gl = this.gl;

        // Initialize render state to a known start state
        this.blending = false;
        gl.disable(gl.BLEND);

        this.blendSrc = ape.BLENDMODE_ONE;
        this.blendDst = ape.BLENDMODE_ZERO;
        this.blendSrcAlpha = ape.BLENDMODE_ONE;
        this.blendDstAlpha = ape.BLENDMODE_ZERO;
        this.separateAlphaBlend = false;
        this.blendEquation = ape.BLENDEQUATION_ADD;
        this.blendAlphaEquation = ape.BLENDEQUATION_ADD;
        this.separateAlphaEquation = false;
        gl.blendFunc(gl.ONE, gl.ZERO);
        gl.blendEquation(gl.FUNC_ADD);

        this.writeRed = true;
        this.writeGreen = true;
        this.writeBlue = true;
        this.writeAlpha = true;
        gl.colorMask(true, true, true, true);

        this.cullMode = ape.CULLFACE_BACK;
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        this.depthTest = true;
        gl.enable(gl.DEPTH_TEST);

        this.depthFunc = ape.FUNC_LESSEQUAL;
        gl.depthFunc(gl.LEQUAL);

        this.depthWrite = true;
        gl.depthMask(true);

        this.stencil = false;
        gl.disable(gl.STENCIL_TEST);

        this.stencilFuncFront = this.stencilFuncBack = ape.FUNC_ALWAYS;
        this.stencilRefFront = this.stencilRefBack = 0;
        this.stencilMaskFront = this.stencilMaskBack = 0xFF;
        gl.stencilFunc(gl.ALWAYS, 0, 0xFF);

        this.stencilFailFront = this.stencilFailBack = ape.STENCILOP_KEEP;
        this.stencilZfailFront = this.stencilZfailBack = ape.STENCILOP_KEEP;
        this.stencilZpassFront = this.stencilZpassBack = ape.STENCILOP_KEEP;
        this.stencilWriteMaskFront = 0xFF;
        this.stencilWriteMaskBack = 0xFF;
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMask(0xFF);

        this.alphaToCoverage = false;
        this.raster = true;
        if (this.webgl2) {
            gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
            gl.disable(gl.RASTERIZER_DISCARD);
        }

        this.depthBiasEnabled = false;
        gl.disable(gl.POLYGON_OFFSET_FILL);

        this.clearDepth = 1;
        gl.clearDepth(1);

        this.clearRed = 0;
        this.clearBlue = 0;
        this.clearGreen = 0;
        this.clearAlpha = 0;
        gl.clearColor(0, 0, 0, 0);

        this.clearStencil = 0;
        gl.clearStencil(0);

        // Cached viewport and scissor dimensions
        this.vx = this.vy = this.vw = this.vh = 0;
        this.sx = this.sy = this.sw = this.sh = 0;

        if (this.webgl2) {
            gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT, gl.NICEST);
        } else {
            if (this.extStandardDerivatives) {
                gl.hint(this.extStandardDerivatives.FRAGMENT_SHADER_DERIVATIVE_HINT_OES, gl.NICEST);
            }
        }

        gl.enable(gl.SCISSOR_TEST);

        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);

        this.unpackFlipY = false;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        this.unpackPremultiplyAlpha = false;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    },
    initializeContext: function () {
      this.initializeExtensions();
      this.initializeCapabilities();
      this.initializeRenderState();
    },
    initializeGrabPassTexture: function () {
      if (this.grabPassTexture) return;

      var grabPassTexture = new ape.Texture(this, {
          format: ape.PIXELFORMAT_R8_G8_B8_A8,
          autoMipmap: false
      });

      grabPassTexture.minFilter = ape.FILTER_LINEAR;
      grabPassTexture.magFilter = ape.FILTER_LINEAR;
      grabPassTexture.addressU = ape.ADDRESS_CLAMP_TO_EDGE;
      grabPassTexture.addressV = ape.ADDRESS_CLAMP_TO_EDGE;

      grabPassTexture.name = 'texture_grabPass';
      grabPassTexture.setSource(this.canvas);//texture.js
//point to texture in scope
      var grabPassTextureId = this.scope.resolve(grabPassTexture.name);
      grabPassTextureId.setValue(grabPassTexture);
//////////////////////set those two//////////////////////////
      this.grabPassTextureId = grabPassTextureId;
      this.grabPassTexture = grabPassTexture;
    },
    updateClientRect: function () {
      this.clientRect = this.canvas.getBoundingClientRect();
    },
    getPrecision: function () {},
    setViewport: function (x, y, w, h) {},
    setScissor: function (x, y, w, h) {},
    getProgramLibrary: function () {},
    setProgramLibrary: function (programLib) {},
    setFramebuffer: function (fb) {},
    _checkFbo: function () {},
    copyRenderTarget: function (source, dest, color, depth) {},
    updateBegin: function () {},
    updateEnd: function () {},
    initializeTexture: function (texture) {},
    destroyTexture: function (texture) {
        if (texture._glTexture) {
            // Remove texture from device's texture cache
            var idx = this.textures.indexOf(texture);
            if (idx !== -1) {
                this.textures.splice(idx, 1);
            }

            // Remove texture from any uniforms
            for (var uniformName in this.scope.variables) {
                var uniform = this.scope.variables[uniformName];
                if (uniform.value === texture) {
                    uniform.value = null;
                }
            }

            // Update shadowed texture unit state to remove texture from any units
            for (var i = 0; i < this.textureUnits.length; i++) {
                var textureUnit = this.textureUnits[i];
                for (var j = 0; j < textureUnit.length; j++) {
                    if (textureUnit[j] === texture._glTexture) {
                        textureUnit[j] = null;
                    }
                }
            }

            // Blow away WebGL texture resource
            var gl = this.gl;
            gl.deleteTexture(texture._glTexture);
            delete texture._glTexture;
            delete texture._glTarget;
            delete texture._glFormat;
            delete texture._glInternalFormat;
            delete texture._glPixelType;

            // Update texture stats
            this._vram.tex -= texture._gpuSize;
            // #ifdef PROFILER
            if (texture.profilerHint === ape.TEXHINT_SHADOWMAP) {
                this._vram.texShadow -= texture._gpuSize;
            } else if (texture.profilerHint === ape.TEXHINT_ASSET) {
                this._vram.texAsset -= texture._gpuSize;
            } else if (texture.profilerHint === ape.TEXHINT_LIGHTMAP) {
                this._vram.texLightmap -= texture._gpuSize;
            }
            // #endif
        }
    },
    setUnpackFlipY: function (flipY) {},
    setUnpackPremultiplyAlpha: function (premuliplyAlpha) {},
    uploadTexture: function (texture) {},
    //Activatethe specified texture unit
    activeTexture: function (textureUnit) {},
    //If the texture is not already bound on the currently active texture
    //unit, bind it
    bindTexture: function (texture) {},
    //If the texture is not bound on the specified texture unit, active the
    // texture unit and bind the texture to it
    bindTextureOnUnit: function (texture, textureUnit) {},
    setTextureParameters: function (texture) {},
    setTexture: function (texture, textureUnit) {},
    setBuffers: function (numInstances) {},
    draw: function (primitive, numInstances) {},
    clear: function (options) {},
    readPixels: function (x, y, w, h, pixels) {},
    setClearDepth: function (depth) {},
    setClearColor: function (r, g, b, a) {},
    setClearStencil: function (value) {},
    setRenderTarget: function (renderTarget) {},
    getRenderTarget: function () {},
    getDepthTest: function () {},
    setDepthTest: function (depthTest) {},
    setDepthFunc: function (func) {},
    getDepthWrite: function () {},
    setDepthWrite: function (writeDepth) {},
    setColorWrite: function (writeRed, writeGreen, writeBlue, writeAlpha) {},
    setAlphaToCoverage: function (state) {},
    setTransformFeedbackBuffer: function (tf) {},
    setRaster: function (on) {},
    setDepthBias: function (on) {},
    setDepthBiasValues: function (constBias, slopBias) {},
    getBlending: function () {},
    setBlending: function (blending) {},
    setStencilTest: function (enable) {},
    setStencilFunc: function (func, ref, mask) {},
    setStencilFuncFront: function (func, ref, mask) {},
    setStencilFuncBack: function (func, ref, mask) {},
    setStencilOperation: function (fail, zfail, zpass, writeMask) {},
    setStencilOperationFront: function (fail, zfail, zpass, writeMask) {},
    setStencilOperationBack: function (fail, zfail, zpass, writeMask) {},
    setBlendFunction: function (blendSrc, blendDst) {},
    setBlendFunctionSeparate: function (blendSrc, blendDst, blendSrcAlpha, blendDstAlpha) {},
    setBlendEquation: function (blendEquation) {},
    setBlendEquationSeparate: function (blendEquation, blendAlphaEquation) {},
    setCullMode: function (cullMode) {},
    getCullMode: function () {},
    setIndexBuffer: function (indexBuffer) {},
    setVertexBuffer: function (vertexBuffer, stream, vbOffset) {},
    compileShaderSource: function (src, isVertexShader) {},
    compileAndLinkShader: function (shader) {},

    createShader: function (shader) {},
    destroyShader: function (shader) {},

    _addLineNumber: function (src) {},
    postLink: function (shader) {},
    setShader: function (shader) {},
    getHdrFormat: function () {},
    getBoneLimit: function () {},
    setBoneLimit: function (maxBones) {},
    resizeCanvas: function (width, height) {},
    setResolution: function (width, height) {},
    clearShaderCache: function () {},
    removeShaderFromCache: function () {},
    destroy: function () {}
  });

  Object.defineProperty(GraphicsDevice.prototype, 'width', {
    get: function () {
      return this.gl.drawingbufferWidth || this.canvas.width;
    }
  });

  Object.defineProperty(GraphicsDevice.prototype, 'height', {
    get: function () {
      return this.gl.drawingBufferHeight || this.canvas.height;
    }
  });

  Object.defineProperty(GraphicsDevice.prototype, 'fullscreen', {
    get: function () {
      return !!document.fullscreenElement;
    },
    set: function (fullscreen) {
      if (fullscreen) {
        var canvas = this.gl.canvas;
        canvas.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  });

  Object.defineProperty(GraphicsDevice.prototype, 'enableAutoInstancing', {});

  Object.defineProperty(GraphicsDevice.prototype, 'maxPixelRatio', {});

  Object.defineProperty(GraphicsDevice.prototype, 'textureFloatHighPrecision', {});

  return {
    GraphicsDevice: GraphicsDevice
  };
}());
