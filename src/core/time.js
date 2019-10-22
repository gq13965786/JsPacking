Object.assign(ape, (function () {
    /**
     * @private
     * @constructor
     * @name ape.Timer
     * @description Create a new Timer instance.
     * @classdesc A Timer counts milliseconds from when start() is called until when stop() is called.
     */
    var Timer = function Timer() {
        this._isRunning = false;
        this._a = 0;
        this._b = 0;
    };

    Object.assign(Timer.prototype, {
        /**
         * @private
         * @function
         * @name ape.Timer#start
         * @description Start the timer
         */
        start: function () {
            this._isRunning = true;
            this._a = ape.now();
        },

        /**
         * @private
         * @function
         * @name ape.Timer#stop
         * @description Stop the timer
         */
        stop: function () {
            this._isRunning = false;
            this._b = ape.now();
        },

        /**
         * @private
         * @function
         * @name ape.Timer#getMilliseconds
         * @description Get the number of milliseconds that passed between start() and stop() being called
         * @returns {Number} The elapsed milliseconds.
         */
        getMilliseconds: function () {
            return this._b - this._a;
        }
    });

    return {
        Timer: Timer,

        /**
         * @private
         * @function
         * @name ape.now
         * @description Get current time in milliseconds. Use it to measure time difference. Reference time may differ on different platforms.
         * @returns {Number} The time in milliseconds
         */
        now: (!window.performance || !window.performance.now || !window.performance.timing) ? Date.now : function () {
            return window.performance.now();
        }
    };
}()));
