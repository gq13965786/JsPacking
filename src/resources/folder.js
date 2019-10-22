Object.assign(ape, function () {
  'use strict';

  var FolderHandler = function () {};

  Object.assign(FolderHandler.prototype, {
    load: function (url, callback) {
      callback(null, null);
    },
    open: function (url, data) {
      return data;
    }
  });

  return {
    FolderHandler: FolderHandler
  };
}());
