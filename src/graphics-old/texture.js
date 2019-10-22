Object.assign(ape, function () {
  'use strict';

  var Texture = function (graphicsDevice, options) {
    this.device = graphicsDevice;

    this.name = null;
    this._width = 4;
    this._height = 4;
    this._depth = 1;
    this._pot = true;

    this._format = ape.PIXELFORMAT_R8_G8_B8_A8;//grabPassTexture in graphics.js
    this.rgbm = false;

    this._cubemap = false;
    this._volume = false;
    this.fixCubemapSeams = false;
    this._flipY = true;
    this._premultiplyAlpha = false;

    this._mipmaps = true;

    this._minFilter = ape.FILTER_LINEAR_MIPMAP_LINEAR;//grabPassTexture in graphics.js
    this._magFilter = ape.FILTER_LINEAR;//grabPassTexture in graphics.js
    this._anisotropy = 1;
    this._addressU = ape.ADDRESS_REPEAT;
    this._addressV = ape.ADDRESS_REPEAT;
    this._addressW = ape.ADDRESS_REPEAT;

    this._compareOnRead = false;
    this._compareFunc = ape.FUNC_LESS;

    this.profilerHint = 0;

    if (options !== undefined) {
        this._width = (options.width !== undefined) ? options.width : this._width;
        this._height = (options.height !== undefined) ? options.height : this._height;
        this._pot = ape.math.powerOfTwo(this._width) && ape.math.powerOfTwo(this._height);

        this._format = (options.format !== undefined) ? options.format : this._format;
        this.rgbm = (options.rgbm !== undefined) ? options.rgbm : this.rgbm;

        if (options.mipmaps !== undefined) {
            this._mipmaps = options.mipmaps;
        } else {
            this._mipmaps = (options.autoMipmap !== undefined) ? options.autoMipmap : this._mipmaps;
        }

        this._levels = options.levels;

        this._cubemap = (options.cubemap !== undefined) ? options.cubemap : this._cubemap;
        this.fixCubemapSeams = (options.fixCubemapSeams !== undefined) ? options.fixCubemapSeams : this.fixCubemapSeams;

        this._minFilter = (options.minFilter !== undefined) ? options.minFilter : this._minFilter;
        this._magFilter = (options.magFilter !== undefined) ? options.magFilter : this._magFilter;
        this._anisotropy = (options.anisotropy !== undefined) ? options.anisotropy : this._anisotropy;
        this._addressU = (options.addressU !== undefined) ? options.addressU : this._addressU;
        this._addressV = (options.addressV !== undefined) ? options.addressV : this._addressV;

        this._compareOnRead = (options.compareOnRead !== undefined) ? options.compareOnRead : this._compareOnRead;
        this._compareFunc = (options._compareFunc !== undefined) ? options._compareFunc : this._compareFunc;

        this._flipY = (options.flipY !== undefined) ? options.flipY : this._flipY;
        this._premultiplyAlpha = (options.premultiplyAlpha !== undefined) ? options.premultiplyAlpha : this._premultiplyAlpha;

        if (graphicsDevice.webgl2) {
            this._depth = (options.depth !== undefined) ? options.depth : this._depth;
            this._volume = (options.volume !== undefined) ? options.volume : this._volume;
            this._addressW = (options.addressW !== undefined) ? options.addressW : this._addressW;
        }

        // #ifdef PROFILER
        this.profilerHint = (options.profilerHint !== undefined) ? options.profilerHint : this.profilerHint;
        // #endif
    }

    this._compressed = (this._format === ape.PIXELFORMAT_DXT1 ||
                        this._format === ape.PIXELFORMAT_DXT3 ||
                        this._format === ape.PIXELFORMAT_DXT5 ||
                        this._format >= ape.PIXELFORMAT_ETC1);

    // Mip levels
    this._invalid = false;
    this._lockedLevel = -1;
    if (!this._levels) {
        this._levels = this._cubemap ? [[null, null, null, null, null, null]] : [null];
    }

    this.dirtyAll();

    this._gpuSize = 0;
  };

  Object.defineProperty(Texture.prototype, 'minFilter', {
    get: function () {
      return this._minFilter;
    },
    set: function (v) {
      if (this._minFilter !== v) {
        this._minFilter = v;
        this._parameterFlags |= 1;
      }
    }
  });
  Object.defineProperty(Texture.prototype, 'magFilter', {
    get: function () {
      return this._magFilter;
    },
    set: function (v) {
      if (this._magFilter !== v) {
        this._magFilter = v;
        this._parameterFlags |= 2;
      }
    }
  });
  Object.defineProperty(Texture.prototype, 'addressU', {
    get: function () {
        return this._addressU;
    },
    set: function (v) {
        if (this._addressU !== v) {
            this._addressU = v;
            this._parameterFlags |= 4;
        }
    }
});
  });
  Object.defineProperty(Texture.prototype, 'addressV', {
    get: function () {
        return this._addressV;
    },
    set: function (v) {
        if (this._addressV !== v) {
            this._addressV = v;
            this._parameterFlags |= 8;
        }
    }
  });
  Object.defineProperty(Texture.prototype, 'addressW', {
    get: function () {
        return this._addressW;
    },
    set: function (addressW) {
        if (!this.device.webgl2) return;
        if (!this._volume) {
            // #ifdef DEBUG
            console.warn("ape.Texture#addressW: Can't set W addressing mode for a non-3D texture.");
            // #endif
            return;
        }
        if (addressW !== this._addressW) {
            this._addressW = addressW;
            this._parameterFlags |= 16;
        }
    }
  });
  Object.defineProperty(Texture.prototype, 'compareOnRead', {
    get: function () {
        return this._compareOnRead;
    },
    set: function (v) {
        if (this._compareOnRead !== v) {
            this._compareOnRead = v;
            this._parameterFlags |= 32;
        }
    }
  });
  Object.defineProperty(Texture.prototype, 'compareFunc', {
    get: function () {
        return this._compareFunc;
    },
    set: function (v) {
        if (this._compareFunc !== v) {
            this._compareFunc = v;
            this._parameterFlags |= 64;
        }
    }
  });
  Object.defineProperty(Texture.prototype, 'anisotropy', {
    get: function () {
        return this._anisotropy;
    },
    set: function (v) {
        if (this._anisotropy !== v) {
            this._anisotropy = v;
            this._parameterFlags |= 128;
        }
    }
  });
  Object.defineProperty(Texture.prototype, 'autoMipmap', {
    get: function () {
        return this._mipmaps;
    },
    set: function (v) {
        this._mipmaps = v;
    }
  });
  Object.defineProperty(Texture.prototype, 'mipmaps', {
    get: function () {
        return this._mipmaps;
    },
    set: function (v) {
        if (this._mipmaps !== v) {
            this._mipmaps = v;
            this._minFilterDirty = true;

            if (v) this._needsMipmapsUpload = true;
        }
    }
  });
  Object.defineProperty(Texture.prototype, 'width', {
    get: function () {
      return this._width;//4
    }
  });
  Object.defineProperty(Texture.prototype, 'height', {
    get: function () {
      return this._height;//4
    }
  });
  Object.defineProperty(Texture.prototype, 'depth', {
    get: function () {
      return this._depth;//1
    }
  });
  Object.defineProperty(Texture.prototype, 'format', {
    //ape.PIXELFORMAT_R8_G8_B8_A8
    get: function () {
        return this._format;
    }
  });
  Object.defineProperty(Texture.prototype, 'cubemap', {
    get: function () {
        return this._cubemap;
    }
  });
  var _pixelFormat2Size = null;
  Object.defineProperty(Texture.prototype, 'gpuSize', {
      get: function () {
          if (!_pixelFormat2Size) {
              _pixelFormat2Size = [];
              _pixelFormat2Size[ape.PIXELFORMAT_A8] = 1;
              _pixelFormat2Size[ape.PIXELFORMAT_L8] = 1;
              _pixelFormat2Size[ape.PIXELFORMAT_L8_A8] = 1;
              _pixelFormat2Size[ape.PIXELFORMAT_R5_G6_B5] = 2;
              _pixelFormat2Size[ape.PIXELFORMAT_R5_G5_B5_A1] = 2;
              _pixelFormat2Size[ape.PIXELFORMAT_R4_G4_B4_A4] = 2;
              _pixelFormat2Size[ape.PIXELFORMAT_R8_G8_B8] = 4;
              _pixelFormat2Size[ape.PIXELFORMAT_R8_G8_B8_A8] = 4;
              _pixelFormat2Size[ape.PIXELFORMAT_RGB16F] = 8;
              _pixelFormat2Size[ape.PIXELFORMAT_RGBA16F] = 8;
              _pixelFormat2Size[ape.PIXELFORMAT_RGB32F] = 16;
              _pixelFormat2Size[ape.PIXELFORMAT_RGBA32F] = 16;
              _pixelFormat2Size[ape.PIXELFORMAT_R32F] = 4;
              _pixelFormat2Size[ape.PIXELFORMAT_DEPTH] = 4; // can be smaller using WebGL1 extension?
              _pixelFormat2Size[ape.PIXELFORMAT_DEPTHSTENCIL] = 4;
              _pixelFormat2Size[ape.PIXELFORMAT_111110F] = 4;
              _pixelFormat2Size[ape.PIXELFORMAT_SRGB] = 4;
              _pixelFormat2Size[ape.PIXELFORMAT_SRGBA] = 4;
          }

          var mips = 1;
          if (this._pot && (this._mipmaps || this._minFilter === ape.FILTER_NEAREST_MIPMAP_NEAREST ||
              this._minFilter === ape.FILTER_NEAREST_MIPMAP_LINEAR || this._minFilter === ape.FILTER_LINEAR_MIPMAP_NEAREST ||
              this._minFilter === ape.FILTER_LINEAR_MIPMAP_LINEAR) && !(this._compressed && this._levels.length === 1)) {

              mips = Math.round(Math.log2(Math.max(this._width, this._height)) + 1);
          }
          var mipWidth = this._width;
          var mipHeight = this._height;
          var mipDepth = this._depth;
          var size = 0;

          for (var i = 0; i < mips; i++) {
              if (!this._compressed) {
                  size += mipWidth * mipHeight * mipDepth * _pixelFormat2Size[this._format];
              } else if (this._format === ape.PIXELFORMAT_ETC1) {
                  size += Math.floor((mipWidth + 3) / 4) * Math.floor((mipHeight + 3) / 4) * 8 * mipDepth;
              } else if (this._format === ape.PIXELFORMAT_PVRTC_2BPP_RGB_1 || this._format === ape.PIXELFORMAT_PVRTC_2BPP_RGBA_1) {
                  size += Math.max(mipWidth, 16) * Math.max(mipHeight, 8) / 4 * mipDepth;
              } else if (this._format === ape.PIXELFORMAT_PVRTC_4BPP_RGB_1 || this._format === ape.PIXELFORMAT_PVRTC_4BPP_RGBA_1) {
                  size += Math.max(mipWidth, 8) * Math.max(mipHeight, 8) / 2 * mipDepth;
              } else {
                  var DXT_BLOCK_WIDTH = 4;
                  var DXT_BLOCK_HEIGHT = 4;
                  var blockSize = this._format === ape.PIXELFORMAT_DXT1 ? 8 : 16;
                  var numBlocksAcross = Math.floor((mipWidth + DXT_BLOCK_WIDTH - 1) / DXT_BLOCK_WIDTH);
                  var numBlocksDown = Math.floor((mipHeight + DXT_BLOCK_HEIGHT - 1) / DXT_BLOCK_HEIGHT);
                  var numBlocks = numBlocksAcross * numBlocksDown;
                  size += numBlocks * blockSize * mipDepth;
              }
              mipWidth = Math.max(mipWidth * 0.5, 1);
              mipHeight = Math.max(mipHeight * 0.5, 1);
              mipDepth = Math.max(mipDepth * 0.5, 1);
          }

          if (this._cubemap) size *= 6;
          return size;
      }
  });
  Object.defineProperty(Texture.prototype, 'volume', {
    get: function () {
      return this._volume;
    }
  });
  Object.defineProperty(Texture.prototype, 'flipY', {
    get: function () {
        return this._flipY;
    },
    set: function (flipY) {
        if (this._flipY !== flipY) {
            this._flipY = flipY;
            this._needsUpload = true;
        }
    }
  });
  Object.defineProperty(Texture.prototype, 'premultiplyAlpha', {
    get: function () {
        return this._premultiplyAlpha;
    },
    set: function (premultiplyAlpha) {
        if (this._premultiplyAlpha !== premultiplyAlpha) {
            this._premultiplyAlpha = premultiplyAlpha;
            this._needsUpload = true;
        }
    }
  });

  //public methods
  Object.assign(Texture.prototype, {
    destroy: function () {
      if (this.device) {
        this.device.destroyTexture(this);
      }
      this.device = null;
      this._levels = null;
    },
// Force a full resubmission of the texture to WebGL (used on a context restore event)
    dirtyAll: function () {
      this._levelsUpdated = this._cubemap ? [[true, true, true, true, true, true]] : [true];

      this._needsUpload = true;
      this._needsMipmapsUpload = this._mipmaps;
      this._mipmapsUploaded = false;

      this._parameterFlags = 255; // 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128
    },
    lock: function (options) {
        // Initialize options to some sensible defaults
        options = options || { level: 0, face: 0, mode: pc.TEXTURELOCK_WRITE };
        if (options.level === undefined) {
            options.level = 0;
        }
        if (options.face === undefined) {
            options.face = 0;
        }
        if (options.mode === undefined) {
            options.mode = pc.TEXTURELOCK_WRITE;
        }

        this._lockedLevel = options.level;

        if (this._levels[options.level] === null) {
            switch (this._format) {
                case pc.PIXELFORMAT_A8:
                case pc.PIXELFORMAT_L8:
                    this._levels[options.level] = new Uint8Array(this._width * this._height * this._depth);
                    break;
                case pc.PIXELFORMAT_L8_A8:
                    this._levels[options.level] = new Uint8Array(this._width * this._height *  this._depth * 2);
                    break;
                case pc.PIXELFORMAT_R5_G6_B5:
                case pc.PIXELFORMAT_R5_G5_B5_A1:
                case pc.PIXELFORMAT_R4_G4_B4_A4:
                    this._levels[options.level] = new Uint16Array(this._width * this._height * this._depth);
                    break;
                case pc.PIXELFORMAT_R8_G8_B8:
                    this._levels[options.level] = new Uint8Array(this._width * this._height * this._depth * 3);
                    break;
                case pc.PIXELFORMAT_R8_G8_B8_A8:
                    this._levels[options.level] = new Uint8Array(this._width * this._height * this._depth * 4);
                    break;
                case pc.PIXELFORMAT_DXT1:
                    this._levels[options.level] = new Uint8Array(Math.floor((this._width + 3) / 4) * Math.floor((this._height + 3) / 4) * 8 * this._depth);
                    break;
                case pc.PIXELFORMAT_DXT3:
                case pc.PIXELFORMAT_DXT5:
                    this._levels[options.level] = new Uint8Array(Math.floor((this._width + 3) / 4) * Math.floor((this._height + 3) / 4) * 16 * this._depth);
                    break;
                case pc.PIXELFORMAT_RGB16F:
                    this._levels[options.level] = new Uint16Array(this._width * this._height * this._depth * 3);
                    break;
                case pc.PIXELFORMAT_RGB32F:
                    this._levels[options.level] = new Float32Array(this._width * this._height * this._depth * 3);
                    break;
                case pc.PIXELFORMAT_RGBA16F:
                    this._levels[options.level] = new Uint16Array(this._width * this._height * this._depth * 4);
                    break;
                case pc.PIXELFORMAT_RGBA32F:
                    this._levels[options.level] = new Float32Array(this._width * this._height * this._depth * 4);
                    break;
            }
        }

        return this._levels[options.level];
    },
    setSource: function (source) {
      var i;
      var invalid = false;
      var width, height;

      if (this._cubemap) {
          if (source[0]) {
              // rely on first face sizes
              width = source[0].width || 0;
              height = source[0].height || 0;

              for (i = 0; i < 6; i++) {
                  // cubemap becomes invalid if any condition is not satisfied
                  if (!source[i] || // face is missing
                      source[i].width !== width || // face is different width
                      source[i].height !== height || // face is different height
                      (!(source[i] instanceof HTMLImageElement) && // not image and
                      !(source[i] instanceof HTMLCanvasElement) && // not canvas and
                      !(source[i] instanceof HTMLVideoElement))) { // not video

                      invalid = true;
                      break;
                  }
              }
          } else {
              // first face is missing
              invalid = true;
          }

          if (!invalid) {
              // mark levels as updated
              for (i = 0; i < 6; i++) {
                  if (this._levels[0][i] !== source[i])
                      this._levelsUpdated[0][i] = true;
              }
          }
      } else {
          // check if source is valid type of element
          if (!(source instanceof HTMLImageElement) && !(source instanceof HTMLCanvasElement) && !(source instanceof HTMLVideoElement))
              invalid = true;

          if (!invalid) {
              // mark level as updated
              if (source !== this._levels[0])
                  this._levelsUpdated[0] = true;

              width = source.width;
              height = source.height;
          }
      }

      if (invalid) {
          // invalid texture

          // default sizes
          this._width = 4;
          this._height = 4;
          this._pot = true;

          // remove levels
          if (this._cubemap) {
              for (i = 0; i < 6; i++) {
                  this._levels[0][i] = null;
                  this._levelsUpdated[0][i] = true;
              }
          } else {
              this._levels[0] = null;
              this._levelsUpdated[0] = true;
          }
      } else {
          // valid texture
          this._width = width;
          this._height = height;
          this._pot = ape.math.powerOfTwo(this._width) && ape.math.powerOfTwo(this._height);

          this._levels[0] = source;
      }

      // valid or changed state of validity
      if (this._invalid !== invalid || !invalid) {
          this._invalid = invalid;

          // reupload
          this.upload();
      }
    },
    getSource: function () {
      return this._levels[0];
    },
    unlock: function () {
      if (this._lockedLevel === -1) {
        console.log("ape.Texture#unlock: Attempting to unlock a texture that is not locked.");
      }

      this.upload();
      this._lockedLevel = -1;
    },
    upload: function () {
      this._needsUpload = true;
      this._needsMipmapsUpload = this._mipmaps;
    },
    getDds: function () {
      if (this.format !== ape.PIXELFORMAT_R8_G8_B8_A8)
          console.error("This format is not implemented yet");

      var fsize = 128;
      var i = 0;
      var j;
      var face;
      while (this._levels[i]) {
          var mipSize;
          if (!this.cubemap) {
              mipSize = this._levels[i].length;
              if (!mipSize) {
                  console.error("No byte array for mip " + i);
                  return;
              }
              fsize += mipSize;
          } else {
              for (face = 0; face < 6; face++) {
                  if (!this._levels[i][face]) {
                      console.error('No level data for mip ' + i + ', face ' + face);
                      return;
                  }
                  mipSize = this._levels[i][face].length;
                  if (!mipSize) {
                      console.error("No byte array for mip " + i + ", face " + face);
                      return;
                  }
                  fsize += mipSize;
              }
          }
          fsize += this._levels[i].length;
          i++;
      }

      var buff = new ArrayBuffer(fsize);
      var header = new Uint32Array(buff, 0, 128 / 4);

      var DDS_MAGIC = 542327876; // "DDS"
      var DDS_HEADER_SIZE = 124;
      var DDS_FLAGS_REQUIRED = 0x01 | 0x02 | 0x04 | 0x1000 | 0x80000; // caps | height | width | pixelformat | linearsize
      var DDS_FLAGS_MIPMAP = 0x20000;
      var DDS_PIXELFORMAT_SIZE = 32;
      var DDS_PIXELFLAGS_RGBA8 = 0x01 | 0x40; // alpha | rgb
      var DDS_CAPS_REQUIRED = 0x1000;
      var DDS_CAPS_MIPMAP = 0x400000;
      var DDS_CAPS_COMPLEX = 0x8;
      var DDS_CAPS2_CUBEMAP = 0x200 | 0x400 | 0x800 | 0x1000 | 0x2000 | 0x4000 | 0x8000; // cubemap | all faces

      var flags = DDS_FLAGS_REQUIRED;
      if (this._levels.length > 1) flags |= DDS_FLAGS_MIPMAP;

      var caps = DDS_CAPS_REQUIRED;
      if (this._levels.length > 1) caps |= DDS_CAPS_MIPMAP;
      if (this._levels.length > 1 || this.cubemap) caps |= DDS_CAPS_COMPLEX;

      var caps2 = this.cubemap ? DDS_CAPS2_CUBEMAP : 0;

      header[0] = DDS_MAGIC;
      header[1] = DDS_HEADER_SIZE;
      header[2] = flags;
      header[3] = this.height;
      header[4] = this.width;
      header[5] = this.width * this.height * 4;
      header[6] = 0; // depth
      header[7] = this._levels.length;
      for (i = 0; i < 11; i++) header[8 + i] = 0;
      header[19] = DDS_PIXELFORMAT_SIZE;
      header[20] = DDS_PIXELFLAGS_RGBA8;
      header[21] = 0; // fourcc
      header[22] = 32; // bpp
      header[23] = 0x00FF0000; // R mask
      header[24] = 0x0000FF00; // G mask
      header[25] = 0x000000FF; // B mask
      header[26] = 0xFF000000; // A mask
      header[27] = caps;
      header[28] = caps2;
      header[29] = 0;
      header[30] = 0;
      header[31] = 0;

      var offset = 128;
      var level, mip;
      if (!this.cubemap) {
          for (i = 0; i < this._levels.length; i++) {
              level = this._levels[i];
              mip = new Uint8Array(buff, offset, level.length);
              for (j = 0; j < level.length; j++) mip[j] = level[j];
              offset += level.length;
          }
      } else {
          for (face = 0; face < 6; face++) {
              for (i = 0; i < this._levels.length; i++) {
                  level = this._levels[i][face];
                  mip = new Uint8Array(buff, offset, level.length);
                  for (j = 0; j < level.length; j++) mip[j] = level[j];
                  offset += level.length;
              }
          }
      }

      return buff;
    }
  });

  return {
    Texture: Texture
  };
}());
