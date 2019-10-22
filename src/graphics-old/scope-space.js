Object.assign(ape, function () {
  'use strict';

  var ScopeSpace = function (name) {
    //Store the name
    this.name = name;
    //Create the empty tables
    this.variables = {};
    this.namespaces = {};
  };

  Object.assign(ScopeSpace.prototype, {
    resolve: function (name) {},
    getSubSpace: function (name) {}
  });

  return {
    ScopeSpace: ScopeSpace
  };
}());
