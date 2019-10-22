ape.script = (function () {
  var _main = null;
  var _loader = null;

  var script = {
    main: function (callback) {
      if (_main) {
        throw new Error("'main' Object already registered");
      }
      _main = callback;
    },
    setLoader: function (loader) {
      if (loader && _loader) {
        throw new Error("ape.script already has loader object");
      }

      _loader = loader;
    },
    create: function (name, callback) {
      this.fire("created", name, callback)
    },
    start: function () {
      _main();
    }
  };

  ape.extend(script, ape.events);

  return script;
}());
