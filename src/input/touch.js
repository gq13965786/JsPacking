Object.assign(ape, function () {
  var Touch = function (touch) {
    var coords = ape.getTouchTargetCoords(touch);

    this.id = touch.identifier;
    this.x = coords.x;
    this.y = coords.y;
    this.target = touch.target;

    this.touch = touch;
  };

  var TouchEvent = function (device, event) {
    this.element = event.target;
    this.event = event;

    this.touches = [];
    this.changeTouches = [];

    if (event) {
      var i, l = event.touches.length;
      for (i = 0; i < l; i++) {
        this.touches.push(new Touch(event.touches[i]));
      }

      l = event.changedTouches.length;
      for (i = 0; i < l; i++) {
        this.changedTouches.push(new Touch(event.changedTouches[i]));
      }
    }
  };
  Object.assign(TouchEvent.prototype, {
    getTouchById: function (id, list) {
      var i, l = list.length;
      for (i = 0; i < l; i++) {
        if (list[i].id === id) {
          return list[i];
        }
      }

      return null;
    }
  });

  var TouchDevice = function (element) {
    this._element = null;

    this._startHandler = this._handleTouchStart.bind(this);
    this._endHandler = this._handleTouchEnd.bind(this);
    this._moveHandler = this._handleTouchMove.bind(this);
    this._cancelHandler = this._handleTouchCancel.bind(this);

    this.attach(element);
    ape.events.attach(this);
  };
  Object.assign(TouchDevice.prototype, {
    attach: function (element) {
      if (this._element) {
        this.detach();
      }
      this._element = element;
      this._element.addEventListener('touchstart', this._startHandler,false);
      this._element.addEventListener('touchend', this._endHandler,false);
      this._element.addEventListener('touchmove', this._moveHandler,false);
      this._element.addEventListener('touchcancel', this._cancelHandler,false);
    },
    detach: function () {
      if (this._element) {
          this._element.removeEventListener('touchstart', this._startHandler, false);
          this._element.removeEventListener('touchend', this._endHandler, false);
          this._element.removeEventListener('touchmove', this._moveHandler, false);
          this._element.removeEventListener('touchcancel', this._cancelHandler, false);
      }
      this._element = null;
    },
    _handleTouchStart: function (e) {
      this.fire('touchstart', new TouchEvent(this, e));
    },
    _handleTouchEnd: function (e) {
      this.fire('touchend', new TouchEvent(this, e));
    },
    _handleTouchMove: function (e) {
      // call preventDefault to avoid issues in Chrome Android:
      // http://wilsonpage.co.uk/touch-events-in-chrome-android/
      e.preventDefault();
      this.fire('touchmove', new TouchEvent(this, e));
    },
    _handleTouchCancel: function (e) {
      this.fire('touchcancel', new TouchEvent(this, e));
    }
  });

  return {
    getTouchTargetCoords: function (touch) {
      var totalOffsetX = 0;
      var totalOffsetY = 0;
      var target = touch.target;
      while(!(target instanceof HTMLElement)) {
        target = target.parentNode;
      }
      var currentElement = target;

      do {
          totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
          totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
          currentElement = currentElement.offsetParent;
      } while (currentElement);

      return {
          x: touch.pageX - totalOffsetX,
          y: touch.pageY - totalOffsetY
      };
    },

    TouchDevice: TouchDevice,
    TouchEvent: TouchEvent
  };
}());
