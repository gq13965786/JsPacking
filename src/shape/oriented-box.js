Object.assign(ape, function () {
  var tmpRay = new ape.Ray();
  var tmpVec3 = new ape.Vec3();
  var tmpSphere = new ape.BoundingSphere();
  var tmpMat4 = new ape.Mat4();

  var OrientedBox = function OrientedBox(worldTransform, halfExtents) {
    this.halfExtents = halfExtents || new ape.Vec3(0.5, 0.5, 0.5);

    worldTransform = worldTransform || tmpMat4.setIdentity();
    this._modelTransform = worldTransform.clone().invert();

    this._worldTransform = worldTransform.clone();
    this._aabb = new ape.BoudingBox(new ape.Vec3(), this.halfExtents);
  };

  Object.assign(OrientedBox.prototype, {
    intersectsRay: function (ray, point) {
      this._modelTransform.transformPoint(ray.origin, tmpRay.origin);
      this._modelTransform.transformVector(ray.direction, tmpRay.direction);

      if (point) {
          var result = this._aabb._intersectsRay(tmpRay, point);
          tmpMat4.copy(this._modelTransform).invert().transformPoint(point, point);
          return result;
      }

      return this._aabb._fastIntersectsRay(tmpRay);
    },
    containsPoint: function (point) {
      this._modelTransform.transformPoint(point, tmpVec3);
      return this._aabb.containsPoint(tmpVec3);
    },
    intersectsBoundingSphere: function (sphere) {
      this._modelTransform.transformPoint(sphere.center, tmpSphere.center);
      tmpSphere.radius = sphere.radius;

      if (this._aabb.intersectsBoundingSphere(tmpSphere)) {
        return true;
      }

      return false;
    }
  });
  Object.defineProperty(OrientedBox.prototype, 'worldTransform', {
    get: function () {
      return this._worldTransform;
    },
    set: function () {
      this._worldTransform.copy(value);
      this._modelTransform.copy(value).invert();
    }
  });

  return {
    OrientedBox: OrientedBox
  };
}());
