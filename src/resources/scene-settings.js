Object.assign(ape, function () {
  'use strict';

  var SceneSettingsHandler = function (app) {};

  Object.assign(SceneSettingsHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {}
  });

  return {
    SceneSettingsHandler: SceneSettingsHandler
  };
}());
