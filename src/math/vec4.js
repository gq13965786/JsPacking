Object.assign(ape, (function () {
  'use strict';

  var Vec4 = function (x, y, z, w) {
    if (x && x.length === 4){
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
      this.w = x[3];
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
    }
  };

  Object.assign(Vec4.prototype, {
    add: function (rhs) {
      this.x += rhs.x;
      this.y += rhs.y;
      this.z += rhs.z;
      this.w += rhs.w;

      return this;
    },
    add2: function (lhs, rhs) {
      this.x = lhs.x + rhs.x;
      this.y = lhs.y + rhs.y;
      this.z = lhs.z + rhs.z;
      this.w = lhs.w + rhs.w;

      return this;
    },
    clone: function () {
      return new Vec4().copy(this);
    },
    copy: function (rhs) {
      this.x = rhs.x;
      this.y = rhs.y;
      this.z = rhs.z;
      this.w = rhs.w;

      return this;
    },
    dot: function (rhs) {
      return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
    },
    equals: function (rhs) {
      return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
    },
    length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },
    lengthSq: function () {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },
    lerp: function (lhs, rhs, alpha) {
      this.x = lhs.x + alpha * (rhs.x - lhs.x);
      this.y = lhs.y + alpha * (rhs.y - lhs.y);
      this.z = lhs.z + alpha * (rhs.z - lhs.z);
      this.w = lhs.w + alpha * (rhs.w - lhs.w);

      return this;
    },
    mul: function (rhs) {
      this.x *= rhs.x;
      this.y *= rhs.y;
      this.z *= rhs.z;
      this.w *= rhs.w;

      return this;
    },
    mul2: function (lhs, rhs) {
      this.x = lhs.x * rhs.x;
      this.y = lhs.y * rhs.y;
      this.z = lhs.z * rhs.z;
      this.w = lhs.w * rhs.w;

      return this;
    },
    normalize: function () {
      var lengthSq = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
      if (lengthSq > 0) {
        var invLength = 1 / Math.sqrt(lengthSq);
        this.x *= invLength;
        this.y *= invLength;
        this.z *= invLength;
        this.w *= invLength;
      }

      return this;
    },
    scale: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      this.w *= scalar;

      return this;
    },
    set: function (x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;

      return this;
    },
    sub: function (rhs) {
      this.x -= rhs.x;
      this.y -= rhs.y;
      this.z -= rhs.z;
      this.w -= rhs.w;

      return this;
    },
    sub2: function (lhs, rhs) {
      this.x = lhs.x - rhs.x;
      this.y = lhs.y - rhs.y;
      this.z = lhs.z - rhs.z;
      this.w = lhs.w - rhs.w;

      return this;
    },
    toString: function () {
      return '[' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ']';
    }
  });

  Object.defineProperty(Vec4, 'ONE', {
    get: (function () {
      var one = new Vec4(1, 1, 1, 1);
      return function () {
        return one;
      };
    }())
  });

  Object.defineProperty(Vec4, 'ZERO', {
    get: (function () {
      var zero = new Vec4(0, 0, 0, 0);
      return function () {
        return zero;
      };
    }())
  });

  return {
    Vec4: Vec4
  };
}()));
