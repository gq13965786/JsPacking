(function () {
    // Input API enums
    var enums = {
        ACTION_MOUSE: 'mouse',
        ACTION_KEYBOARD: 'keyboard',
        ACTION_GAMEPAD: 'gamepad',

        AXIS_MOUSE_X: 'mousex',
        AXIS_MOUSE_Y: 'mousey',
        AXIS_PAD_L_X: 'padlx',
        AXIS_PAD_L_Y: 'padly',
        AXIS_PAD_R_X: 'padrx',
        AXIS_PAD_R_Y: 'padry',
        AXIS_KEY: 'key',

        EVENT_KEYDOWN: 'keydown',
        EVENT_KEYUP: 'keyup',

        EVENT_MOUSEDOWN: "mousedown",
        EVENT_MOUSEMOVE: "mousemove",
        EVENT_MOUSEUP: "mouseup",
        EVENT_MOUSEWHEEL: "mousewheel",

        EVENT_TOUCHSTART: 'touchstart',
        EVENT_TOUCHEND: 'touchend',
        EVENT_TOUCHMOVE: 'touchmove',
        EVENT_TOUCHCANCEL: 'touchcancel',
//////////////keyboard begins
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ENTER: 13,
        KEY_SHIFT: 16,
        KEY_CONTROL: 17,
        KEY_ALT: 18,
        KEY_PAUSE: 19,
        KEY_CAPS_LOCK: 20,
        KEY_ESCAPE: 27,
        KEY_SPACE: 32,
        KEY_PAGE_UP: 33,
        KEY_PAGE_DOWN: 34,
        KEY_END: 35,
        KEY_HOME: 36,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_PRINT_SCREEN: 44,
        KEY_INSERT: 45,
        KEY_DELETE: 46,
        KEY_0: 48,
        KEY_1: 49,
        KEY_2: 50,
        KEY_3: 51,
        KEY_4: 52,
        KEY_5: 53,
        KEY_6: 54,
        KEY_7: 55,
        KEY_8: 56,
        KEY_9: 57,
        KEY_SEMICOLON: 59,
        KEY_EQUAL: 61,
        KEY_A: 65,
        KEY_B: 66,
        KEY_C: 67,
        KEY_D: 68,
        KEY_E: 69,
        KEY_F: 70,
        KEY_G: 71,
        KEY_H: 72,
        KEY_I: 73,
        KEY_J: 74,
        KEY_K: 75,
        KEY_L: 76,
        KEY_M: 77,
        KEY_N: 78,
        KEY_O: 79,
        KEY_P: 80,
        KEY_Q: 81,
        KEY_R: 82,
        KEY_S: 83,
        KEY_T: 84,
        KEY_U: 85,
        KEY_V: 86,
        KEY_W: 87,
        KEY_X: 88,
        KEY_Y: 89,
        KEY_Z: 90,

        KEY_WINDOWS: 91,
        KEY_CONTEXT_MENU: 93,

        KEY_NUMPAD_0: 96,
        KEY_NUMPAD_1: 97,
        KEY_NUMPAD_2: 98,
        KEY_NUMPAD_3: 99,
        KEY_NUMPAD_4: 100,
        KEY_NUMPAD_5: 101,
        KEY_NUMPAD_6: 102,
        KEY_NUMPAD_7: 103,
        KEY_NUMPAD_8: 104,
        KEY_NUMPAD_9: 105,
        KEY_MULTIPLY: 106,
        KEY_ADD: 107,
        KEY_SEPARATOR: 108,
        KEY_SUBTRACT: 109,
        KEY_DECIMAL: 110,
        KEY_DIVIDE: 111,

        KEY_F1: 112,
        KEY_F2: 113,
        KEY_F3: 114,
        KEY_F4: 115,
        KEY_F5: 116,
        KEY_F6: 117,
        KEY_F7: 118,
        KEY_F8: 119,
        KEY_F9: 120,
        KEY_F10: 121,
        KEY_F11: 122,
        KEY_F12: 123,

        KEY_COMMA: 188,
        KEY_PERIOD: 190,
        KEY_SLASH: 191,
        KEY_OPEN_BRACKET: 219,
        KEY_BACK_SLASH: 220,
        KEY_CLOSE_BRACKET: 221,
        KEY_META: 224,
        MOUSEBUTTON_NONE: -1,
        MOUSEBUTTON_LEFT: 0,
        MOUSEBUTTON_MIDDLE: 1,
        MOUSEBUTTON_RIGHT: 2,
////////////////keyboard ends
////////////////pads //////////////////
        PAD_1: 0,//Index for pad 1
        PAD_2: 1,//Index for pad 2
        PAD_3: 2,//Index for pad 3
        PAD_4: 3,//Index for pad 4
        PAD_FACE_1: 0,//The first face button, from bottom going clockwise
        PAD_FACE_2: 1,//The second face button, from bottom going clockwise
        PAD_FACE_3: 2,//The third face button, from bottom going clockwise
        PAD_FACE_4: 3,//The fourth face button, from bottom going clockwise
        PAD_L_SHOULDER_1: 4,//The first shoulder button on the left
        PAD_R_SHOULDER_1: 5,//The first shoulder button on the right
        PAD_L_SHOULDER_2: 6,//The second shoulder button on the left
        PAD_R_SHOULDER_2: 7,//The second shoulder button on the right
        PAD_SELECT: 8,//The select button
        PAD_START: 9,//The start button
        PAD_L_STICK_BUTTON: 10,//The button when depressing the left analogue stick
        PAD_R_STICK_BUTTON: 11,//The button when depressing the right analogue stick
        PAD_UP: 12,//Direction pad up
        PAD_DOWN: 13,//Direction pad down
        PAD_LEFT: 14,//Direction pad left
        PAD_RIGHT: 15,//Direction pad right
        PAD_VENDOR: 16,//Vendor specific button
        PAD_L_STICK_X: 0,//Horizontal axis on the left analogue stick
        PAD_L_STICK_Y: 1,//Vertical axis on the left analogue stick
        PAD_R_STICK_X: 2,//Horizontal axis on the right analogue stick
        PAD_R_STICK_Y: 3//Vertical axis on the right analogue stick
    };

    Object.assign(ape, enums);
}());
