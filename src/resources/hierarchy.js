Object.assign(ape, function () {
  'use strict';

  var HierarchyHandler = function (app) {};

  Object.assign(HierarchyHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, callback) {}
  });

  return {
    HierarchyHandler: HierarchyHandler
  };
}());
