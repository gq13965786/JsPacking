Object.assign(ape, function () {
  'use strict';

  var SceneParser = function (app) {};

  Object.assign(SceneParser.prototype, {
    parse: function (data) {},
    _createEntity: function (data) {},
    _openComponentData: function (entity, entities) {}
  });

  return {
    SceneParser: SceneParser
  };
}());
