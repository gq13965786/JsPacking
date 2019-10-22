Object.assign(ape, function () {
  var LayerComposition = function () {};

  LayerComposition.prototype._sortLights = function (target) {};
  LayerComposition.prototype._update = function () {};
  LayerComposition.prototype._isLayerAdded = function (layer) {};
  LayerComposition.prototype._isSublayerAdded = function (layer, transparent) {};
  LayerComposition.prototype.push = function(layer) {};
  LayerComposition.prototype.insert = function(layer, index) {};
  LayerComposition.prototype.remove = function(layer) {};
  LayerComposition.prototype.pushOpaque = function(layer) {};
  LayerComposition.prototype.insertOpaque = function(layer, index) {};
  LayerComposition.prototype.removeOpaque = function(layer) {};
  LayerComposition.prototype.pushTransparent = function(layer) {};
  LayerComposition.prototype.insertTransparent = function(layer, index) {};
  LayerComposition.prototype.removeTransparent = function(layer) {};
  LayerComposition.prototype._getSublayerIndex = function(layer, transparent) {};
  LayerComposition.prototype.getOpaqueIndex = function(layer) {};
  LayerComposition.prototype.getTransparentIndex = function(layer) {};
  LayerComposition.prototype.getLayerById = function(id) {};
  LayerComposition.prototype.getLayerByName = function(name) {};
  LayerComposition.prototype._updateOpaqueOrder = function(startIndex, endIndex) {};
  LayerComposition.prototype._updateTransparentOrder = function(startIndex, endIndex) {};
  LayerComposition.prototype._sortLayersDescending = function(layersA, layersB, order) {};
  LayerComposition.prototype.sortTransparentLayers = function(layersA, layersB) {};
  LayerComposition.prototype.sortOpaqueLayers = function(layersA, layersB) {};

  return {
    LayerComposition: LayerComposition
  };
}());
