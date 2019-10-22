Object.assign(ape.gfx, function () {
  'use strict';
  var ScopeId = function (name) {
    this.name = name;
    this.value = null;

    this.versionObject = new ape.gfx.VersionObject();
  }

  Object.assign(ScopeId.prototype, {
    setValue: function (value) {
      this.value = value;
      this.versionObject.increment();
    },
    getValue: function (value) {
      return this.value;
    }
  });

  return {
    ScopeId: ScopeId
  };
}());
