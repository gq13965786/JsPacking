describe("ape.Quat", function () {
  it("constructor: args", function () {
    var q = new ape.Quat(1, 2, 3, 4);

    equal(1, q.x);
    equal(2, q.y);
    equal(3, q.z);
    equal(4, q.w);
  });

  it("constructor: no args", function () {
    var q = new ape.Quat();

    equal(0, q.x);
    equal(0, q.y);
    equal(0, q.z);
    equal(1, q.w);
  });
//mul2 is also with mul
  it("mul2", function() {
    // I*I = I
    var q1 = new ape.Quat();
    var q2 = new ape.Quat();
    var q3 = new ape.Quat();
    var q4 = new ape.Quat();
    var qr = new ape.Quat();

    qr.mul2(q1, q2);
    equal(qr.x, 0);
    equal(qr.y, 0);
    equal(qr.z, 0);
    equal(qr.w, 1);

    // R*Rinv=I
    q1.setFromEulerAngles(90, 0, 0);
    q2.setFromEulerAngles(-90, 0, 0);
    qr.mul2(q1, q2);
    close(qr.x, 0, 0.0001);
    equal(qr.y, 0);
    equal(qr.z, 0);
    close(qr.w, 1, 0.0001);

    q1.setFromEulerAngles(25, 0, 0);
    q2.setFromEulerAngles(0, 35, 0);
    q3.setFromEulerAngles(0, 0, 45);
    qr.mul2(q3, q2);
    qr.mul(q1);
    q4.setFromEulerAngles(25, 35, 45);
    close(qr.x, q4.x, 0.0001);
    close(qr.y, q4.y, 0.0001);
    close(qr.z, q4.z, 0.0001);
    close(qr.w, q4.w, 0.0001);
  });

  it("mul2: same order as matrix mult", function () {
    var q1 = new ape.Quat();
    var q2 = new ape.Quat();
    var q3 = new ape.Quat();
    var q4 = new ape.Quat();

    var m1 = new ape.Mat4();
    var m2 = new ape.Mat4();
    var m3 = new ape.Mat4();

    q1.setFromEulerAngles(10, 20, 0);
    q2.setFromEulerAngles(0, 50, 0);
    q3.mul2(q1, q2);

    m1.setFromEulerAngles(10, 20, 0);
    m2.setFromEulerAngles(0, 50, 0);
    m3.mul2(m1, m2);
    q4.setFromMat4(m3);

    close(q3.x, q4.x, 0.0001);
    close(q3.y, q4.y, 0.0001);
    close(q3.z, q4.z, 0.0001);
    close(q3.w, q4.w, 0.0001);
  });

  it("set FromEulerAngles", function () {
    function testAngles(x, y, z){
      var q1 = new ape.Quat();
      var q2 = new ape.Quat();
      var m = new ape.Mat4();

      q1.setFromEulerAngles(x, y, z);
      m.setFromEulerAngles(x, y, z);
      q2.setFromMat4(m);

      close(q1.x, q2.x, 0.0001);
      close(q1.y, q2.y, 0.0001);
      close(q1.z, q2.z, 0.0001);
      close(q1.w, q2.w, 0.0001);
    }

    testAngles(0,0,0);
    testAngles(90,0,0);
    testAngles(0.1,0,0);
    testAngles(0,0.2,0);
    testAngles(0,0,0.3);
    testAngles(1,2,3);
    testAngles(10,10,0);
  });

  it("fromEulerXYZ: useful normalized quaternions", function () {
    var q = new ape.Quat();

    // Identity quaternion, no rotation
    q.setFromEulerAngles(0, 0, 0);
    equal(q.x, 0);
    equal(q.y, 0);
    equal(q.z, 0);
    equal(q.w, 1);

    // 180° turn around X axis
    q.setFromEulerAngles(180, 0, 0);
    equal(q.x, 1);
    equal(q.y, 0);
    equal(q.z, 0);
    close(q.w, 0, 0.0001);

    // 180° turn around Y axis
    q.setFromEulerAngles(0, 180, 0);
    equal(q.x, 0);
    close(q.y, 1, 0.0001);
    equal(q.z, 0);
    close(q.w, 0, 0.0001);

    // 180° turn around Z axis
    q.setFromEulerAngles(0, 0, 180);
    equal(q.x, 0);
    equal(q.y, 0);
    close(q.z, 1, 0.0001);
    close(q.w, 0, 0.0001);

    // 90° turn around X axis
    q.setFromEulerAngles(90, 0, 0);
    close(q.x, Math.sqrt(0.5), 0.0001);
    equal(q.y, 0);
    equal(q.z, 0);
    close(q.w, Math.sqrt(0.5), 0.0001);

    // 90° turn around Y axis
    q.setFromEulerAngles(0, 90, 0);
    equal(q.x, 0);
    close(q.y, Math.sqrt(0.5), 0.0001);
    equal(q.z, 0);
    close(q.w, Math.sqrt(0.5), 0.0001);

    // 90° turn around Z axis
    q.setFromEulerAngles(0, 0, 90);
    equal(q.x, 0);
    equal(q.y, 0);
    close(q.z, Math.sqrt(0.5), 0.0001);
    close(q.w, Math.sqrt(0.5), 0.0001);

    // -90° turn around X axis
    q.setFromEulerAngles(-90, 0, 0);
    close(q.x, -Math.sqrt(0.5), 0.0001);
    equal(q.y, 0);
    equal(q.z, 0);
    close(q.w, Math.sqrt(0.5), 0.0001);

    // -90° turn around Y axis
    q.setFromEulerAngles(0, -90, 0);
    equal(q.x, 0);
    close(q.y, -Math.sqrt(0.5), 0.0001);
    equal(q.z, 0);
    close(q.w, Math.sqrt(0.5), 0.0001);

    // -90° turn around Z axis
    q.setFromEulerAngles(0, 0, -90);
    equal(q.x, 0);
    equal(q.y, 0);
    close(q.z, -Math.sqrt(0.5), 0.0001);
    close(q.w, Math.sqrt(0.5), 0.0001);
  });

  it("setFromMat4", function () {
    //Identity matrix to identity quaternion
    var s;
    var m = new ape.Mat4();
    var q = new ape.Quat().setFromMat4(m);

    equal(q.x, 0);
    equal(q.y, 0);
    equal(q.z, 0);
    equal(q.w, 1);

    //180 degrees around +ve x
    m = new ape.Mat4().setFromAxisAngle(ape.Vec3.RIGHT, 180);
    q = new ape.Quat().setFromMat4(m);

    equal(q.x, 1);
    equal(q.y, 0);
    equal(q.z, 0);
    close(q.w, 0, 0.0001);

    //-90 degrees around +ve x
    m = new ape.Mat4().setFromAxisAngle(ape.Vec3.BACK, -90);
    q = new ape.Quat().setFromMat4(m);

    equal(q.x, 0);
    equal(q.y, 0);
    close(q.z, -Math.sqrt(0.5), 0.0001);
    close(q.w, Math.sqrt(0.5), 0.0001);

    //45 degrees around +ve Z, scaled //same result as above
    s = new ape.Mat4().setScale(2, 2, 2);
    m = new ape.Mat4().setFromAxisAngle(ape.Vec3.BACK, -90);
    m.mul(s);
    q = new ape.Quat().setFromMat4(m);
    q.normalize();

    equal(q.x, 0);
    equal(q.y, 0);
    close(q.z, -Math.sqrt(0.5), 0.0001);
    close(q.w, Math.sqrt(0.5), 0.0001);
  });

  it("transformVector", function () {
    var q = new ape.Quat();
    var v = new ape.Vec3(0,0,1);
    var r = new ape.Vec3();

    //Identity quaternion, no rotation
    q.transformVector(v, r);
    equal(r.x, 0);
    equal(r.y, 0);
    equal(r.z, 1);

    //Identity quaternion, no rotation
    q.setFromEulerAngles(180,0,0);
    q.transformVector(v, r);
    close(r.x, 0, 0.0001);
    close(r.y, 0, 0.0001);
    close(r.z, -1, 0.0001);
  });

  it("setFromAxisAngle", function () {
    //Identity
    var qi = new ape.Quat();
    var q = new ape.Quat();
    q.setFromAxisAngle(ape.Vec3.RIGHT, 0);
    equal(q.x, qi.x);
    equal(q.y, qi.y);
    equal(q.z, qi.z);
    equal(q.w, qi.w);

    var qx = new ape.Quat();
    var qy = new ape.Quat();
    var qz = new ape.Quat();
    var r = new ape.Quat();

    qx.setFromAxisAngle(ape.Vec3.RIGHT, 45);
    qy.setFromAxisAngle(ape.Vec3.UP, 55);
    qz.setFromAxisAngle(ape.Vec3.BACK, 65);

    r.mul2(qz, qy);
    r.mul(qx);

    var qe = new ape.Quat();
    qe.setFromEulerAngles(45, 55, 65);

    close(r.x, qe.x,0.0001);
    equal(r.y, qe.y);
    equal(r.z, qe.z);
    equal(r.w, qe.w);
  });

  it("getEulerAngles", function () {
    var q;
    var e = new ape.Vec3();

    //Identity quaternion, no rotation
    q = new ape.Quat(0, 0, 0, 1);
    q.getEulerAngles(e);
    equal(e.x, 0);
    equal(e.y, 0);
    equal(e.z, 0);

    //180 turn around x axis
    q = new ape.Quat(1, 0, 0, 0);
    q.getEulerAngles(e);
    equal(e.x, 180);
    equal(e.y, 0);
    equal(e.z, 0);

    //noSure:180 turn around Y axis (note that 0, 180, 0 is equivalent to 180, 0, 180)
    q = new ape.Quat(0, 1, 0, 0);
    q.getEulerAngles(e);
    equal(e.x, 180);
    equal(e.y, 0);
    equal(e.z, 180);

    //180 turn around z axis
    q = new ape.Quat(0, 0, 1, 0);
    q.getEulerAngles(e);
    equal(e.x, 0);
    equal(e.y, 0);
    equal(e.z, 180);

    //90 turn around X axis
    q = new ape.Quat(Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    q.getEulerAngles(e);
    close(e.x, 90, 0.0001);
    equal(e.y, 0);
    equal(e.z, 0);

    //90 turn around Y axis
    q = new ape.Quat(0, Math.sqrt(0.5), 0, Math.sqrt(0.5));
    q.getEulerAngles(e);
    equal(e.x, 0);
    equal(e.y, 90);
    equal(e.z, 0);

    //90 turn around Z axis
    q = new ape.Quat(0, 0, Math.sqrt(0.5), Math.sqrt(0.5));
    q.getEulerAngles(e);
    equal(e.x, 0);
    equal(e.y, 0);
    close(e.z, 90, 0.0001);

    //-90 turn around X axis
    q = new ape.Quat(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    q.getEulerAngles(e);
    close(e.x, -90, 0.0001);
    equal(e.y, 0);
    equal(e.z, 0);

    //-90 turn around Y axis
    q = new ape.Quat(0, -Math.sqrt(0.5), 0, Math.sqrt(0.5));
    q.getEulerAngles(e);
    equal(e.x, 0);
    equal(e.y, -90);
    equal(e.z, 0);

    //-90 turn around Z axis
    q = new ape.Quat(0, 0, -Math.sqrt(0.5), Math.sqrt(0.5));
    q.getEulerAngles(e);
    equal(e.x, 0);
    equal(e.y, 0);
    close(e.z, -90, 0.0001);
  });

  it("slerp: identical input quaternions", function () {
    qr = new ape.Quat();
    q1 = new ape.Quat().setFromEulerAngles(10, 20, 30);
    q2 = new ape.Quat().setFromEulerAngles(10, 20, 30);

    qr.slerp(q1, q2, 0);
    equal(qr.x, q1.x);
    equal(qr.y, q1.y);
    equal(qr.z, q1.z);
    equal(qr.w, q1.w);

    qr.slerp(q1, q2, 0.5);
    equal(qr.x, q1.x);
    equal(qr.y, q1.y);
    equal(qr.z, q1.z);
    equal(qr.w, q1.w);

    qr.slerp(q1, q2, 1);
    equal(qr.x, q1.x);
    equal(qr.y, q1.y);
    equal(qr.z, q1.z);
    equal(qr.w, q1.w);
  });

  it("slerp: different input quaternions", function () {
    qr = new ape.Quat();
    q1 = new ape.Quat().setFromEulerAngles(10, 20, 30);
    q2 = new ape.Quat().setFromEulerAngles(40, 50, 60);

    qr.slerp(q1, q2, 0);
    close(qr.x, q1.x, 0.0001);
    close(qr.y, q1.y, 0.0001);
    close(qr.z, q1.z, 0.0001);
    close(qr.w, q1.w, 0.0001);

    qr.slerp(q1, q2, 1);
    close(qr.x, q2.x, 0.0001);
    close(qr.y, q2.y, 0.0001);
    close(qr.z, q2.z, 0.0001);
    close(qr.w, q2.w, 0.0001);
  });
});
