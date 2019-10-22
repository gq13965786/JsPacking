ape.gfx.TextureLock = {
  READ: 1,
  WRITE: 2
};
ape.gfx.TextureFormat = {
  RGB: 0,
  RGBA: 1,
  LUMINANCE: 2
};
ape.gfx.TextureAddress = {
  REPEAT: 0,
  CLAMP_TO_EDGE: 1,
  MIRRORED_REPEAT: 2
};
ape.gfx.TextureFilter = {
  NEAREST: 0,
  LINEAR: 1,
  NEAREST_MIPMAP_NEAREST: 2,
  NEAREST_MIPMAP_LINEAR: 3,
  LINEAR_MIPMAP_NEAREST: 4,
  LINEAR_MIPMAP_LINEAR: 5
};

Object.assign(ape.gfx, function () {
  // Private variables
  var _formatSize = [];
  _formatSize[ape.gfx.TextureFormat.RGB] = 3;
  _formatSize[ape.gfx.TextureFormat.RGBA] = 4;
  _formatSize[ape.gfx.TextureFormat.LUMINANCE] = 1;

  var _addressLookup = [];
  _addressLookup[ape.gfx.TextureAddress.REPEAT] = WebGLRenderingContext.REPEAT;
  _addressLookup[ape.gfx.TextureAddress.CLAMP_TO_EDGE] = WebGLRenderingContext.CLAMP_TO_EDGE;
  _addressLookup[ape.gfx.TextureAddress.MIRRORED_REPEAT] = WebGLRenderingContext.MIRRORED_REPEAT;

  var _filterLookup = [];
  _filterLookup[ape.gfx.TextureFilter.NEAREST] = WebGLRenderingContext.NEAREST;
  _filterLookup[ape.gfx.TextureFilter.LINEAR] = WebGLRenderingContext.LINEAR;
  _filterLookup[ape.gfx.TextureFilter.NEAREST_MIPMAP_NEAREST] = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
  _filterLookup[ape.gfx.TextureFilter.NEAREST_MIPMAP_LINEAR] = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
  _filterLookup[ape.gfx.TextureFilter.LINEAR_MIPMAP_NEAREST] = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
  _filterLookup[ape.gfx.TextureFilter.LINEAR_MIPMAP_LINEAR] = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;

  var Texture = function () {
    var gl = Device.gl;

    this._textureId = gl.createTexture();//WebGL texture API
    //these values are the defaults as specified by the WebGL spec
    this._addressu = ape.gfx.TextureAddress.REPEAT;
    this._addressv = ape.gfx.TextureAddress.REPEAT;
    this._minFilter = ape.gfx.TextureFilter.NEAREST_MIPMAP_LINEAR;
    this._magFilter = ape.gfx.TextureFilter.LINEAR;
  };

  Object.assign(Texture.prototype, {
    //bind to WebGL API
    bind: function () {
      var gl = Device.gl;
      gl.bindTexture(this._target, this._textureId);
    },
    allocate: function () {
      if (this._source !== undefined) {
        delete this._source;
      }
      this._levels = [];
      var numBytes = this._width * this._height * _formatSize[this._format];
      this._levels[0] = new ArrayBuffer(numBytes);
    },
    isPowerOfTwo: function () {
      var w = this._width;
      var h = this._height;
      return (!(w === 0) && !(w & (w - 1))) && (!(h === 0) && !(h & (h - 1)));
    },
    lock: function (options) {
      // Initialize options to some sensible defaults
      options = options || { level: 0, face: 0, mode: ape.gfx.TextureLock.WRITE };
      if (options.level === undefined) { options.level = 0; };
      if (options.face === undefined) { options.face = 0; };
      if (options.mode === undefined) { options.mode = ape.gfx.TextureLock.WRITE; };

      logASSERT(this._levels !== undefined, "ape.gfx.Texture: lock: Texture has not been allocated");
      logASSERT((options.level >= 0) || (options.level < this._levels.length), "ape.gfx.Texture: lock: Supplied mip level out of range");

      this._lockedLevel = options.level;

      if (this._levels[options.level] === undefined) {
          var numBytes = this._width * this._height * _formatSize[this._format];
          this._levels[options.level] = new ArrayBuffer(numBytes);
      }

      return this._levels[options.level];
    },
    unlock: function () {
      logASSERT(this._lockedLevel !== undefined, "Attempting to unlock a texture that is not locked");

      // Upload the new pixel data
      this.upload();
      delete this._lockedLevel;
    },
    recover: function () {
      var gl = Device.gl;
      this._textureId = gl.createTexture();
      this.setAddressMode(this._addressu, this._addressv);
      this.setFilterMode(this._minFilter, this._magFilter);
      this.upload();
    },
    setAddressMode: function (addressu, addressv) {
      if (!this.isPowerOfTwo()) {// u and v mapping together
          if (addressu !== ape.gfx.TextureAddress.CLAMP_TO_EDGE) {
              logWARNING("Invalid address mode in U set on non power of two texture. Forcing clamp to edge addressing.");
              addressu = ape.gfx.TextureAddress.CLAMP_TO_EDGE;
          }
          if (addressv !== ape.gfx.TextureAddress.CLAMP_TO_EDGE) {
              logWARNING("Invalid address mode in V set on non power of two texture. Forcing clamp to edge addressing.");
              addressv = ape.gfx.TextureAddress.CLAMP_TO_EDGE;
          }
      }
      this.bind();
      var gl = Device.gl;
      gl.texParameteri(this._target, gl.TEXTURE_WRAP_S, _addressLookup[addressu]);
      gl.texParameteri(this._target, gl.TEXTURE_WRAP_T, _addressLookup[addressv]);
      this._addressu = addressu;
      this._addressv = addressv;
    },
    setFilterMode: function (minFilter, magFilter) {
      if (!this.isPowerOfTwo()) {
          if (!((minFilter === ape.gfx.TextureFilter.NEAREST) || (minFilter === ape.gfx.TextureFilter.LINEAR)))  {
              logWARNING("Invalid filter mode set on non power of two texture. Forcing linear addressing.");
              minFilter = ape.gfx.TextureFilter.LINEAR;
          }
      }
      this.bind();
      var gl = Device.gl;
      gl.texParameteri(this._target, gl.TEXTURE_MIN_FILTER, _filterLookup[minFilter]);
      gl.texParameteri(this._target, gl.TEXTURE_MAG_FILTER, _filterLookup[magFilter]);
      this._minFilter = minFilter;
      this._magFilter = magFilter;
    },
    getFormat: function () {
      return this._format;
    },
    getHeight: function () {
      return this._height;
    },
    getWidth: function () {
      return this._width;
    }
  });

  return {
    Texture: Texture
  };
}());
Object.assign(ape.gfx, function () {
  var _formatLookup = [];
  _formatLookup[ape.gfx.TextureFormat.RGB] = WebGLRenderingContext.RGB;
  _formatLookup[ape.gfx.TextureFormat.RGBA] = WebGLRenderingContext.RGBA;
  _formatLookup[ape.gfx.TextureFormat.LUMINANCE] = WebGLRenderingContext.LUMINANCE;

  var Texture2D = function (width, height, format) {
    var gl = Device.gl;
    this._target = gl.TEXTURE_2D;

    //set the new texture to be 1x1 and white
    this._width = width || 1;
    this._height = height || 1;
    this._format = format || ape.gfx.TextureFormat.RGB;
    this.upload();//call upload
  };
  //Texture2D inherits from Texture
  Texture2D.prototype = Object.create(ape.gfx.Texture.prototype);
  Texture2D.prototype.constructor = Texture2D;

  Texture2D.prototype.load = function (url, loader, batch) {
    var options = {
			batch: batch
		};

		loader.request(new ape.gfx.resources.ImageRequest(url), function (resources) {
			this.setSource(resources[url]);
		}.bind(this))
  };
  Texture2D.prototype.setSource = function (source) {
    // Check a valid source has been passed in
    logASSERT((source instanceof HTMLCanvasElement) || (source instanceof HTMLImageElement) || (source instanceof HTMLVideoElement),
        "ape.gfx.Texture2D: setSource: supplied source is not an instance of HTMLCanvasElement, HTMLImageElement or HTMLVideoElement.");

    // If there are mip levels allocated, blow them away
    if (this._levels !== undefined) {
        delete this._levels;
    }

    this._width  = source.width;
    this._height = source.height;
    this._format = ape.gfx.TextureFormat.RGBA;
    this._source = source;

    this.upload();
  };
  Texture2D.prototype.upload = function () {
    var gl = Device.gl;
    var glFormat = _formatLookup[this._format];

    this.bind();

    if (this._source !== undefined) {
        // Upload the image, canvas or video
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, glFormat, gl.UNSIGNED_BYTE, this._source);
    } else if (this._levels !== undefined) {
        // Upload the byte array
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, new Uint8Array(this._levels[0]));
    } else {
        // Upload the byte array
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, null);
    }

    if (this.isPowerOfTwo()) {
        gl.generateMipmap(gl.TEXTURE_2D);
    }
  };

  return {
    Texture2D: Texture2D
  };
}());
Object.assign(ape.gfx, function () {
  var _formatLookup = [];
  _formatLookup[ape.gfx.TextureFormat.RGB] = WebGLRenderingContext.RGB;
  _formatLookup[ape.gfx.TextureFormat.RGBA] = WebGLRenderingContext.RGBA;
  _formatLookup[ape.gfx.TextureFormat.LUMINANCE] = WebGLRenderingContext.LUMINANCE;

  var TextureCube = function (width, height, format) {
    var gl = Device.gl;
    this._target = gl.TEXTURE_CUBE_MAP;
    this._width = width || 1;
    this._height = height || 1;
    this._format = format || ape.gfx.TextureFormat.RGB;
    this.upload();//call upload
  };
  //TExtureCube inherits from Texture
  TextureCube.prototype = Object.create(ape.gfx.Texture.prototype);
  TextureCube.prototype.constructor = TextureCube;

  TextureCube.prototype.load = function (urls, loader, requestBatch) {
    var options = {
      batch: requestBatch
    };

    var requests = urls.map(function (url) {
      return new ape.resources.ImageRequest(url);
    });

    loader.request(requests, function (resources) {
      var images = urls.map(function (url) {
        return resources[url];
      });
      this.setSource(images);
    }.bind(this), function (errors) {
      logERROR(errors);
  }, function (progress) {
  },options);
  };
  TextureCube.prototype.setSource = function (source) {
    // Check a valid source has been passed in
    logASSERT(Object.prototype.toString.apply(source) === '[object Array]', "ape.TextureCube: setSource: supplied source is not an array");
    logASSERT(source.length === 6, "ape.gfx.TextureCube: setSource: supplied source does not have 6 entries.");
    var validTypes = 0;
    var validDimensions = true;
    var width = source[0].width;
    var height = source[0].height;
    for (var i = 0; i < 6; i++) {
        if ((source[i] instanceof HTMLCanvasElement) ||
            (source[i] instanceof HTMLImageElement) ||
            (source[i] instanceof HTMLVideoElement)) {
            validTypes++;
        }
        if (source[i].width !== width) validDimensions = false;
        if (source[i].height !== height) validDimensions = false;
    }
    logASSERT(validTypes === 6, "ape.gfx.TextureCube: setSource: Not all supplied source elements are of required type (canvas, image or video).");
    logASSERT(validDimensions,  "ape.gfx.TextureCube: setSource: Not all supplied source elements share the same dimensions.");

    // If there are mip levels allocated, blow them away
    if (this._levels !== undefined) {
        delete this._levels;
    }

    this._width  = source[0].width;
    this._height = source[0].height;
    this._format = ape.gfx.TextureFormat.RGBA;
    this._source = source;

    this.upload();
  };
  TextureCube.prototype.upload = function () {
    var gl = Device.gl;
    var glFormat = _formatLookup[this._format];

    this.bind();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (this._source !== undefined) {
        // Upload the image, canvas or video
        for (var face = 0; face < 6; face++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, glFormat, glFormat, gl.UNSIGNED_BYTE, this._source[face]);
        }
    } else if (this._levels !== undefined) {
        // Upload the byte array
        for (var face = 0; face < 6; face++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, new Uint8Array(this._levels[face][0]));
        }
    } else {
        // Initialize cube faces to null
        for (var face = 0; face < 6; face++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, null);
        }
    }

    if (this.isPowerOfTwo()) {
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }
  };

  return {
    TextureCube: TextureCube
  };
}());
