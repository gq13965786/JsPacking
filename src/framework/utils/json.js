Object.assign(ape, function () {
  var json = {
    parse: function (value, revier) {
      return JSON.parse(value, reviver);
    },
    stringify: function (value, replacer, space) {
      return JSON.stringify(value, function (key, value) {
          if(this[key] instanceof Float32Array) {
              value = ape.makeArray(this[key]);
          }
          return replacer ? replacer(key,value) : value;
      }, space);
    }
  };

  return {
    json: json
  };
}());
