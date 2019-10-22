Object.assign(ape, function () {
  var components = ['x', 'y', 'z', 'w'];
  var rawToValue = function (app, args, value, old) {
    var i;

    switch (args.type) {
        case 'boolean':
            return !!value;
        case 'number':
            if (typeof value === 'number') {
                return value;
            } else if (typeof value === 'string') {
                var v = parseInt(value, 10);
                if (isNaN(v)) return null;
                return v;
            } else if (typeof value === 'boolean') {
                return 0 + value;
            }
            return null;
        case 'json':
            if (typeof value === 'object') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (ex) {
                return null;
            }
        case 'asset':
            if (value instanceof ape.Asset) {
                return value;
            } else if (typeof value === 'number') {
                return app.assets.get(value) || null;
            } else if (typeof value === 'string') {
                return app.assets.get(parseInt(value, 10)) || null;
            }
            return null;
        case 'entity':
            if (value instanceof ape.GraphNode) {
                return value;
            } else if (typeof value === 'string') {
                return app.root.findByGuid(value);
            }
            return null;
        case 'rgb':
        case 'rgba':
            if (value instanceof ape.Color) {
                if (old instanceof ape.Color) {
                    old.copy(value);
                    return old;
                }
                return value.clone();
            } else if (value instanceof Array && value.length >= 3 && value.length <= 4) {
                for (i = 0; i < value.length; i++) {
                    if (typeof value[i] !== 'number')
                        return null;
                }
                if (!old) old = new ape.Color();

                old.r = value[0];
                old.g = value[1];
                old.b = value[2];
                old.a = (value.length === 3) ? 1 : value[3];

                return old;
            } else if (typeof value === 'string' && /#([0-9abcdef]{2}){3,4}/i.test(value)) {
                if (!old)
                    old = new ape.Color();

                old.fromString(value);
                return old;
            }
            return null;
        case 'vec2':
        case 'vec3':
        case 'vec4':
            var len = parseInt(args.type.slice(3), 10);

            if (value instanceof ape['Vec' + len]) {
                if (old instanceof ape['Vec' + len]) {
                    old.copy(value);
                    return old;
                }
                return value.clone();
            } else if (value instanceof Array && value.length === len) {
                for (i = 0; i < value.length; i++) {
                    if (typeof value[i] !== 'number')
                        return null;
                }
                if (!old) old = new ape['Vec' + len]();

                for (i = 0; i < len; i++)
                    old[components[i]] = value[i];

                return old;
            }
            return null;
        case 'curve':
            if (value) {
                var curve;
                if (value instanceof ape.Curve || value instanceof ape.CurveSet) {
                    curve = value.clone();
                } else {
                    var CurveType = value.keys[0] instanceof Array ? ape.CurveSet : ape.Curve;
                    curve = new CurveType(value.keys);
                    curve.type = value.type;
                }
                return curve;
            }
            break;
    }

    return value;
  };

  var ScriptAttributes = function (scriptType) {
    this.scriptType = scriptType;
    this.index = {};
  };
  ScriptAttributes.prototype.add = function (name, args) {
    if (this.index[name]) {
        // #ifdef DEBUG
        console.warn('attribute \'' + name + '\' is already defined for script type \'' + this.scriptType.name + '\'');
        // #endif
        return;
    } else if (ape.createScript.reservedAttributes[name]) {
        // #ifdef DEBUG
        console.warn('attribute \'' + name + '\' is a reserved attribute name');
        // #endif
        return;
    }

    this.index[name] = args;

    Object.defineProperty(this.scriptType.prototype, name, {
      get: function () {
        return this.__attributes[name];
      },
      set: function (raw) {
        var old = this.__attributes[name];
        // convert to appropriate type
        if (args.array) {
            this.__attributes[name] = [];
            if (raw) {
                var i;
                var len;
                for (i = 0, len = raw.length; i < len; i++) {
                    this.__attributes[name].push(rawToValue(this.app, args, raw[i], old ? old[i] : null));
                }
            }
        } else {
            this.__attributes[name] = rawToValue(this.app, args, raw, old);
        }

        this.fire('attr', name, this.__attributes[name], old);
        this.fire('attr:' + name, this.__attributes[name], old);
      }
    });
  };
  ScriptAttributes.prototype.remove = function (name) {
    if (!this.index[name])
        return false;

    delete this.index[name];
    delete this.scriptType.prototype[name];
    return true;
  };
  ScriptAttributes.prototype.has = function (name) {
    return !!this.index[name];
  };
  ScriptAttributes.prototype.get = function (name) {
    return this.index[name] || null;
  };

  var createScript = function (name, app) {
    if (ape.script.legacy) {
        // #ifdef DEBUG
        console.error("This project is using the legacy script system. You cannot call ape.createScript(). See: http://developer.playcanvas.com/en/user-manual/scripting/legacy/");
        // #endif
        return null;
    }

    if (createScript.reservedScripts[name])
        throw new Error('script name: \'' + name + '\' is reserved, please change script name');

    var script = function (args) {};
    script.__name = name;
    script.attribute = new ScriptAttributes(script);
    script.prototype.__initiallizeAttributes = function (force) {};
    script.extend = function (methods) {};
    Object.defineProperty(script.prototype, 'enabled', {
      get: function () {
        return this._enabled && !this._destroyed && this.entity.script.enabled && this.entity.enabled;
      },
      set: function (value) {
        this._enabled = !!value;

        if (this.enabled === this._enabledOld) return;

        this._enabledOld = this.enabled;
        this.fire(this.enabled ? 'enable' : 'disable');
        this.fire('state', this.enabled);

        if (!this._initialized && this.enabled) {
          this._initialized = true;
          this.__initiallizeAttributes(true);

          if (this.initialize)
              this.entity.script._scriptMethod(this, ape.ScriptComponent.scriptMethod.initialize);
        }
              // post initialize script if not post initialized yet and still enabled
              // (initilize might have disabled the script so check this.enabled again)
              // Warning: Do not do this if the script component is currently being enabled
              // because in this case post initialize must be called after all the scripts
              // in the script component have been initialized first
              if (this._initialized && !this._postInitialized && this.enabled && !this.entity.script._beingEnabled) {
                  this._postInitialized = true;

                  if (this.postInitialize)
                      this.entity.script._scriptMethod(this, ape.ScriptComponent.scriptMethods.postInitialize);
        }
      }
    });

    //add to scripts registry
    var registry = app ? app.scripts : ape.Application.getApplication().scripts;
    registry.add(script);
    ape.ScriptHandler._push(script);

    return script;
  };


  //reserved scripts
  createScript.reservedScripts = [
    'system', 'entity', 'create', 'destroy', 'swap', 'move',
    'scripts', '_scripts', '_scriptsIndex', '_scriptsData',
    'enabled', '_oldState', 'onEnable', 'onDisable', 'onPostStateChange',
    '_onSetEnabled', '_checkState', '_onBeforeRemove',
    '_onInitializeAttributes', '_onInitialize', '_onPostInitialize',
    '_onUpdate', '_onPostUpdate',
    '_callbacks', 'has', 'on', 'off', 'fire', 'once', 'hasEvent'
  ];
  var reservedScripts = {};
  var i;
  for (i = 0; i < createScript.reservedScripts.length; i++)
      reservedScripts[createScript.reservedScripts[i]] = 1;
  createScript.reservedScripts = reservedScripts;

  //reserved script attribute names
  createScript.reservedScripts = [
    'app', 'entity', 'enabled', '_enabled', '_enabledOld', '_destroyed',
    '__attributes', '__attributesRaw', '__scriptType', '__executionOrder',
    '_callbacks', 'has', 'on', 'off', 'fire', 'once', 'hasEvent'
  ];
  var reservedAttributes = {};
  for (i = 0; i < createScript.reservedAttributes.length; i++)
      reservedAttributes[createScript.reservedAttributes[i]] = 1;
  createScript.reservedAttributes = reservedAttributes;

  return {
    createScript: createScript
  };
});
