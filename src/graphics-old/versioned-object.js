Object.assign(ape, function () {
  'use strict';

  var idCounter = 0;

  var VersionedObject = function () {
    idCounter++;
    this.version = new ape.Version();
    this.version.globalId = idCounter;
  };
  Object.assign(VersionedObject.prototype, {
    increment: function () {
      this.version.revision++;
    }
  });

  return {
    VersionedObject: VersionedObject
  };
}());
