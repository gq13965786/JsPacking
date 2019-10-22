describe('ape.mouse', function () {
  var m;

  beforeEach(function () {
    this.prevDocumentELementStyle = document.documentElement.style;
    this.prevBodyStyle = document.body.style;

    document.documentElement.style = "height: 100%;";
    document.body.style = "height: 100%;";

    m = new ape.Mouse();
    m.attach(document.body);
  });
  afterEach(function () {
    document.documentElement.style = this.prevDocumentELementStyle;
    document.body.style = this.prevBodyStyle;

    m.detach(document.body);
  });

  it("Object exists", function () {
    ok(ape.Mouse);
  });
  it("mousedown: middlebutton", function () {
    m.on(ape.EVENT_MOUSEMOVE, function (event) {
      equal(event.x, 8);
      equal(event.y, 8);
      equal(event.dx, 8);
      equal(event.dy, 8);
      equal(event.button, ape.MOUSEBUTTON_MIDDLE);
      equal(event.buttons[ape.MOUSEBUTTON_LEFT], false);
      equal(event.buttons[ape.MOUSEBUTTON_MIDDLE], true);
      equal(event.buttons[ape.MOUSEBUTTON_RIGHT], false);
      equal(event.element, document.body);
      ok(event.event);
    });

    simulate(document.body, 'mousedown', {
      button: ape.MOUSEBUTTON_MIDDLE
    });
  });
  it("mouseup: middlebutton", function () {
    m.on(ape.EVENT_MOUSEUP, function (event) {
        equal(event.x, 8);
        equal(event.y, 8);
        equal(event.dx, 8);
        equal(event.dy, 8);
        equal(event.button, ape.MOUSEBUTTON_MIDDLE);
        equal(event.buttons[ape.MOUSEBUTTON_LEFT], false);
        equal(event.buttons[ape.MOUSEBUTTON_MIDDLE], false);
        equal(event.buttons[ape.MOUSEBUTTON_RIGHT], false);
        equal(event.element, document.body);
        ok(event.event);
    });
    simulate(document.body, 'mouseup', {
      button: ape.MOUSEBUTTON_MIDDLE
    });
  });
  it("mousemove", function () {
    // move before event bound
    simulate(document.body, 'mousemove', {
        pointerX: 16,
        pointerY: 16
    });

    m.on(ape.EVENT_MOUSEMOVE, function (event) {
        equal(event.x, 24);
        equal(event.y, 24);
        equal(event.dx, 16);
        equal(event.dy, 16);
        equal(event.button, ape.MOUSEBUTTON_NONE);
        equal(event.buttons[ape.MOUSEBUTTON_LEFT], false);
        equal(event.buttons[ape.MOUSEBUTTON_MIDDLE], false);
        equal(event.buttons[ape.MOUSEBUTTON_RIGHT], false);
        equal(event.element, document.body);
        ok(event.event);
    });

    simulate(document.body, 'mousemove', {
        pointerX: 32,
        pointerY: 32
    });
  });
  it("mousewheel: fires", function () {
    m.on(ape.EVENT_MOUSEWHEEL, function (event) {
      equal(event.x, 8);
      equal(event.y, 8);
      equal(event.dx, 8);
      equal(event.dy, 8);
      equal(event.wheel, -120);
      equal(event.button, ape.MOUSEBUTTON_NONE);
      equal(event.buttons[ape.MOUSEBUTTON_LEFT], false);
      equal(event.buttons[ape.MOUSEBUTTON_MIDDLE], false);
      equal(event.buttons[ape.MOUSEBUTTON_RIGHT], false);
      ok(event.event);
      equal(event.element, document.body);
    });

    simulate(document.body, 'mousewheel', {
      detail: 120
    });
  });
  it("isPressed", function () {
    m.update();
    simulate(document.body, 'mousedown');
    equal(m.isPressed(ape.MOUSEBUTTON_LEFT), true);
    m.update();
    equal(m.isPressed(ape.MOUSEBUTTON_LEFT), true);
  });
  it("wasPressed", function () {
    m.update();
    simulate(document.body, 'mousedown');
    equal(m.wasPressed(ape.MOUSEBUTTON_LEFT), true);
    m.update();
    equal(m.wasPressed(ape.MOUSEBUTTON_LEFT), false);
  });
  it("wasReleased", function () {
    m.update();
    simulate(document.body, 'mousedown');
    equal(m.wasReleased(ape.MOUSEBUTTON_LEFT), false);
    m.update();
    simulate(document.body, 'mouseup');
    equal(m.wasReleased(ape.MOUSEBUTTON_LEFT), true);
  });

});
