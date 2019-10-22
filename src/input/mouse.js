Object.assign(ape, function () {

  var MouseEvent = function (mouse, event) {
    var coords = {
      x: 0,
      y: 0
    };

    if (event) {
      if (event instanceof MouseEvent) {
        throw Error("Expected MouseEvent");
      }
      coords = mouse._getTargetCoords(event);
    } else {
      event = {};
    }

    if (coords) {
      this.x = coords.x;
      this.y = coords.y;
    } else if (ape.Mouse.isPointerLocked()) {
      this.x = 0;
      this.y = 0;
    } else {
      return;
    }
    // FF uses 'detail' and returns a value in 'no. of lines' to scroll
    // WebKit and Opera use 'wheelDelta', WebKit goes in multiples of 120 per wheel notch
    if (event.detail) {
      this.wheel = -1 * event.detail;
    } else if (event.wheelDelta) {
      this.wheel = event.wheelDelta/120;
    } else {
      this.wheel = 0;
    }
    // Get the movement delta in this event
    if (ape.Mouse.isPointerLocked()) {
      this.dx = event.movementX || event.webkitMovementX || event.mozMovementX || 0;
      this.dy = event.movementY || event.webkitMovementY || event.mozMovementY || 0;
    } else {
      this.dx = this.x - mouse._lastX;
      this.dy = this.y - mouse._lastY;
    }

    if (event.type === 'mousedown' || event.type === 'mouseup') {
        this.button = event.button;
    } else {
        this.button = ape.MOUSEBUTTON_NONE;
    }
    this.buttons = mouse._buttons.slice(0);
    this.element = event.target;

    this.ctrlKey = event.ctrlKey || false;
    this.altKey = event.altKey || false;
    this.shiftKey = event.shiftKey || false;
    this.metaKey = event.metaKey || false;

    this.event = event;
  };
  'use strict';
  var Mouse = function (element) {
    //clear the mouse state
    this._lastX   = 0;
    this._lastY   = 0;
    this._buttons       = [false,false,false];
    this._lastbuttons   = [false,false,false];

    // Setup event handlers so they are bound to the correct 'this'
    this._upHandler = this._handleUp.bind(this);
    this._downHandler = this._handleDown.bind(this);
    this._moveHandler = this._handleMove.bind(this);
    this._wheelHandler = this._handleWheel.bind(this);
    this._contextMenuHandler = function (event) {
        event.preventDefault();
    };

    this._target = null;
    this._attached = false;
    this.attach(element);
    // Add events
    ape.events.attach(this);
  };
  Mouse.isPointerLocked = function () {
    return !!(document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement);
  };
  Object.assign(Mouse.prototype,{
    attach: function (element) {
      this._target = element;

      if (this._attached) return;
      this._attached = true;

      window.addEventListener("mouseup", this._upHandler, false);
      window.addEventListener("mousedown", this._downHandler, false);
      window.addEventListener("mousemove", this._moveHandler, false);
      window.addEventListener("mousewheel", this._wheelHandler, false); // WekKit
      window.addEventListener("DOMMouseScroll", this._wheelHandler, false); // Gecko
    },
    detach: function () {
      if (!this._attached) return;
      this._attached = false;
      this._target = null;

      window.removeEventListener("mouseup", this._upHandler);
      window.removeEventListener("mousedown", this._downHandler);
      window.removeEventListener("mousemove", this._moveHandler);
      window.removeEventListener("mousewheel", this._wheelHandler); // WekKit
      window.removeEventListener("DOMMouseScroll", this._wheelHandler); // Gecko
    },
    disableContextMenu: function () {
      if (!this._target) return;
      this._target.addEventListener("contextmenu", this._contextMenuHandler);
    },
    enableContextMenu: function () {
      if (!this._target) return;
      this._target.removeEventListener("contextmenu", this._contextMenuHandler);
    },
    enablePointerLock: function (success, error) {
      if (!document.body.requestPointerLock) {
          if (error)
              error();

          return;
      }

      var s = function () {
          success();
          document.removeEventListener('pointerlockchange', s);
      };
      var e = function () {
          error();
          document.removeEventListener('pointerlockerror', e);
      };

      if (success) {
          document.addEventListener('pointerlockchange', s, false);
      }

      if (error) {
          document.addEventListener('pointerlockerror', e, false);
      }

      document.body.requestPointerLock();
    },
    disablePointerLock: function (success) {
      if (!document.exitPointerLock) {
          return;
      }

      var s = function () {
          success();
          document.removeEventListener('pointerlockchange', s);
      };
      if (success) {
          document.addEventListener('pointerlockchange', s, false);
      }
      document.exitPointerLock();
    },
    update: function () {
      //copy current button state
      this._lastbuttons[0] = this._buttons[0];
      this._lastbuttons[1] = this._buttons[1];
      this._lastbuttons[2] = this._buttons[2];
    },
    isPressed: function (button) {
      return this._buttons[button];
    },
    wasPressed: function (button) {
      return (this._buttons[button] && !this._lastbuttons[button]);
    },
    wasReleased: function (button) {
      return (!this._buttons[button] && this._lastbuttons[button]);
    },
    _handleUp: function (event) {
        // disable released button
        this._buttons[event.button] = false;
        var e = new MouseEvent(this, event);
        if (!e.event) return;
        // send 'mouseup' event
        this.fire(ape.EVENT_MOUSEUP, e);
    },
    _handleDown: function (event) {
      // Store which button has affected
      this._buttons[event.button] = true;

      var e = new MouseEvent(this, event);
      if (!e.event) return;

      this.fire(ape.EVENT_MOUSEDOWN, e);
    },
    _handleMove: function (event) {
      var e = new MouseEvent(this, event);
      if (!e.event) return;

      this.fire(ape.EVENT_MOUSEMOVE, e);

      // Store the last offset position to calculate deltas
      this._lastX = e.x;
      this._lastY = e.y;
    },
    _handleWheel: function (event) {
      var e = new MouseEvent(this, event);
      if (!e.event) return;

      this.fire(ape.EVENT_MOUSEWHEEL, e);
    },
    _getTargetCoords: function (event) {
      var rect = this._target.getBoundingClientRect();
      var left = Math.floor(rect.left);
      var top = Math.floor(rect.top);

      // mouse is outside of canvas
      if (event.clientX < left ||
          event.clientX >= left + this._target.clientWidth ||
          event.clientY < top ||
          event.clientY >= top + this._target.clientHeight) {

          return null;
      }

      return {
          x: event.clientX - left,
          y: event.clientY - top
      };
    }

  });
  //return public interface
  return {
    Mouse: Mouse,
    MouseEvent: MouseEvent
  };
}());
