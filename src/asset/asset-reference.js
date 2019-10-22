Object.assign(ape, function () {

  var AssetReference = function (propertyName, parent, registry, callbacks, scope) {
    this.propertyName = propertyName;
    this.parent = parent;

    this._scop = scope;
    this._registry = registry;

    this.id = null;
    this.url = null;
    this.asset = null;

    this._onAssetLoad = callbacks.load;
    this._onAssetAdd = callbacks.add;
    this._onAssetRemove = callbacks.remove;
  };

  AssetReference.prototype._bind = function () {
    if (this.id) {
      if (this._onAssetLoad) this._registry.on("load:" + this.id, this._onLoad, this);
      if (this._onAssetAdd) this._registry.once("add:" + this.id, this._onAdd, this);
      if (this._onAssetRemove) this._registry.on("remove:" + this.id, this._onRemove, this);
    }

    if(this.url) {
      if (this._onAssetLoad) this._registry.on("load:url:" + this.url, this._onLoad, this);
      if (this._onAssetAdd) this._registry.once("add:url:" + this.url, this._onAdd, this);
      if (this._onAssetRemove) this._registry.on("remove:url:" + this.url, this._onRemove, this);
    }
  };
  AssetReference.prototype._unbind = function () {
    if (this.id) {
      if (this._onAssetLoad) this._registry.off('load:' + this.id, this._onLoad, this);
      if (this._onAssetAdd) this._registry.off('add:' + this.id, this._onAdd, this);
      if (this._onAssetRemove) this._registry.off('remove:' + this.id, this._onRemove, this);
    }
    if (this.url) {
      if (this._onAssetLoad) this._registry.off('load:' + this.url, this._onLoad, this);
      if (this._onAssetAdd) this._registry.off('add:' + this.url, this._onAdd, this);
      if (this._onAssetRemove) this._registry.off('remove:' + this.url, this._onRemove, this);
    }
  };
  AssetReference.prototype._onLoad = function (asset) {
    this._onAssetLoad.call(this._scope, this.propertyName, this.parent, asset);
  };
  AssetReference.prototype._onAdd = function (asset) {
    this._onAssetAdd.call(this._scope, this.propertyName, this.parent, asset);
  };
  AssetReference.prototype._onRemove = function (asset) {
    this._onAssetRemove.call(this._scope, this.perpertyName, this.parent, asset);
  };

  Object.defineProperty(AssetReference.prototype, 'id', {
    get: function () {
      return this._id;
    },
    set: function (value) {
      if (this.url) throw Error("Can't set id and (url)");

      this._unbind();
      this._id = value;
      this.asset = this._registry.get(this._id);
      this._bind();
    }
  });
  Object.defineProperty(AssetReference.prototype, 'url', {
    get: function () {
      return this._url;
    },
    set: function (value) {
      if (this.id) throw Error("Can't set (id) and url");

      this._unbind();
      this._url = value;
      this.asset = this._registry.getByUrl(this._url);
      this._bind();
    }
  });

  return {
    AssetReference: AssetReference
  };
}());
