Object.assign(ape, function () {
  'use strict';

  var BundleHandler = function (assets) {
    this._assets = assets;//AssetRegistry
    this._worker = null;
  };

  Object.assign(BundleHandler.prototype, {
    load: function (url, callback) {},
    _untar: function (response, callback) {
      var self = this;

      if(ape.platform.workers) {
        //create web worker if necessary
        if (!self._worker) {
          self._worker = new ape.UntarWorker(self._assets.prefix);
        }

        self._worker.untar(response, function (err, files) {
          callback(err,files);
          //if we have no more requests for this worker then destroy it
          if (! self._worker.hasPendingRequests()) {
            self._worker.destroy();
            self._worker = null;
          }

      });
    } else {
      var archive = new ape.Untar(response);
      var files = archive.untar(self._assets.prefix);
      callback(null, files);
    }
    },
    open: function (url, data) {
      return new ape.Bundle(data);
    },
    patch: function (asset, assets) {}
  });

  return {
    BundleHandler: BundleHandler
  };
}())
