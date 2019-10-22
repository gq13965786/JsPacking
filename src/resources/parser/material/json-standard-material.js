Object.assign(ape, function () {
  var JsonStandardMaterialParser = function () {};

  JsonStandardMaterialParser.prototype.parse = function (input) {};
  JsonStandardMaterialParser.prototype.initialize = function (material, data) {};
  JsonStandardMaterialParser.prototype.migrate = function (data) {};
  JsonStandardMaterialParser.prototype._validate = function (data) {};

  return {
    JsonStandardMaterialParser: JsonStandardMaterialParser
  };
}());
