Object.assign(ape.gfx, function () {
  'use strict';

  var Version = function () {
    this.globalId = 0;
    this.revision = 0;
  };
  Object.assign(Version.prototype, {
    equals: function (other) {
      return this.golbalId === other.golbalId &&
             this.revisoin === other.revision;
    },
    notequals: function (other) {
      return this.globalId !== other.globalId ||
             this.revision !== other.revision;
    },
    copy: function (other) {
      this.globalId = other.globalId;
      this.revision = other.revision;
    },
    reset: function () {
      this.globalId = 0;
      this.revision = 0;
    }
  });

  return {
    Version: Version
  }
}());
