Object.assign(ape, function () {
  var Controller = function (element, options) {
    options = options || {};
    this._keyboard = options.keyboard || null;
    this._mouse = options.mouse || null;
    this._gamepads = options.gamepads || null;

    this._element = null;

    this._actions = {};
    this._axes = {};
    this._axesValues = {};

    if (element) {
      this.attach(element);
    }
  };

  Controller.prototype.attach = function (element) {
    this._element = element;
    if (this._keyboard) {
      this._keyboard.attach(element);
    }
    if (this._mouse) {
      this._mouse.attach(element);
    }
  };

  Controller.prototype.detach = function () {
    if (this._keyboard) {
      this._keyboard.detach();
    }
    if (this._mouse) {
      this._mouse.detach();
    }
    this._element = null;
  };

  Controller.prototype.disableContextMenu = function () {
    if (!this._mouse) {
      this._enableMouse();
    }
    this._mouse.disableContextMenu();
  };

  Controller.prototype.enableContextMenu = function () {
    if (!this._mouse) {
      this._enableMouse();
    }
    this._mouse.enableContextMenu();
  };

  Controller.prototype.update = function (dt) {
    if (this._keyboard) {
      this._keyboard.update(dt);
    }
    if (this._mouse) {
      this._mouse.update(dt);
    }
    if (this._gamepads) {
      this._gamepads.update(dt);
    }
    //clear axes values
    this._axesValues = {};
    for (var key in this._axes) {
      this._axesValues[key] = [];
    }
  };

  Controller.prototype.registerKeys = function (action, keys) {
    if (!this._keyboard) {
      this._enableKeyboard();
    }
    if (this._actions[action]) {
      throw new Error(ape.string.format("Action: {0} already registered", action));
    }
    if (keys === undefined) {
      throw new Error('Invalid button');
    }
    //convert to an array, stop and have a look for a while
    if (!keys.length) {
      keys = [keys];
    }
    if (this._actions[action]) {
      this._actions[action].push({
        type: ape.ACTION_KEYBOARD,
        keys: keys
      });
    } else {
      this._actions[action] = [{
        type: ape.ACTION_KEYBOARD,
        keys: keys
      }];
    }
  };

  Controller.prototype.registerMouse = function (action, button) {
    if (!this._mouse) {
      this._enableMouse();
    }
    if (button === undefined) {
      throw new Error('Invalid button');
    }
    //Mouse actions are stored as negative numbers
    //to prevent clashing with keycodes
    if (this._actions[action]) {
      this._actions[action].push({
        type: ape.ACTION_MOUSE,
        button: button
      });
    } else {
      this._actions[action] = [{
        type: ape.ACTION_MOUSE,
        button: -button
      }];
    }
  };

  Controller.prototype.registerPadButton = function (action, pad, button) {
    if (button === undefined) {
      throw new Error('Invalid button');
    }
    //Mouse actions are stored as negative numbers
    //to prevent clashing with keycodes
    if (this._actions[action]) {
      this._actions[action].push({
        type: ape.ACTION_GAMEPAD,
        button: button,
        pad: pad
      });
    } else {
      this._actions[action] = [{
        type: ape.ACTION_GAMEPAD,
        button: button,
        pad: pad
      }];
    }
  };

  Controller.prototype.registerAxis = function (options) {
    var name = options.name;
    if (!this._axes[name]) {}
    var i = this._axes[name].push(name);

    options = option || {};
    options.pad = options.pad || ape.PAD_1;

    var bind = function (controller, source, value, key){
      switch (source) {
                case 'mousex':
                    controller._mouse.on(ape.EVENT_MOUSEMOVE, function (e) {
                        controller._axesValues[name][i] = e.dx / 10;
                    });
                    break;
                case 'mousey':
                    controller._mouse.on(ape.EVENT_MOUSEMOVE, function (e) {
                        controller._axesValues[name][i] = e.dy / 10;
                    });
                    break;
                case 'key':
                    controller._axes[name].push(function () {
                        return controller._keyboard.isPressed(key) ? value : 0;
                    });
                    break;
                case 'padrx':
                    controller._axes[name].push(function () {
                        return controller._gamepads.getAxis(options.pad, ape.PAD_R_STICK_X);
                    });
                    break;
                case 'padry':
                    controller._axes[name].push(function () {
                        return controller._gamepads.getAxis(options.pad, ape.PAD_R_STICK_Y);
                    });
                    break;
                case 'padlx':
                    controller._axes[name].push(function () {
                        return controller._gamepads.getAxis(options.pad, ape.PAD_L_STICK_X);
                    });
                    break;
                case 'padly':
                    controller._axes[name].push(function () {
                        return controller._gamepads.getAxis(options.pad, ape.PAD_L_STICK_Y);
                    });
                    break;
                default:
                    throw new Error('Unknown axis');
            }
    };
    bind(this, options.positive, 1, options.positiveKey);
    if (options.negativeKey || options.negative !== options.positive) {
      bind(this, options.negative, -1, options.negativeKey);
    }
  };

  Controller.prototype.isPressed = function (actionName) {
    if (!this._actions[actionName]) {
      return false;
    }
    var action;
    var index = 0;
    var length = this._actions[actionName].length;

    for (index = 0; index < length; ++index) {
      action = this._actions[actionName][index];
      switch (action.type) {
                case ape.ACTION_KEYBOARD:
                    if (this._keyboard) {
                        var i, len = action.keys.length;
                        for (i = 0; i < len; i++) {
                            if (this._keyboard.isPressed(action.keys[i])) {
                                return true;
                            }
                        }
                    }
                    break;
                case ape.ACTION_MOUSE:
                    if (this._mouse && this._mouse.isPressed(action.button)) {
                        return true;
                    }
                    break;
                case ape.ACTION_GAMEPAD:
                    if (this._gamepads && this._gamepads.isPressed(action.pad, action.button)) {
                        return true;
                    }
                    break;
            }
    }
    return false;
  };

  Controller.prototype.wasPressed = function (actionName) {
    if (!this._actions[actionName]) {
      return false;
    }
    var index = 0;
    var length = this._actions[actionName].length;
    for (index = 0; index < length; ++index) {
      var action = this._actions[actionName][index];
      switch (action.type) {
        case ape.ACTION_KEYBOARD:
          if (this._keyboard) {
            var i, len = action.keys.length;
            for (i = 0; i < len; i++) {
              if (this._keyboard.wasPressed(action.keys[i])) {
                return true;
              }
            }
          }
          break;
        case ape.ACTION_MOUSE:
          if (this._mouse && this._mouse.wasPressed(action.button)){
            return true;
          }
          break;
        case ape.ACTION_GAMEPAD:
          if (this._gamepads && this._gamepads.wasPressed(action.pad, action.button)){
            return true;
          }
          break;
      }
    }
    return false;
  };

  Controller.prototype.getAxis = function (name) {
    var value = 0;

    if (this._axes[name]) {
        var i, len = this._axes[name].length;
        for (i = 0; i < len; i++) {
            if (ape.type(this._axes[name][i]) === 'function') {
                var v = this._axes[name][i]();
                if (Math.abs(v) > Math.abs(value)) {
                    value = v;
                }
            } else if (this._axesValues[name]) {
                if (Math.abs(this._axesValues[name][i]) > Math.abs(value)) {
                    value = this._axesValues[name][i];
                }
            }
        }
    }

    return value;
  };

  Controller.prototype._enableMouse = function () {
    this._mouse = new ape.Mouse();
    if (!this._element) {
      throw new Error("Controller must be attached to an Element");
    }
    this._mouse.attach(this._element);
  };

  Controller.prototype._enableKeyboard = function () {
    this._keyboard = new ape.Keyboard();
    if (!this._element) {
      throw new Error("Controller must be attached to an Element");
    }
    this._keyboard.attach(this._element);
  };

  return {
    Controller: Controller
  };
}());
