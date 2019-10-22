Object.assign(ape, function () {
  var ObjModelParser = function (device) {};

  Object.assign(ObjModelParser.prototype, {
    parse: function (input) {},
    _parseIndices: function (str) {}
  });

  return {
    ObjModelParser: ObjModelParser
  };
});
