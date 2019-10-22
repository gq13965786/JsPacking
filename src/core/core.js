var _typeLookup = function() {
  var result = {};
  var names = ["Array","Object","Function","Date","RegExp","Float32Array"];

  for (var i = 0; i < names.length; i++)
    result["[object " + names[i] + "]"] = names[i].toLowerCase();

  return result;
}();

var ape = {
    version: "0.1",
    config: { },
    common: { },
    apps: { }, // Storage for the applications using the PlayCanvas Engine
    data: { }, // Storage for exported entity data
    unpack: function () {
        console.warn("ape.unpack has been deprecated and will be removed shortly. Please update your code.");
    },
    makeArray: function (array) {
    var i,
        ret = [],
        length = array.length;

    for (i = 0; i < length; ++i) {
        ret.push(array[i]);
    }

    return ret;
},
    type: function (obj) {
if (obj === null) {
    return "null";
}

var type = typeof obj;

if (type === "undefined" || type === "number" || type === "string" || type === "boolean") {
    return type;
}

return _typeLookup[Object.prototype.toString.call(obj)];
},
    extend: function (target, ex) {
    var prop,
        copy;

    for (prop in ex) {
        copy = ex[prop];
        if (ape.type(copy) == "object") {
            target[prop] = ape.extend({}, copy);
        } else if (ape.type(copy) == "array") {
            target[prop] = ape.extend([], copy);
        } else {
            target[prop] = copy;
        }
    }

    return target;
},
    isDefined: function (o) {
    var a;
    return (o !== a);
},
    callback: function(self, fn) {
      return function () {
        var args = ape.makeArray(arguments);
        return fn.apply(self, args);
      };
    }
};

if(typeof exports !== 'undefined')
  exports.ape = ape;
