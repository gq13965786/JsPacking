Object.assign(ape, function () {
  'use strict';

  var KeyboardEvent = function (keyboard, event) {
    if (event) {
      this.key = event.keyCode;
      this.element = event.target;
      this.event = event;
    } else {
      this.key = null;
      this.element = null;
      this.event = null;
    }
  };
  var _keyboardEvent = new KeyboardEvent();
  function makeKeyboardEvent(event) {
    _keyboardEvent.key = event.keyCode;
    _keyboardEvent.element = event.target;
    _keyboardEvent.event = event;
    return _keyboardEvent;
  }

  function toKeyCode(s) {
    if (typeof s === "string") {
      return s.toUpperCase().charCodeAt(0);
    }
    return s;
  }
  var _keyCodeToKeyIdentifier = {
    '9': 'Tab',
    '13': 'Enter',
    '16': 'Shift',
    '17': 'Control',
    '18': 'Alt',
    '27': 'Escape',

    '37': 'Left',
    '38': 'Up',
    '39': 'Right',
    '40': 'Down',

    '46': 'Delete',

    '91': 'Win'
  };

  var Keyboard = function (element, options) {
    options = options || {};
    this._element = null;

    this._keyDownHandler = this._handleKeyDown.bind(this);
    this._keyUpHandler = this._handleKeyUp.bind(this);
    this._keyPressHandler = this._handleKeyPress.bind(this);

    ape.events.attach(this);

    this._keymap = {};
    this._lastmap = {};

    if (element) {
        this.attach(element);
    }

    this.preventDefault = options.preventDefault || false;
    this.stopPropagation = options.stopPropagation || false;
  };
  Keyboard.prototype.attach = function (element) {
    if (this._element) {
        // remove previous attached element
        this.detach();
    }
    this._element = element;
    this._element.addEventListener("keydown", this._keyDownHandler, false);
    this._element.addEventListener("keypress", this._keyPressHandler, false);
    this._element.addEventListener("keyup", this._keyUpHandler, false);
  };
  Keyboard.prototype.detach = function () {
    this._element.removeEventListener("keydown", this._keyDownHandler);
    this._element.removeEventListener("keypress", this._keyPressHandler);
    this._element.removeEventListener("keyup", this._keyUpHandler);
    this._element = null;
  };
  Keyboard.prototype.toKeyIdentifier = function (keyCode) {
    keyCode = toKeyCode(keyCode);
    var count;
    var hex;
    var length;
    var id = _keyCodeToKeyIdentifier[keyCode.toString()];

    if (id) {
        return id;
    }

    // Convert to hex and add leading 0's
    hex = keyCode.toString(16).toUpperCase();
    length = hex.length;
    for (count = 0; count < (4 - length); count++) {
        hex = '0' + hex;
    }

    return 'U+' + hex;
  };
  Keyboard.prototype._handleKeyDown = function (event) {
    var code = event.keyCode || event.charCode;

    // Google Chrome auto-filling of login forms could raise a malformed event
    if (code === undefined) return;

    var id = this.toKeyIdentifier(code);

    this._keymap[id] = true;

    // Patch on the keyIdentifier property in non-webkit browsers
    // event.keyIdentifier = event.keyIdentifier || id;

    this.fire("keydown", makeKeyboardEvent(event));

    if (this.preventDefault) {
        event.preventDefault();
    }
    if (this.stopPropagation) {
        event.stopPropagation();
    }
  };
  Keyboard.prototype._handleKeyUp = function (event) {
    var code = event.keyCode || event.charCode;

    // Google Chrome auto-filling of login forms could raise a malformed event
    if (code === undefined) return;

    var id = this.toKeyIdentifier(code);

    delete this._keymap[id];

    // Patch on the keyIdentifier property in non-webkit browsers
    // event.keyIdentifier = event.keyIdentifier || id;

    this.fire("keyup", makeKeyboardEvent(event));

    if (this.preventDefault) {
        event.preventDefault();
    }
    if (this.stopPropagation) {
        event.stopPropagation();
    }
  };
  Keyboard.prototype._handleKeyPress = function (event) {
    this.fire("keypress", makeKeyboardEvent(event));

    if (this.preventDefault) {
        event.preventDefault();
    }
    if (this.stopPropagation) {
        event.stopPropagation();
    }
  };
  Keyboard.prototype.update = function () {
    var prop;

    // clear all keys
    for (prop in this._lastmap) {
        delete this._lastmap[prop];
    }

    for (prop in this._keymap) {
        if (this._keymap.hasOwnProperty(prop)) {
            this._lastmap[prop] = this._keymap[prop];
        }
    }
  };
  Keyboard.prototype.isPressed = function (key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);

    return !!(this._keymap[id]);
  };
  Keyboard.prototype.wasPressed = function (key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);

    return (!!(this._keymap[id]) && !!!(this._lastmap[id]));
  };
  Keyboard.prototype.wasReleased = function (key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);

    return (!!!(this._keymap[id]) && !!(this._lastmap[id]));
  };

  return {
    Keyboard: Keyboard,
    KeyboardEvent: KeyboardEvent
  };
}());
