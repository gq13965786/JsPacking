Object.assign(ape, function () {
  var Ray = function Ray(origin, direction) {
    this.origin = origin || new ape.Vec3(0, 0, 0);
    this.direction = direction || new ape.Vec3(0, 0, -1);
  };

  return {
    Ray: Ray
  };
}());
