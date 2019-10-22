Object.assign(ape, function () {
  'use strict';

  var Bundle = function (files) {
    this._blobUrls = {};

    for (var i = 0, len = files.length; i < len; i++) {
      if (files[i].url) {
        this._blobUrls[files[i].name] = files[i].url;
      }
    }
  };

  Bundle.prototype.hasBlobUrl = function (url) {
    return !! this._blobUrls[url];
  };
  Bundle.prototype.getBlobUrl = function (url) {
    return this._blobUrls[url];
  };
  Bundle.prototype.destroy = function () {
    for (var key in this._blobUrls) {
      URL.revokeObjectURL(this._blobUrls[key]);
    }
    this._blobUrls = null;
  };

  return {
    Bundle: Bundle
  };
}());
