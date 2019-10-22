Object.assign(ape, function () {
  var _morphMin = new ape.Vec3();
  var _morphMax = new ape.Vec3();

  var MorphTarget = function (options) {};

  var Morph = function (targets) {};
  Object.assign(Morph.prototype, {
    _setBaseMesh: function (baseMesh) {},
    _calculateAabb: function () {},
    addTarget: function (target) {},
    removeTarget: function (target) {},
    getTarget: function (index) {}
  });

  var MorphInstance = function (morph) {};
  Object.assign(MorphInstance.prototype, {
    _setBaseMesh: function (baseMesh) {},
    destroy: function () {},
    getWeight: function (index) {},
    setWeight: function (index, weight) {},
    updateBounds: function (mesh) {},
    update: function (mesh) {}
  });

  return {
    MorphTarget: MorphTarget,
    Morph: Morph,
    MorphInstance: MorphInstance
  };
}());
