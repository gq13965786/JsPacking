Object.assign(ape, function () {
  var _deviceDeprecationWarning = false;
  var _getSelectionDeprecationWarning = false;
  var _prepareDeprecationWarning = false;

  var Picker = function (app, width, height) {};

  Picker.prototype.getSelection = function (x, y, width, height) {};
  Picker.prototype.prepare = function (camera, scene, arg) {};
  Picker.prototype.onLayerPreRender = function (layer, sourceLayer, sourceRt) {};
  Picker.prototype.onLayerPostRender = function (layer) {};
  Picker.prototype.resize = function (width, height) {};

  Object.defineProperty(Picker.prototype, 'renderTarget', {});

  return {
    Picker: Picker
  };
}());
