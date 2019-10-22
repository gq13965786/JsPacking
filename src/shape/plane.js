Object.assign(ape, function () {
  var tmpVecA = new ape.Vec3();

  var Plane = function Plane(point, normal) {
    this.normal = normal || new ape.Vec3(0, 0, 1);
    this.point = point || new ape.Vec3(0, 0, 0);
  };
  Object.assign(Plane.prototype, {
    intersectsLine: function (start, end, point) {
      var d = -this.normal.dot(this.point);
      var d0 = this.normal.dot(start) + d;
      var d1 = this.normal.dot(end) + d;

      var t = d0 / (d0 -d1);
      var intersects = t >= 0 && t <= 1;
      if (intersects && point)
          point.lerp(start, end, t);

      return intersects;
    },
    intersectsRay: function (ray, point) {
      var pointToOrigin = tmpVecA.sub2(this.point, ray.origin);
      var t = this.normal.dot(pointToOrigin) / this.normal.dot(ray.direction);
      var intersects = t >= 0;

      if (intersects && point)
          point.copy(ray.direction).scale(t).add(ray.origin);

      return intersects;
    }
  });

  return {
    Plane: Plane
  };
}());
