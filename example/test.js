;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        try {
            var JSDOM = require("jsdom").JSDOM;
            var DOM = new JSDOM();
            var window = DOM.window;
            var navigator = window.navigator;
            module.exports = factory(window, navigator);
        } catch (error) {
            module.exports = factory();
        }
    } else {
        root.ape = factory(root.window, root.navigator);
  }
}(this, function (_window, _navigator) {
  window = _window || window;
  navigator = _navigator || navigator;

  var ape = {version:"0.1", revision:"underConstruction", config:{}, common:{}, apps:{}, data:{}, unpack:function() {
  console.warn("ape.unpack has been deprecated and will be removed shortly. Please update your code.");
}};

	
	
	return ape;
}));