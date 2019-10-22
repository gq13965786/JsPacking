describe("ape.CurveSet", function () {
  it("constructor: array of arrays", function () {
    var c = new ape.CurveSet([0, 0, 1, 1], [0, 0]);
    equal(c.length, 2);
  });

  it("constructor: with number", function () {
    var c = new ape.CurveSet(3);
    equal(c.length, 3);//curveSet(n) if n === 'number' length = n
  });

  it("constructor: no args", function () {
    var c = new ape.CurveSet();
    equal(c.length, 1);
  });

  it("value", function () {
    var c = new ape.CurveSet([0, 0, 1, 1], [0, 0, 1, 1]);
    c.type = ape.CURVE_LINEAR;
    equal(c.value(0.5)[0], 0.5);
    equal(c.value(0.5)[1], 0.5);
  });

  it("get", function () {
    var c = new ape.CurveSet([0, 1], [1, 4]);

    equal(c.get(0).get(0)[1], 1);
    equal(c.get(1).get(0)[1], 4);
  });
});
