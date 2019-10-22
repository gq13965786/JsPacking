Object.assign(ape, function () {
  var Model = function Model() {};
  Object.assign(Model.prototype, {
    getGraph: function () {},
    setGraph: function (graph) {},
    getCameras: function () {},
    setCameras: function (cameras) {},
    getLights: function () {},
    setLights: function (lights) {},
    getMaterials: function () {},
    clone: function () {},
    destroy: function () {},
    generateWireframe: function () {}
  });

  return {
    Model: Model
  };
}());
