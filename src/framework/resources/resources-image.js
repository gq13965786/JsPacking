Object.assign(ape.resources, function () {
	var ImageResourceHandler = function () {
	};
	ImageResourceHandler.prototype = Object.create(ape.resources.ResourceHandler);
	ImageResourceHandler.prototype.constructor = ImageResourceHandler;


  ImageResourceHandler.prototype.load = function (identifier, success, error, progress, options) {
        var image = new Image();
        var self = this;

		// Call success callback after opening Image
        image.onload = function () {
        	success(image);
        }

        // Call error callback with details.
        image.onerror = function (event) {
        	var element = event.srcElement;
        	error(ape.string.format("Error loading Image from: '{0}'", element.src));
        }
        image.src = identifier;
    };

  ImageResourceHandler.prototype.open = function (data, options) {
    	return data;
  };

	var ImageRequest = function ImageRequest(identifier) {

	};
	ImageRequest.prototype = Object.create(ape.resources.ResourceRequest);
	ImageRequest.prototype.constructor = ImageRequest;
	
	ImageRequest.prototype.type = "image";

	return {
		ImageResourceHandler: ImageResourceHandler,
		ImageRequest: ImageRequest
	}
}());
