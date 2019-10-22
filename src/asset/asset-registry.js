Object.assign(ape, function () {
  var AssetRegistry = function (loader) {
    this._loader = loader;

    this._assets = []; //list of all assets
    this._cache = {};  //index for looking up assets by id
    this._names = {};   //index for looking up assets by name
    this._tags = new ape.TagsCache('_id'); //index for looking up by tags
    this._urls = {};   //index for looking up assets by url

    this.prefix = null;

    Object.assign(this, ape.events);
  };

  Object.assign(AssetRegistry.prototype, {
    list: function (filters) {
      filters = filters || {};
      return this._assets.filter(function (asset) {
        var include = true;
        if (filters.preload !== undefined) {
          include = (asset.preload === filters.preload);
        }
        return include;
      });
    },
    add: function (asset) {
      var index = this._assets.push(asset) -1;
      var url;

      //id cache
      this._cache[asset.id] = index;
      if (!this._names[asset.name])
          this._names[asset.name] = [];

      //name cache
      this._names[asset.name].push(index);
      if (asset.file) {
        url = asset.file.url;
        this._urls[url] = index;
      }
      asset.registry = this;

      //tags cache
      this._tags.addItem(asset);
      asset.tags.on('add', this._onTagAdd, this);
      asset.tags.on('remove', this._onTagRemove, this);

      this.fire("add", asset);
      this.fire("add:" + asset.id, asset);
      if (url)
          this.fire("add:url:" + url, asset);

      if (asset.preload)
          this.load(asset);
    },
    remove: function (asset) {
      var idx = this._cache[asset.id];
      var url = asset.file ? asset.file.url : null;

      if (idx !== undefined) {
        //remove from list
        this._assets.splice(idx, 1);
        //remove if -> index cache
        delete this._cache[asset.id];
        //name cache needs to be completely rebuilt
        this._names = {};
        //urls cache needs to be completely rebuilt
        this._urls = [];

        //update id cache and rebuild name cache
        for (var i = 0, l = this._assets.length; i < l; i++) {
          var a = this._assets[i];

          this._cache[a.id] = i;
          if (!this._names[a.name]) {
            this._names[a.name] = [];
          }
          this._names[a.name].push(i);

          if (a.file) {
            this._urls[a.file.url] = i;
          }
        }

        //tags cache
        this._tags.removeItem(asset);
        asset.tags.off('add', this._onTagAdd, this);
        asset.tags.off('remove', this._onTagRemove, this);

        asset.fire("remove", asset);
        this.fire("remove", asset);
        this.fire("remove:" + asset.id, asset);
        if (url)
            this.fire("remove:url:" + url, asset);

        return false;//asset not in registry
      }
    },
    get: function (id) {
      var idx = this._cache[id];
      return this._assets[idx];
    },
    getByUrl: function (url) {
      var idx = this._urls[url];
      return this._assets[idx];
    },
    load: function (asset) {
            if (asset.loading)
                return;

            var self = this;

            // do nothing if asset is already loaded
            // note: lots of code calls assets.load() assuming this check is present
            // don't remove it without updating calls to assets.load() with checks for the asset.loaded state
            if (asset.loaded) {
                if (asset.type === 'cubemap')
                    self._loader.patch(asset, this);
                return;
            }

            var load = !!asset.file;

            var file = asset.getPreferredFile();

            var _load = function () {
                var url = asset.getFileUrl();

                asset.loading = true;

                self._loader.load(url, asset.type, function (err, resource, extra) {
                    asset.loaded = true;
                    asset.loading = false;

                    if (err) {
                        self.fire("error", err, asset);
                        self.fire("error:" + asset.id, err, asset);
                        asset.fire("error", err, asset);
                        return;
                    }
                    if (resource instanceof Array) {
                        asset.resources = resource;
                    } else {
                        asset.resource = resource;
                    }

                    if (!ape.script.legacy && asset.type === 'script') {
                        var loader = self._loader.getHandler('script');

                        if (loader._cache[asset.id] && loader._cache[asset.id].parentNode === document.head) {
                            // remove old element
                            document.head.removeChild(loader._cache[asset.id]);
                        }

                        loader._cache[asset.id] = extra;
                    }

                    self._loader.patch(asset, self);

                    self.fire("load", asset);
                    self.fire("load:" + asset.id, asset);
                    if (file && file.url)
                        self.fire("load:url:" + file.url, asset);
                    asset.fire("load", asset);
                }, asset);
            };

            var _open = function () {
                var resource = self._loader.open(asset.type, asset.data);
                if (resource instanceof Array) {
                    asset.resources = resource;
                } else {
                    asset.resource = resource;
                }
                asset.loaded = true;

                self._loader.patch(asset, self);

                self.fire("load", asset);
                self.fire("load:" + asset.id, asset);
                if (file && file.url)
                    self.fire("load:url:" + file.url, asset);
                asset.fire("load", asset);
            };

            // check for special case for cubemaps
            if (file && asset.type === "cubemap") {
                load = false;
                // loading prefiltered cubemap data
                var url = asset.getFileUrl();

                this._loader.load(url, "texture", function (err, texture) {
                    if (!err) {
                        // Fudging an asset so that we can apply texture settings from the cubemap to the DDS texture
                        self._loader.patch({
                            resource: texture,
                            type: "texture",
                            data: asset.data
                        }, self);

                        // store in asset data
                        asset._dds = texture;
                        _open();
                    } else {
                        self.fire("error", err, asset);
                        self.fire("error:" + asset.id, err, asset);
                        asset.fire("error", err, asset);
                    }
                });
            }

            if (!file) {
                _open();
            } else if (load) {
                this.fire("load:start", asset);
                this.fire("load:" + asset.id + ":start", asset);

                _load();
            }
        },
    loadFromUrl: function (url, type, callback) {
            var self = this;

            var name = ape.path.getBasename(url);

            var file = {
                url: url
            };
            var data = {};

            var asset = self.getByUrl(url);
            if (!asset) {
                asset = new ape.Asset(name, type, file, data);
                self.add(asset);
            }

            if (type === 'model') {
                self._loadModel(asset, callback);
                return;
            }

            asset.once("load", function (loadedAsset) {
                callback(null, loadedAsset);
            });
            asset.once("error", function (err) {
                callback(err);
            });
            self.load(asset);
        },
    _loadModel: function (asset, callback) {
                    var self = this;

                    var url = asset.getFileUrl();
                    var dir = ape.path.getDirectory(url);
                    var basename = ape.path.getBasename(url);
                    var ext = ape.path.getExtension(url);

                    var _loadAsset = function (assetToLoad) {
                        asset.once("load", function (loadedAsset) {
                            callback(null, loadedAsset);
                        });
                        asset.once("error", function (err) {
                            callback(err);
                        });
                        self.load(assetToLoad);
                    };

                    if (ext === '.json') {
                        // playcanvas model format supports material mapping file
                        var mappingUrl = ape.path.join(dir, basename.replace(".json", ".mapping.json"));
                        this._loader.load(mappingUrl, 'json', function (err, data) {
                            if (err) {
                                asset.data = { mapping: [] };
                                _loadAsset(asset);
                                return;
                            }

                            self._loadMaterials(dir, data, function (e, materials) {
                                asset.data = data;
                                _loadAsset(asset);
                            });
                        });
                    } else {
                        // other model format (e.g. obj)
                        _loadAsset(asset);
                    }

                },
    _loadMaterial: function (dir, mapping, callback) {
      var self = this;
      var i;
      var count = mapping.mapping.length;
      var materials = [];

      var done = function (err, loadedMaterials) {
        self._loadTextures(loadedMaterials, function (e, textures) {
          callback(null, loadedMaterials);
        });
      };
      if (count ===0) {
        callback(null, materials);
      }
      var onLoadAsset = function (err, asset) {
        materials.push(asset);
        count--;
        if(count === 0)
            done(null, materials);
      };

      for (i = 0; i < mapping.mapping.length; i++) {
        var path = mapping.mapping[i].path;
        if (path) {
          path = ape.path.join(dir, path);
          self.loadFromUrl(path, "material", onLoadAsset);
        } else {
          count--;
        }
      }
    },
    _loadTextures: function (materialAssets, callback) {
      var slef = this;
      var i;
      var used = {};//prevent duplicate urls
      var urls = [];
      var textures = [];
      var count = 0;
      for (i = 0; i < materialAssets.length; i++) {
          var materialData = materialAssets[i].data;

          if (materialData.mappingFormat !== 'path') {
              console.warn('Skipping: ' + materialAssets[i].name + ', material files must be mappingFormat: "path" to be loaded from URL');
              continue;
          }

          var url = materialAssets[i].getFileUrl();
          var dir = ape.path.getDirectory(url);
          var textureUrl;

          for (var pi = 0; pi < ape.StandardMaterial.TEXTURE_PARAMETERS.length; pi++) {
              var paramName = ape.StandardMaterial.TEXTURE_PARAMETERS[pi];

              if (materialData[paramName]) {
                  var texturePath = materialData[paramName];
                  textureUrl = ape.path.join(dir, texturePath);
                  if (!used[textureUrl]) {
                      used[textureUrl] = true;
                      urls.push(textureUrl);
                      count++;
                  }
              }
          }
      }

      if (!count) {
          callback(null, textures);
          return;
      }

      var onLoadAsset = function (err, texture) {
          textures.push(texture);
          count--;

          if (err) console.error(err);

          if (count === 0)
              callback(null, textures);
      };

      for (i = 0; i < urls.length; i++)
          self.loadFromUrl(urls[i], "texture", onLoadAsset);
    },
    findAll: function (name, type) {
      var self = this;
      var idxs = this._names[name];
      if (idxs) {
        var assets = idxs.map(function (idx) {
          return self._assets[idx];
        });

        if (type) {
          return assets.filter(function (asset) {
            return (asset.type === type);
          });
        }

        return assets;
      }

      return [];//empty
    },
    _onTagAll: function (name, type) {
      this._tags.add(tag, asset);
    },
    _onTagRemove: function (tag, asset) {
      this._tags.remove(tag, asset);
    },
    findByTag: function () {
      return this._tags.find(arguments);//tags' arguments
    },
    filter: function (callback) {
      var items = [];
      for (var i = 0, len = this._assets.length; i < len; i++) {
        if (callback(this._assets[i]))
            items.push(this._assets[i]);
      }
      return items;
    },
    find: function (name, type) {
      var asset = this.findAll(name, type);
      return asset ? asset[0] : null;
    },
  });

  return {
    AssetRegistry: AssetRegistry
  };
}());
