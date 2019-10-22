Object.assign(ape, function () {
  var GamePads = function () {
    this.gamepadsSupported = !!navigator.getGamepads || !!navigator.webkitGetGamepads;

    this.current = [];
    this.previous = [];

    this.deadZone = 0.25;
  };

  var MAPS = {
      DEFAULT: {
          buttons: [
              // Face buttons
              'PAD_FACE_1',
              'PAD_FACE_2',
              'PAD_FACE_3',
              'PAD_FACE_4',

              // Shoulder buttons
              'PAD_L_SHOULDER_1',
              'PAD_R_SHOULDER_1',
              'PAD_L_SHOULDER_2',
              'PAD_R_SHOULDER_2',

              // Other buttons
              'PAD_SELECT',
              'PAD_START',
              'PAD_L_STICK_BUTTON',
              'PAD_R_STICK_BUTTON',

              // D Pad
              'PAD_UP',
              'PAD_DOWN',
              'PAD_LEFT',
              'PAD_RIGHT',

               // Vendor specific button
              'PAD_VENDOR'
          ],

          axes: [
              // Analogue Sticks
              'PAD_L_STICK_X',
              'PAD_L_STICK_Y',
              'PAD_R_STICK_X',
              'PAD_R_STICK_Y'
          ]
      },

      PS3: {
          buttons: [
              // X, O, TRI, SQ
              'PAD_FACE_1',
              'PAD_FACE_2',
              'PAD_FACE_4',
              'PAD_FACE_3',

              // Shoulder buttons
              'PAD_L_SHOULDER_1',
              'PAD_R_SHOULDER_1',
              'PAD_L_SHOULDER_2',
              'PAD_R_SHOULDER_2',

              // Other buttons
              'PAD_SELECT',
              'PAD_START',
              'PAD_L_STICK_BUTTON',
              'PAD_R_STICK_BUTTON',

              // D Pad
              'PAD_UP',
              'PAD_DOWN',
              'PAD_LEFT',
              'PAD_RIGHT',

              'PAD_VENDOR'
          ],

          axes: [
              // Analogue Sticks
              'PAD_L_STICK_X',
              'PAD_L_STICK_Y',
              'PAD_R_STICK_X',
              'PAD_R_STICK_Y'
          ]
      }
  };

  var PRODUCT_CODES = {
      'Product: 0268': 'PS3'
  };

  Object.assign(GamePads.prototype, {
    update: function () {
          var i, j, l;
          var buttons, buttonsLen;

          // move current buttons status into previous array
          for (i = 0, l = this.current.length; i < l; i++) {
              buttons = this.current[i].pad.buttons;
              buttonsLen = buttons.length;
              for (j = 0; j < buttonsLen; j++) {
                  if (this.previous[i] === undefined) {
                      this.previous[i] = [];
                  }
                  this.previous[i][j] = buttons[j].pressed;
              }
          }

          // update current
          var pads = this.poll();
          for (i = 0, l = pads.length; i < l; i++) {
              this.current[i] = pads[i];
          }
      },
    poll: function () {
        var pads = [];
        if (this.gamepadsSupported) {
            var padDevices = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads();
            var i, len = padDevices.length;
            for (i = 0; i < len; i++) {
                if (padDevices[i]) {
                    pads.push({
                        map: this.getMap(padDevices[i]),
                        pad: padDevices[i]
                    });
                }
            }
        }
        return pads;
    },
    getMap: function (pad) {
      for (var code in PRODUCT_CODES) { //support ps3
        if (pad.id.indexOf(code) >= 0) {
          return MAPS[PRODUCT_CODES[code]];
        }
      }
      return MAPS.DEFAULT;
    },
    isPressed: function (index, button) {
      if (!this.current[index]) {
          return false;
      }

      var key = this.current[index].map.buttons[button];
      return this.current[index].pad.buttons[ape[key]].pressed;
    },
    wasPressed: function (index, button) {
      if (!this.current[index]) {
          return false;
      }

      var key = this.current[index].map.buttons[button];
      var i = ape[key];
      return this.current[index].pad.buttons[i].pressed && !this.previous[index][i];
    },
    getAxis: function (index, axes) {
      if (!this.current[index]) {
          return false;
      }

      var key = this.current[index].map.axes[axes];
      var value = this.current[index].pad.axes[ape[key]];

      if (Math.abs(value) < this.deadZone) {
          value = 0;
      }
      return value;
    }
  });

  return {
    GamePads: GamePads
  };
}());
