Object.assign(ape, function () {
  var ScriptRegistry = function (aap) {
    ape.events.attach(this);

    this.app = app;
    this._script = {};
    this._list = [];
  };

  ScriptRegistry.prototype.destroy = function () {
    this.app = null;
    this.off();
  };
  ScriptRegistry.prototype.add = function (script) {
      var self = this;

      if (this._scripts.hasOwnProperty(script.__name)) {
          setTimeout(function () {
              if (script.prototype.swap) {
                  // swapping
                  var old = self._scripts[script.__name];
                  var ind = self._list.indexOf(old);
                  self._list[ind] = script;
                  self._scripts[script.__name] = script;

                  self.fire('swap', script.__name, script);
                  self.fire('swap:' + script.__name, script);
              } else {
                  console.warn('script registry already has \'' + script.__name + '\' script, define \'swap\' method for new script type to enable code hot swapping');
              }
          });
          return false;
      }

      this._scripts[script.__name] = script;
      this._list.push(script);

      this.fire('add', script.__name, script);
      this.fire('add:' + script.__name, script);

      // for all components awaiting Script Type
      // create script instance
      setTimeout(function () {
          if (!self._scripts.hasOwnProperty(script.__name))
              return;


          // this is a check for a possible error
          // that might happen if the app has been destroyed before
          // setTimeout has finished
          if (!self.app || !self.app.systems || !self.app.systems.script) {
              return;
          }

          var components = self.app.systems.script._components;
          var i, scriptInstance, attributes;
          var scriptInstances = [];
          var scriptInstancesInitialized = [];

          for (components.loopIndex = 0; components.loopIndex < components.length; components.loopIndex++) {
              var component = components.items[components.loopIndex];
              // check if awaiting for script
              if (component._scriptsIndex[script.__name] && component._scriptsIndex[script.__name].awaiting) {
                  if (component._scriptsData && component._scriptsData[script.__name])
                      attributes = component._scriptsData[script.__name].attributes;

                  scriptInstance = component.create(script.__name, {
                      preloading: true,
                      ind: component._scriptsIndex[script.__name].ind,
                      attributes: attributes
                  });

                  if (scriptInstance)
                      scriptInstances.push(scriptInstance);
              }
          }

          // initialize attributes
          for (i = 0; i < scriptInstances.length; i++)
              scriptInstances[i].__initializeAttributes();

          // call initialize()
          for (i = 0; i < scriptInstances.length; i++) {
              if (scriptInstances[i].enabled) {
                  scriptInstances[i]._initialized = true;

                  scriptInstancesInitialized.push(scriptInstances[i]);

                  if (scriptInstances[i].initialize)
                      scriptInstances[i].initialize();
              }
          }

          // call postInitialize()
          for (i = 0; i < scriptInstancesInitialized.length; i++) {
              if (!scriptInstancesInitialized[i].enabled || scriptInstancesInitialized[i]._postInitialized) {
                  continue;
              }

              scriptInstancesInitialized[i]._postInitialized = true;

              if (scriptInstancesInitialized[i].postInitialize)
                  scriptInstancesInitialized[i].postInitialize();
          }
      });

      return true;
  };
  ScriptRegistry.prototype.remove = function (name) {
    if (typeof name === 'function')
        name = name.__name;

    if (!this._scripts.hasOwnProperty(name))
        return false;

    var item = this._scripts[name];
    delete this._scripts[name];

    var ind = this._list.indexOf(item);
    this._list.splice(ind, 1);

    this.fire('remove', name, item);
    this.fire('remove:' + name, item);

    return true;
  };
  ScriptRegistry.prototype.get = function (name) {
    return this._scripts[name] || null;
  };
  ScriptRegistry.prototype.has = function (name) {
    return this._scripts.hasOwnProperty(name);
  };
  ScriptRegistry.prototype.list = function () {
    return this._list;
  };

  return {
    ScriptRegistry: ScriptRegistry
  };
}());
