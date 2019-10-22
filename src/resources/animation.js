Object.assign(ape, function () {
  'use strict';

  var AnimationHandler = function () {};

  Object.assign(AnimationHandler.prototype, {
    load: function (url, callback) {},
    open: function (url, data) {},
    _parseAnimationV3: function (data) {},
    _parseAnimationV4: function (data) {}
  });

  return {
    AnimationHandler: AnimationHandler
  };
}());
