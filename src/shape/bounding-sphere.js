Object.assign(ape, function () {
  var tmpVecA = new ape.Vec3();
  var tmpVecB = new ape.Vec3();
  var tmpVecC = new ape.Vec3();
  var tmpVecD = new ape.Vec3();

  function BoundingSphere(center, radius) {
    this.center = center || new ape.Vec3(0, 0, 0);
    this.radius = radius === undefined ? 0.5 : radius;
  }

  Object.assign(BoundingSphere.prototype, {
    containsPoint: function (point) {
      var lenSq = tmpVecA.sub2(point, this.center).lengthSq();
      var r = this.radius;
      return lenSq < r * r;
    },
    compute: function (vertices) {
      var i;
      var numVerts = vertices.length / 3;

      var vertex = tmpVecA;
      var avgVertex = tmpVecB;
      var sum = tmpVecC;

      //find the "average vertex", which is the sphere's center...
      for (i = 0; i < numVerts; i++) {
        vertex.set(vertices[i*3],vertices[i*3+1],vertices[i*3+2]);
        sum.addSelf(vertex);
        //apply a part-result to avoid float-voerflows
        if (i % 100 === 0) {
          sum.scale(1 / numVerts);
          avgVertex.add(sum);
          sum.set(0, 0, 0);
        }
      }

      sum.scale(1 / numVerts);
      avgVertex.add(sum);
      this.center.copy(avgVertex);

      //find the maximum (squared) distance of all vertices to the center...
      var maxDistSq = 0;
      var centerToVert = tmpVecD;

      for (i = 0; i < numVerts; i++) {
        vertex.set(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);

        centerToVert.sub2(vertex, this.center);
        maxDistSq = Math.max(centerToVert.lengthSq(), maxDistSq);
      }
      this.radius = Math.sqrt(maxDistSq);
    },
    intersectsRay: function (ray, point) {
      var m = tmpVecA.copy(ray.origin).sub(this.center);
      var b = m.dot(tmpVecB.copy(ray.direction).normalize());
      var c = m.dot(m) - this.radius * this.radius;
      //exit if ray's origin outside of sphere (c>0) and ray
      //pointing away from s (b > 0)
      if (c > 0 && b > 0)
          return null;

      var discr = b * b - c;
      //a negative discriminant corresponds to ray missing sphere
      if (discr < 0)
          return false;

      //ray intersects sphere, compute smallest t value of intersection
      var t = Math.abs(-b - Math.sqrt(discr));

      //if t is negative, ray started inside sphere so clamp t to zero
      if (point)
          point.copy(ray.direction).scale(t).add(ray.origin);

      return true;
    },
    intersectsBoundingSphere: function (sphere) {
      tmpVecA.sub2(sphere.center, this.center);
      var totalRadius = sphere.radius + this.radius;
      if (tmpVecA.lengthSq() <= totalRadius * totalRadius) {
        return true;
      }
      return false;
    }
  });

  return {
    BoundingSphere: BoundingSphere
  };
}());
