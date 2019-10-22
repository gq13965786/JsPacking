Object.assign(ape.fw, function () {
  var Application = function (canvas, options) {
    this.canvas = canvas;

    this._link = new ape.fw.LiveLink(window);
    this._link.listen(ape.callback(this, this._handleMessage));

    //Log.open();

    this.graphicsDevice = new ape.gfx.GraphicsDevice(canvas);

    //Install the Phong shader
    var programLib = new ape.gfx.ProgramLibrary();

    programLib.register("basic",
                        ape.gfx.programlib.basic.generateVertexShader,
                        ape.gfx.programlib.basic.generateFragmentShader,
                        ape.gfx.programlib.basic.generateKey);
    programLib.register("phong",
                        ape.gfx.programlib.phong.generateVertexShader,
                        ape.gfx.programlib.phong.generateFragmentShader,
                        ape.gfx.programlib.phong.generateKey);
    programLib.register("pick",
                        ape.gfx.programlib.pick.generateVertexShader,
                        ape.gfx.programlib.pick.generateFragmentShader,
                        ape.gfx.programlib.pick.generateKey);
    this.graphicsDevice.setProgramLibrary(programLib);

    //Activate the graphics device
    this.graphicsDevice.setCurrent();
    //console.log(ape.gfx.GraphicsDevice);
    ape.post.initialize();

    //Enable validation of each WebGL command
    this.graphicsDevice.enableValidation(false);
    var registry = new ape.fw.ComponentSystemRegistry();

    //scriptPrefix = (options.config && options.config['script_prefix']) ? options.config['script_prefix'] : "";

    // Create resource loader
		var loader = new ape.resources.ResourceLoader();

    // The ApplicationContext is passed to new Components and user scripts
    this.context = new ape.fw.ApplicationContext(loader, new ape.scene.Scene(), registry, null, null, null);

    // Register the ScriptResourceHandler late as we need the context
    //loader.registerHandler(ape.resources.ScriptRequest, new ape.resources.ScriptResourceHandler(this.context, scriptPrefix));

    //Create Systems//
    var camerasys = new ape.fw.CameraComponentSystem(this.context);
    var dlightsys = new ape.fw.DirectionalLightComponentSystem(this.context);
    var plightsys = new ape.fw.PointLightComponentSystem(this.context);

    // Add event support
    ape.extend(this, ape.events);

    this.init();
  };

  Application.prototype.start = function (entity) {
      if (entity) {
        this.context.root.addChild(entity);
      }
      this.tick();
  };
  Application.prototype.init = function () {};
  Application.prototype.update = function (dt) {
    var inTools = !!window.ape.apps.designer;
    var context = this.context;

    //Perform ComponentSystem update
    ape.fw.ComponentSystem.update(dt, context, inTools);

    //fire update event
    this.fire("update", dt);

    if (context.controller) {
      context.controller.update(dt);
    }
    if (context.keyboard) {
      context.keyboard.update(dt);
    }
  };
  Application.prototype.render = function () {
    var inTools = !!window.ape.apps.designer;
    var context = this.context;

    context.root.syncHierarchy();

    this.graphicsDevice.setCurrent();
    if (context.systems.camera._camera) {
      context.systems.camera.frameBegin();

      ape.fw.ComponentSystem.render(context, inTools);
      context.scene.dispatch(context.systems.camera._camera);
      context.scene.flush();

      context.systems.camera.frameEnd();
    }
  };
  Application.prototype.tick = function () {
    var dt = 1.0 / 60.0;

    this.update(dt);
    this.render();

    //submit a request to queue up a new animation frame immediately
    requestAnimationFrame(this.tick.bind(this), this.canvas);
  };
  Application.prototype._handleMessage = function (msg) {
    switch(msg.type) {
        case ape.fw.LiveLinkMessageType.UPDATE_COMPONENT:
            logINFO("Rec: UPDATE_COMPONENT " + msg.content.id);
            this._updateComponent(msg.content.id, msg.content.component, msg.content.attribute, msg.content.value);
            break;
        case ape.fw.LiveLinkMessageType.UPDATE_ENTITY:
            logINFO("Rec: UPDATE_ENTITY " + msg.content.id);
            this._updateEntity(msg.content.id, msg.content.components);
            break;
        case ape.fw.LiveLinkMessageType.UPDATE_ENTITY_ATTRIBUTE:
            logINFO("Rec: UPDATE_ENTITY_ATTRIBUTE " + msg.content.id);
            this._updateEntityAttribute(msg.content.id, msg.content.accessor, msg.content.value);
            break;
        case ape.fw.LiveLinkMessageType.CLOSE_ENTITY:
            logINFO("Rec: CLOSE_ENTITY " + msg.content.id);
            //this.context.loaders.entity.close(msg.content.id, this.context.root, this.context.systems);
            var entity = this.context.root.findOne("getGuid", guid);
            if(entity) {
                entity.close(this.context.systems);
            }
            break;
        case ape.fw.LiveLinkMessageType.OPEN_ENTITY:
            logINFO("Rec: OPEN_ENTITY " + msg.content.id);
            var entities = {};
            msg.content.models.forEach(function (model) {
                var entity = this.context.loader.open(ape.resources.EntityRequest, model);
                entities[entity.getGuid()] = entity;

            }, this);


            // create a temporary handler to patch children
            var handler = new ape.resources.EntityResourceHandler();
            for (guid in entities) {
                if (entities.hasOwnProperty(guid)) {
                    handler.patchChildren(entities[guid], entities);
                    // Added top level entity to the root
                    if(!entities[guid].getParent()) {
                        this.context.root.addChild(entities[guid]);
                    }
                }
            }

            break;
    }
  };
  Application.prototype._updateComponent = function (guid, componentName, attributeName, value) {
    var entity = this.context.root.findOne("getGuid", guid);
    var sysem;

    if (entity) {
      if (componentName) {
        system = this.context.systems[componentName];
        if (system) {
          system.set(entity, attributeName, value);
        } else {
          logWARNING(ape.string.format("No component system called '{0}' exists", componentName));
        }
      } else {
        //set value on node
        entity[attributeName] = value;
      }
    }
  };
  Application.prototype._updateEntityAttribute = function (guid, accessor, value) {
    var entity = this.context.root.findOne("getGuid", guid);

    if (entity) {
      if (ape.type(entity[accessor]) != "function") {
        logWARNING(ape.string.format("{0} is not an accessor function", accessor));
      }

      if (ape.string.startsWith(accessor, "reparent")) {
        entity[accessor](value, this.context);
      } else {
        entity[accessor](value);
      }
    }
  };
  Application.prototype_updateEntity = function (guid, components) {
    var type;
    var entity = this.context.root.findOne("getGuid", guid);

    if(entity) {
        for(type in components) {
            if(this.context.systems.hasOwnProperty(type)) {
               if(!this.context.systems[type].hasComponent(entity)) {
                    this.context.systems[type].createComponent(entity);
                }
            }
        }

        for(type in this.context.systems) {
            if(type === "gizmo" || type === "pick") {
                continue;
            }

            if(this.context.systems.hasOwnProperty(type)) {
                if(!components.hasOwnProperty(type) &&
                    this.context.systems[type].hasComponent(entity)) {
                    this.context.systems[type].deleteComponent(entity);
                }
            }
        }
    }
  };

  return {
    Application: Application
  };
}());
