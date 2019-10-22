Object.assign(ape.fw, function () {

    var ComponentSystem = function ComponentSystem(context) {
        var _components = {};
        this._name = "";
        this.context = context;

        this.getComponents = function () {
            return _components;
        };
        this._getComponents = this.getComponents;

        this.getComponentData = function (entity) {
                if (_components[entity.getGuid()]) {
                    return _components[entity.getGuid()].component;
                } else {
                    return null;
            }
        };
        this._getComponentData = this.getComponentData;

        //Add support for events
        //ape.extend(this, ape.events);

        //this.bind("set", function (entity, name, newValue, oldValue) {
            // Re-fire a set event but with the name customized to the value being changed.
            // So Component authors can bind to events for each data value e.g. this.bind("set_type", ...);
        //    this.fire("set_" + name, entity, name, newValue, oldValue);
        //});
    };

    ComponentSystem.update = function (dt, context, inTools) {
        var name;
        var registry = context.systems;

        for (name in registry) {
            if (registry.hasOwnProperty(name)) {
                if(!inTools) {
                    if (registry[name].update) {
                        registry[name].update(dt);
                    }
                } else {
                    if (registry[name].toolsUpdate) {
                        registry[name].toolsUpdate(dt);
                    }
                }
            }
        }
    };

    ComponentSystem.render = function (context, inTools) {
        var name;
        var registry = context.systems;

        for (name in registry) {
            if (registry.hasOwnProperty(name)) {
                if (registry[name].render) {
                    registry[name].render();
                }
                if(inTools && registry[name].toolsRender) {
                    registry[name].toolsRender();
                }
            }
        }
    };

    ComponentSystem.toolUpdate = function (dt, context) {};

    ComponentSystem.toolRender = function (context) {};

    ComponentSystem.deleteComponents = function (entity, registry) {
        var name;
        var component;

        for (name in registry) {
            if (registry.hasOwnProperty(name)) {
                if(registry[name]._getComponentData(entity)) {
                    registry[name].deleteComponent(entity);
                }
            }
        }
    }

    ComponentSystem.prototype.hasComponent = function (entity) {
        return (this._getComponentData(entity) !== null);
    }

    ComponentSystem.prototype.initialiseComponent = function (entity, componentData, data, properties) {
        this.addComponent(entity, componentData);

        // Combine initialisation data with default data from new ComponentData
        // initialisation data should overwrite default data
        data = ape.extend(componentData, data);

        // initialise
        properties.forEach(function(value, index, arr) {
            this.set(entity, value, data[value]);
        }, this);

    };

    ComponentSystem.prototype.createComponent = function (entity, data) {
        throw new Error("createComponent not implemented");
    };

    ComponentSystem.prototype.deleteComponent = function (entity) {
        var component = this._getComponentData(entity);
        this.removeComponent(entity);
    };

    ComponentSystem.prototype.addComponent = function (entity, data) {
        var components = this._getComponents();
        components[entity.getGuid()] = {
            entity: entity,
            component: data
        };
    };

    ComponentSystem.prototype.removeComponent = function (entity) {
        var components = this._getComponents();
        delete components[entity.getGuid()];
    };

    ComponentSystem.prototype.set = function (entity, name, value) {
        var oldValue;
        var componentData = this._getComponentData(entity);

        if(componentData) {

            oldValue = componentData[name];
            // Check for an accessor first, (an accessor is a function with the same name but a leading underscore)
            if(this["_" + name] && typeof(this["_" + name]) === "function") {
                this["_" + name](componentData, value);
            } else if(componentData[name] !== undefined) {
                componentData[name] = value;
            }
            this.fire('set', entity, name, oldValue, value)
        }
    }

    ComponentSystem.prototype.get = function (entity, name) {
        var componentData = this._getComponentData(entity);
        if(componentData) {
            // Check for accessor first (an accessor is a function with the same name but a leading underscore)
            if(this["_" + name] && typeof(this["_" + name]) === "function") {
                // found an accessor on the Component
                return this["_" + name](componentData);
            } else if(componentData[name] !== undefined) {
                return componentData[name];
            }
        }
    }

    return {
        ComponentSystem: ComponentSystem
    };

}());
