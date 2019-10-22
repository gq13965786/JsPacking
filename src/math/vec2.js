Object.assign(ape, (function () {
  'use strict';
  var Vec2 = function (x, y) {
    if (x && x.length === 2) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
  };

  Object.assign(Vec2.prototype, {
    add: function (rhs) {
      this.x += rhs.x;
      this.y += rhs.y;

      return this;
    },
    add2: function (lhs, rhs) {
      this.x = lhs.x + rhs.x;
      this.y = lhs.y + rhs.y;

      return this;
    },
    clone: function () {
      return new Vec2().copy(this);
    },
    copy: function (rhs) {
      this.x = rhs.x;
      this.y = rhs.y;

      return this;
    },
    dot: function (rhs) {
      return this.x * rhs.x + this.y * rhs.y;
    },
    equals: function (rhs) {
      return this.x === rhs.x && this.y === rhs.y;
    },
    length: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    lengthSq: function () {
      return this.x * this.x + this.y * this.y;
    },
    lerp: function (lhs, rhs, alpha) {
      this.x = lhs.x + alpha * (rhs.x - lhs.x);
      this.y = lhs.y + alpha * (rhs.y - lhs.y);

      return this;
    },
    mul: function (rhs) {
      this.x *= rhs.x;
      this.y *= rhs.y;

      return this;
    },
    mul2: function (lhs, rhs) {
      this.x = lhs.x * rhs.x;
      this.y = lhs.y * rhs.y;

      return this;
    },
    normalize: function () {
      var lengthSq = this.x * this.x + this.y * this.y;
      if (lengthSq > 0){
        var invLength = 1 / Math.sqrt(lengthSq);
        this.x *= invLength;
        this.y *= invLength;
      }

      return this;
    },
    scale: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;

      return this;
    },
    set: function (x, y) {
      this.x = x;
      this.y = y;

      return this;
    },
    sub: function (rhs) {
      this.x -= rhs.x;
      this.y -= rhs.y;

      return this;
    },
    sub2: function (lhs, rhs) {
      this.x = lhs.x - rhs.x;
      this.y = lhs.y - rhs.y;

      return this;
    },
    toString: function () {
      return '[' + this.x + ',' + this.y + ']';
    }
  });
//ape.Vec2.ONE, a constant vector set to [1,1]
//ape.Vec2.RIGHT, a constant vector set to []
//ape.Vec2.UP, a constant vector set to []
//ape.Vec2.ZERO, a constant vector set to [0,0]
  Object.defineProperty(Vec2, 'ONE', {
    get: (function () {
      var one = new Vec2(1,1);
      return function() {
        return one;
      };
    }())
  });
  Object.defineProperty(Vec2, 'RIGHT', {
    get: (function () {
      var right = new Vec2(1,0);
      return function () {
        return right;
      };
    }())
  });
  Object.defineProperty(Vec2, 'UP', {
    get: (function () {
      var up = new Vec2(0,1);
      return function () {
        return up;
      };
    }())
  });
  Object.defineProperty(Vec2, 'ZERO', {
    get: (function () {
      var zero = new Vec2(0,0);
      return function () {
        return zero;
      };
    }())
  });

  return {
    Vec2: Vec2
  };
}()));
