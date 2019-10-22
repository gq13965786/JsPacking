Object.assign(ape.fw, function () {
    var AssetLoader = function (api) {
        this._api = api;
        this._cache = {};
    };

    AssetLoader.prototype.load = function(guid, success) {
        function _loaded(data) {
            var asset = this.open(data);
            success(asset);
        };

        if (guid in this._cache) {
            success(this._cache[guid]);
            return;
        }

        if(guid in ape.content.data) {
            _loaded.call(this, ape.content.data[guid]);
        } else {
            this._api.asset.getOne(guid, ape.callback(this, function (asset) {
                _loaded.call(this, asset);
            }));
        }
    }

    AssetLoader.prototype.open = function (data) {
        var asset = new ape.fw.Asset(data);
        this._cache[asset.getGuid()] = asset;
        return asset;
    };

    return {
        AssetLoader: AssetLoader
    };
}());
