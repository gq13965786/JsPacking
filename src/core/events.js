/*//subscribe to an event
 *obj.on('hello', function(str) {
 *  console.log('event hello is fired', str);
 *})
 *
 *obj.fire('hello','world');
 */
 //events in application

ape.events = {
  attach: function (target) {
    var ev = ape.events;
    target.on = ev.on;
    target.off = ev.off;
    target.fire = ev.fire;
    target.once = ev.once;
    target.hasEvent = ev.hasEvent;
    target._callbackActive = {};
    return target;
  },
  on: function (name, callback, scope) {
    if (!name || typeof name !== 'string' || !callback)
        return this;

    if (!this._callbacks)
        this._callbacks = { };

    if (!this._callbacks[name])
        this._callbacks[name] = [];

    if (!this._callbackActive)
        this._callbackActive = { };

    if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name])
        this._callbackActive[name] = this._callbackActive[name].slice();

    this._callbacks[name].push({
        callback: callback,
        scope: scope || this
    });

    return this;
  },
  off: function (name, callback, scope) {
    if (!this._callbacks)
        return this;

    if (this._callbackActive) {
        if (name) {
            if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name])
                this._callbackActive[name] = this._callbackActive[name].slice();
        } else {
            for (var key in this._callbackActive) {
                if (!this._callbacks[key])
                    continue;

                if (this._callbacks[key] !== this._callbackActive[key])
                    continue;

                this._callbackActive[key] = this._callbackActive[key].slice();
            }
        }
    }

    if (!name) {
        this._callbacks = null;
    } else if (!callback) {
        if (this._callbacks[name])
            delete this._callbacks[name];
    } else {
        var events = this._callbacks[name];
        if (!events)
            return this;

        var i = events.length;

        while (i--) {
            if (events[i].callback !== callback)
                continue;

            if (scope && events[i].scope !== scope)
                continue;

            events.splice(i, 1);
        }
    }

    return this;
  },
  fire: function (name, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8){
    if (!name || !this._callbacks || !this._callbacks[name])
        return this;

    var callbacks;

    if (!this._callbackActive)
        this._callbackActive = { };

    if (!this._callbackActive[name]) {
        this._callbackActive[name] = this._callbacks[name];
    } else {
        if (this._callbackActive[name] === this._callbacks[name])
            this._callbackActive[name] = this._callbackActive[name].slice();

        callbacks = this._callbacks[name].slice();
    }

    // TODO: What does callbacks do here?
    // In particular this condition check looks wrong: (i < (callbacks || this._callbackActive[name]).length)
    // Because callbacks is not an integer
    // eslint-disable-next-line no-unmodified-loop-condition
    for (var i = 0; (callbacks || this._callbackActive[name]) && (i < (callbacks || this._callbackActive[name]).length); i++) {
        var evt = (callbacks || this._callbackActive[name])[i];
        evt.callback.call(evt.scope, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);

        if (evt.callback.once) {
            var ind = this._callbacks[name].indexOf(evt);
            if (ind !== -1) {
                if (this._callbackActive[name] === this._callbacks[name])
                    this._callbackActive[name] = this._callbackActive[name].slice();

                this._callbacks[name].splice(ind, 1);
            }
        }
    }

    if (!callbacks)
        this._callbackActive[name] = null;

    return this;   
  },
  once: function (name, callback, scope) {
    callback.once = true;
    this.on(name, callback, scope);
    return this;
  },
  hasEvent: function (name) {
    return (this._callbacks && this._callbacks[name] && this._callbacks[name].length !== 0) || false;
  }
};
