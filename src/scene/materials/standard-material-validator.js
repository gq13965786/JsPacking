Object.assign(ape, function () {
  var StandardMaterialValidator = function () {};

  StandardMaterialValidator.prototype.setInvalid = function (key, data) {};
  StandardMaterialValidator.prototype.validate = function (data) {};
  StandardMaterialValidator.prototype._createEnumValidator = function (values) {};

  return {
    StandardMaterialValidator: StandardMaterialValidator
  };
}());
