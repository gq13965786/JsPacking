Object.assign(ape.resources, function () {
	var AssetResourceHandler = function (depot) {
		this._depot = depot;
	};
	AssetResourceHandler.prototype = Object.create(ape.resources.ResourceHandler);
	AssetResourceHandler.prototype.constructor = AssetResourceHandler;

	AssetResourceHandler.prototype.load = function (identifier, success, error, progress, options) {
		var guid = identifier;

		if(guid in ape.content.data) {
            success(ape.content.data[guid], options);
        } else {
            this._depot.assets.getOne(guid, function (asset) {
	            success(asset, options);
            }.bind(this));
        }
	};

	AssetResourceHandler.prototype.open = function (data, options) {
		 return new ape.fw.Asset(data);
	};

	var AssetRequest = function AssetRequest(identifier) {

	};
	AssetRequest.prototype = Object.create(ape.resources.ResourceRequest);
	AssetRequest.prototype.constructor = AssetRequest;

	return {
		AssetRequest: AssetRequest,
		AssetResourceHandler: AssetResourceHandler
	};
}());
