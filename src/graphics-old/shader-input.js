Object.assign(ape, function () {
  'use strict';

  var ShaderInput = function (graphicsDevice, name, type, locationId) {
    this.locationId = locationId;
    this.scopeId = graphicsDevice.scope.resolve(name);
    this.version = new ape.Version();

    if (type === ape.UNIFORMTYPE_FLOAT) {
      if (name.substr(name.length - 3) === "[0]") type = ape.UNIFORMTYPE_FLOATARRAY;
    }
    this.dataType = type;

    this.value = [null, null, null, null];
    //Array to hold texture unit ids
    this.array = [];
  };

  return {
    ShaderInput: ShaderInput
  };
}());
