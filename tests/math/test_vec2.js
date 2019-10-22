describe("ape.Vec2", function () {
  it("x", function () {
    var v1 = new ape.Vec2(2, 3);
    equal(2, v1.x);
  });

  it("y", function () {
    var v1 = new ape.Vec2(1, 4);
    equal(4, v1.y);
  });

  it("add", function () {
    var v1 = new ape.Vec2(2, 4);
    var v2 = new ape.Vec2(1, 2);
    var r = new ape.Vec2();

    r.add2(v1, v2);

    equal(3, r.x);
    equal(6, r.y);

    var v3 = new ape.Vec2(2,3);
    var v4 = new ape.Vec2(8,7);

    v3.add(v4);

    equal(10, v3.x);
    equal(10, v3.y);
  });

  it("clone", function () {
    var v1 = new ape.Vec2();
    var v2 = v1.clone();

    ok(typeof v2 === "object");

    equal(v1.x, v2.x);
    equal(v2.y, v1.y);
  });

  it("copy", function () {
    var v1 = new ape.Vec2(2, 4);
    var v2 = new ape.Vec2();

    v2.copy(v1);

    equal(2, v2.x);
    equal(4, v2.y);
  });

  it("constructor: no args", function () {
    var v = new ape.Vec2();

    equal(v.x, 0);
    equal(v.y, 0);
  });

  it("constructor: args", function () {
    var v = new ape.Vec2(1, 2);

    equal(v.x, 1);
    equal(v.y, 2);
  });

  it("dot", function () {
    var v1 = new ape.Vec2(1, 2);
    var v2 = new ape.Vec2(3, 4);

    var r = v1.dot(v2);

    equal(r, 11);
  });

  it("dot: parallel", function () {
    var v1 = new ape.Vec2(0, 1);
    var v2 = new ape.Vec2(0, 1);

    var r = v1.dot(v2);

    equal(r, 1);
  });

  it("dot: perpendicular", function () {
    var v1 = new ape.Vec2(8, 0);
    var v2 = new ape.Vec2(0, 8);

    var r = v1.dot(v2);

    equal(r, 0);
  });

  it("equals", function () {
    var v1 = new ape.Vec2(1, 0);
    var v2 = new ape.Vec2(0, 1);

    var e = v1.equals(v2);
    equal(false, e);

    var e = v1.equals(v1);
    equal(true, e);
  });

  it("length", function () {
    var v = new ape.Vec2(3, 4);
    var l = v.length();
    equal(5, l);
  });

  it("lengthSq", function () {
    var v = new ape.Vec2(3, 4);
    var l = v.lengthSq();
    equal(25, l);
  });

  it("lerp", function () {
    var v0 = new ape.Vec2(1, 2);
    var v1 = new ape.Vec2(3, 4);
    var r = new ape.Vec2();

    r.lerp(v0, v1, 0);

    equal(v0.x, r.x);
    equal(v0.y, r.y);

    r.lerp(v0, v1, 1);

    equal(v1.x, r.x);
    equal(v1.y, r.y);
  });

  it("mul", function () {
    var v1 = new ape.Vec2(1, 2);
    var v2 = new ape.Vec2(3, 4);

    v1.mul(v2);

    equal(3, v1.x);
    equal(8, v1.y);
  });

  it("mul2", function () {
    var v1 = new ape.Vec2(1, 2);
    var v2 = new ape.Vec2(3, 4);
    var r = new ape.Vec2();

    r.mul2(v1, v2);

    equal(3, r.x);
    equal(8, r.y);
  });

  it("normalize", function () {
    var x = new ape.Vec2(10, 0);
    var y = new ape.Vec2(0, 10);

    x.normalize();
    equal(1, x.x);
    equal(0, x.y);

    y.normalize();
    equal(0, y.x);
    equal(1, y.y);
  });

  it("scale", function () {
    var v = new ape.Vec2(1, 2);
    v.scale(2);

    equal(2, v.x);
    equal(4, v.y);
  });

  it("set", function () {
    var v1 = new ape.Vec2();

    v1.set(2, 4);

    equal(2, v1.x);
    equal(4, v1.y);
  });

  it("sub", function () {
    var v1 = new ape.Vec2(2, 4);
    var v2 = new ape.Vec2(1, 2);

    v1.sub(v2);

    equal(1, v1.x);
    equal(2, v1.y);
  });

  it("sub2", function () {
    var v1 = new ape.Vec2(2, 4);
    var v2 = new ape.Vec2(1, 2);
    var r = new ape.Vec2();

    r.sub2(v1, v2);

    equal(1, r.x);
    equal(2, r.y);
  });

  it("toString", function () {
    var v1 = new ape.Vec2(2, 4);

    var s = v1.toString();

    equal(s, '[2,4]');
  });
})
