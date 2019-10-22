ape.math = {
  DEG_TO_RAD: Math.PI /180,
  RAD_TO_DEG: 180 / Math.PI,

  clamp: function (value, min, max){
    if (value >= max) return max;
    if (value <= min) return min;
    return value;
  },
  intToBytes24: function (i){
    var r, g, b;

    r = (i >> 16) & 0xff;
    g = (i >> 8) & 0xff;
    b = (i) & 0xff;

    return [r, g, b];
  },
  intToBytes32: function (i){
    var r, g, b, a;

    r = (i >> 24) & 0xff;
    g = (i >> 16) & 0xff;
    b = (i >> 8) & 0xff;
    a = (i) & 0xff;

    return [r, g, b, a];
  },
  bytesToInt24: function (r, g, b){
    if (r.length) {
      b = r[2];
      g = r[1];
      r = r[0];
    }
    return ((r << 16) | (g << 8) | b);
  },
  bytesToInt32: function (r, g, b, a){
    if (r.length) {
      a = r[3];
      b = r[2];
      g = r[1];
      r = r[0];
    }
    // Why ((r << 24)>>>32)?
    // << operator uses signed 32 bit numbers, so 128<<24 is negative.
    // >>> used unsigned so >>>32 converts back to an unsigned.
    // See http://stackoverflow.com/questions/1908492/unsigned-integer-in-javascript
    return ((r << 24) | (g << 16) | (b << 8) | a) >>> 32;
  },
  lerp: function (a, b, alpha) {
    return a + (b - a) * ape.math.clamp(alpha, 0, 1);
  },
  lerpAngle: function (a, b, alpha) {
    if (b - a > 180) {
      b -= 360;
    }
    if (b - a < -180) {
      b += 360;
    }
    return ape.math.lerp(a, b, ape.math.clamp(alpha, 0, 1));
  },
  powerOfTwo: function () {
    return ((x !== 0) && !(x & (x - 1)));
  },//{Boolean} true if power-of-two and false otherwise.
  nextPowerOfTwo: function () {
    val--;
    val |= (val >> 1);
    val |= (val >> 2);
    val |= (val >> 4);
    val |= (val >> 8);
    val |= (val >> 16);
    val++;
    return val
  },//{Number} The next power of 2.
  random: function (min, max) {
    var diff = max - min;
    return Math.random() * diff + min;
  },
  smoothstep: function (min, max, x) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
  },
  smootherstep: function (min, max, x) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x * (x * (x * 6 - 15) + 10);
  }
};
