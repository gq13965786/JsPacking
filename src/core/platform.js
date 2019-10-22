Object.assign(ape, function () {
    /**
     * if (ape.platform.touch) {
     *     // touch is supported
     * }
     */
    var platform = {
        desktop: false,
        mobile: false,
        ios: false,
        android: false,
        windows: false,
        cocoonjs: false,
        xbox: false,
        gamepads: false,
        touch: false,
        workers: false
    };

    var ua = navigator.userAgent;

    if (/(windows|mac os|linux|cros)/i.test(ua))
        platform.desktop = true;

    if (/xbox/i.test(ua))
        platform.xbox = true;

    if (/(windows phone|iemobile|wpdesktop)/i.test(ua)) {
        platform.desktop = false;
        platform.mobile = true;
        platform.windows = true;
    } else if (/android/i.test(ua)) {
        platform.desktop = false;
        platform.mobile = true;
        platform.android = true;
    } else if (/ip([ao]d|hone)/i.test(ua)) {
        platform.desktop = false;
        platform.mobile = true;
        platform.ios = true;
    }

    if (navigator.isCocoonJS)
        platform.cocoonjs = true;

    platform.touch = 'ontouchstart' in window || ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0);

    platform.gamepads = 'getGamepads' in navigator;

    platform.workers = (typeof(Worker) !== 'undefined');

    return {
        platform: platform
    };
}());
