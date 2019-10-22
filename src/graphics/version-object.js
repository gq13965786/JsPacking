Object.assign(ape.gfx, function () {
  'use strict';

  var idCounter = 0;

  var VersionObject = function () {
    idCounter++;
    this.version = new ape.gfx.Version();
    this.version.globalId = idCounter;
  };

  Object.assign(VersionObject.prototype, {
    increment: function () {
      this.version.revision ++;
    }
  });

  return {
    VersionObject: VersionObject
  };
}());
