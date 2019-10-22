Object.assign(ape, (function () {
  'use strict';

  var Vec3 = function (x, y, z) {
    if (x && x.length === 3) {//pass by array
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }


    var create = function () {
    if (arguments.length === 9) {
        var a = arguments;
        return [a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]];
    } else {
        return [1, 0, 0,
                0, 1, 0,
                0, 0, 1];
    }
};
  };

  Object.assign(Vec3.prototype, {

    add: function (rhs) {
      this.x += rhs.x;
      this.y += rhs.y;
      this.z += rhs.z;

      return this;
    },
    add2: function (lhs, rhs) {
      this.x = lhs.x + rhs.x;
      this.y = lhs.y + rhs.y;
      this.z = lhs.z + rhs.z;

      return this;
    },
    clone: function () {
      return new Vec3().copy(this);
    },
    copy: function (rhs) {
      this.x = rhs.x;
      this.y = rhs.y;
      this.z = rhs.z;

      return this;
    },
    cross: function (lhs, rhs) {
      //no sure about cross multiply function
      var lx = lhs.x;
      var ly = lhs.y;
      var lz = lhs.z;
      var rx = rhs.x;
      var ry = rhs.y;
      var rz = rhs.z;

      this.x = ly * rz - ry * lz;
      this.y = lz * rx - rz * lx;
      this.z = lx * ry - rx * ly;

      return this;
    },
    dot: function (rhs) {
      return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
    },
    equals: function (rhs) {
      return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
    },
    length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    lengthSq: function () {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    lerp: function (lhs, rhs, alpha) {
      this.x = lhs.x + alpha * (rhs.x - lhs.x);
      this.y = lhs.y + alpha * (rhs.y - lhs.y);
      this.z = lhs.z + alpha * (rhs.z - lhs.z);

      return this;
    },
    mul: function (rhs) {
      this.x *= rhs.x;
      this.y *= rhs.y;
      this.z *= rhs.z;

      return this;
    },
    mul2: function (lhs, rhs) {
      this.x = lhs.x * rhs.x;
      this.y = lhs.y * rhs.y;
      this.z = lhs.z * rhs.z;

      return this;
    },
    normalize: function () {
      var lengthSq = this.x * this.x + this.y * this.y + this.z * this.z;
      if (lengthSq > 0) {
        var invLength = 1 / Math.sqrt(lengthSq);
        this.x *= invLength;
        this.y *= invLength;
        this.z *= invLength;
      }

      return this;
    },
    project: function (rhs) {
      var a_dot_b = this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
      var b_dot_b = rhs.x * rhs.x + rhs.y * rhs.y + rhs.z * rhs.z;
      var s = a_dot_b / b_dot_b;
      this.x = rhs.x * s;
      this.y = rhs.y * s;
      this.z = rhs.z * s;
      return this;
    },
    scale: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;

      return this;
    },
    set: function (x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;

      return this;
    },
    sub: function (rhs) {
      this.x -= rhs.x;
      this.y -= rhs.y;
      this.z -= rhs.z;

      return this;
    },
    sub2: function (lhs, rhs) {
      this.x = lhs.x - rhs.x;
      this.y = lhs.y - rhs.y;
      this.z = lhs.z - rhs.z;

      return this;
    },
    toString: function () {
      return '[' + this.x + ', ' + this.y + ', ' + this.z + ']';
    }
  });
//ape.Vec3.BACK, a constant [0,0,1];
//ape.Vec3.DOWN, a constant [0,-1,0];
//ape.Vec3.FORWARD, a constant [0,0,-1]
//ape.Vec3.LEFT, a constant [-1,0,0]
//ape.Vec3.ONE, a constant [1,1,1]
//ape.Vec3.RIGHT, a constant [1,0,0]
//ape.Vec3.up, a constant [0,1,0]
//ape.Vec3.ZERO, a constant [0,0,0]
Object.defineProperty(Vec3, 'BACK', {
    get: (function () {
      var back = new Vec3(0, 0, 1);
      return function() {
        return back;
      };
    }())
});

Object.defineProperty(Vec3, 'DOWN', {
    get: (function () {
      var down = new Vec3(0, -1, 0);
      return function() {
        return down;
      };
    }())
});

Object.defineProperty(Vec3, 'FORWARD', {
    get: (function () {
      var forward = new Vec3(0, 0, -1);
      return function() {
        return forward;
      };
    }())
});

Object.defineProperty(Vec3, 'LEFT', {
    get: (function () {
      var left = new Vec3(-1, 0, 0);
      return function() {
        return left;
      };
    }())
});

Object.defineProperty(Vec3, 'ONE', {
    get: (function () {
      var one = new Vec3(1, 1, 1);
      return function() {
        return one;
      };
    }())
});

Object.defineProperty(Vec3, 'RIGHT', {
    get: (function () {
      var right = new Vec3(1, 0, 0);
      return function() {
        return right;
      };
    }())
});

Object.defineProperty(Vec3, 'UP', {
    get: (function () {
      var up = new Vec3(0, 1, 0);
      return function() {
        return up;
      };
    }())
});

Object.defineProperty(Vec3, 'ZERO', {
    get: (function () {
      var zero = new Vec3(0, 0, 0);
      return function() {
        return zero;
      };
    }())
});

  return {
    Vec3: Vec3
  };
}()));
