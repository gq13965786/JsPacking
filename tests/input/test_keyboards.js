describe('ape.keyboard', function () {
  var k;

  beforeEach(function () {
    k = new ape.Keyboard();
    k.attach(document.body);
  });
  afterEach(function () {
    k.detach();
    delete k;
  });

  function pressAndRelease(keyCode) {
    simulate(document.body, 'keydown', {
      keyCode: keyCode
    });
    simulate(document.body, 'keypress', {
      keyCode: keyCode
    });
    simulate(document.body, 'keyup', {
      keyCode: keyCode
    });
  }

  function press(keyCode) {
    simulate(document.body, 'keydown', {
      keyCode: keyCode
    });
    simulate(document.body, 'keypress', {
      keyCode: keyCode
    });
  }

  function pressSpecialChar(keyCode) {
    simulate(document.body, 'keydown', {
      keyCode: keyCode
    });
  }

  function pressAndHold(keyCode) {
    press(keyCode);
    press(keyCode);
  }

  function release(keyCode) {
    simulate(document.body, 'keyup', {
      keyCode: keyCode
    });
  }

  it("Object Exists", function () {
    ok(ape.Keyboard);
  });
  it("keydown A", function () {
    k.on(ape.EVENT_KEYDOWN, function (event) {
      equal(event.key, ape.KEY_A);
      equal(event.element, document.body);
      ok(event.event);
    });

    simulate(document.body, 'keydown', {
      keyCode: ape.KEY_A
    });
  });
  it("keydown Left arrow", function () {
    k.on(ape.EVENT_KEYDOWN, function (event) {
      equal(event.key, ape.KEY_F1);
      equal(event.element, document.body);
      ok(event.event);
    });

    simulate(document.body, 'keydown', {
      keyCode: ape.KEY_F1
    });
  });
  it("keydown F1", function () {
    k.on(ape.EVENT_KEYDOWN, function (event) {
      equal(event.key, ape.KEY_F1);
      equal(event.element, document.body);
      ok(event.event);
    });

    simulate(document.body, 'keydown', {
      keyCode: ape.KEY_F1
    });
  });
  it("keyup A ", function () {
    k.on(ape.EVENT_KEYUP, function (event) {
      equal(event.key, ape.KEY_A);
      equal(event.element, document.body);
      ok(event.event);
    });

    simulate(document.body, 'keyup', {
      keyCode: ape.KEY_A
    });
  });
  it("keyup Left arrow", function () {
    k.on(ape.EVENT_KEYUP, function (event) {
      equal(event.key, ape.KEY_LEFT);
      equal(event.element, document.body);
      ok(event.event);
    });

    simulate(document.body, 'keyup', {
      keyCode: ape.KEY_LEFT
    });
  });
  it("keyup F1", function () {
    k.on(ape.EVENT_KEYUP, function (event) {
      equal(event.key, ape.KEY_F1);
      equal(event.element, document.body);
      ok(event.event);
    });

    simulate(document.body, 'keyup', {
      keyCode: ape.KEY_F1
    });
  });
  it("isPressed", function () {
    press(ape.KEY_A);//simulation
    ok(k.isPressed(ape.KEY_A));
    k.update();
    ok(k.isPressed(ape.KEY_A));
  });
  it("isPressed: released", function () {
    pressAndRelease(ape.KEY_A);
    equal(k.isPressed(ape.KEY_A), false);
  });
  it("isPressed: hold", function () {
    pressAndHold(ape.KEY_A);
    equal(k.isPressed(ape.KEY_A), true);
  });
  it("wasPressed", function () {
    press(ape.KEY_A);
    equal(k.wasPressed(ape.KEY_A), true);
    k.update();
    equal(k.wasPressed(ape.KEY_A), false);
  });
  it("wasReleased", function () {
    press(ape.KEY_A);
    equal(k.wasReleased(ape.KEY_A), false);
    k.update();
    release(ape.KEY_A);
    equal(k.wasReleased(ape.KEY_A), true);
  });

});
