Object.assign(ape, (function () {
  var Color = function (r, g, b, a){
    var length = r && r.length;
    if (length ===3 || length ===4){
      this.r = r[0];
      this.g = r[1];
      this.b = r[2];
      this.a = r[3] !== undefined ? r[3] : 1;
    } else {
      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a !== undefined ? a : 1;
    }
  };

  Object.assign(Color.prototype, {
      clone: function(){
        return new ape.Color(this.r, this.g, this.b, this.a);
      },
      copy: function(rhs){
        this.r = rhs.r;
        this.g = rhs.g;
        this.b = rhs.b;
        this.a = rhs.a;

        return this;
      },
      set: function(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = (a === undefined) ? 1 : a;

        return this;
      },
      lerp: function(lhs, rhs, alpha){
        this.r = lhs.r + alpha * (rhs.r - lhs.r);
        this.g = lhs.g + alpha * (rhs.g - lhs.g);
        this.b = lhs.b + alpha * (rhs.b - lhs.b);
        this.a = lhs.a + alpha * (rhs.a - lhs.a);

        return this;
      },
      fromString: function(hex){
        var i = parseInt(hex.replace('#', '0x'), 16);
        var bytes;
        if (hex.length > 7) {
            bytes = ape.math.intToBytes32(i);
        } else {
            bytes = ape.math.intToBytes24(i);
            bytes[3] = 255;
        }

        this.set(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] / 255);

        return this;
      },
      toString: function(alpha){
        var s = "#" + ((1 << 24) + (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255)).toString(16).slice(1);
        if (alpha === true) {
          var a = Math.round(this.a * 255).toString(16);
          if (this.a < 16 / 255) {
            s += '0' + a;
          } else {
            s += a;
          }

        }

        return s;
      }
  });

  //allocate Color memory
  return {
    Color: Color
  };
}()))
