Object.assign(ape, function () {
  'use strict';

  var ScopeId = function (name) {
    this.name = name;
    this.value = null;
    this.versionObject = new ape.versionObject();
  };

  Object.assign(ScopeId.prototype, {
    setValue: function (value) {
      this.value = value;
      this.versionObject.increment();
    },
    getValue: function (value) {//value?
      return this.value;
    }
  });

  return {
    ScopeId: ScopeId
  };
}());
