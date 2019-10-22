Object.assign(ape.gfx, function () {
  'use strict';

  var ScopeSpace = function (name) {
    //store the name
    this.name = name;
    //empty tables
    this.variables = {};
    this.namespaces = {};
  };

  Object.assign(ScopeSpace.prototype, {
    resolve: function (name) {
      if (this.variables.hasOwnProperty(name) == false) {
        this.variables[name] = new ape.gfx.ScopeId(name);
      }
      return this.variables[name];
    },
    getSubSpace: function (name) {
      if (this.namespaces.hasOwnProperty(name) == false) {
        this.namespaces[name] = new ape.gfx.ScopeSpace(name);
      }
      return this.namespaces[name];
    }
  });

  return {
    ScopeSpace: ScopeSpace
  };
}());
