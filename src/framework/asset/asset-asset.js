Object.assign(ape.fw, function () {
    var Asset = function (data) {
        if(data._id) {
            this._guid = data._id;
        } else {
            this._guid = ape.guid.create();
        }

        if(data) {
            ape.extend(this, data);
            delete this._id;
        }
    };

    Asset.prototype.getGuid = function () {
        return this._guid;
    }

    Asset.prototype.setGuid = function(guid) {
        this._guid = guid;
    };

    Asset.prototype.getFileUrl = function () {
        var url = this.file.url;
        var prefix = "";
        // Non-exported files use the Corazon API to load, so they need an added prefix.
        if (!this.file.exported) {
            prefix = "/api"
        }

        return ape.path.join(prefix, this.file.url);
    };

    return {
        Asset: Asset
    }
}());
