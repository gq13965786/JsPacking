Object.assign(ape.fw, function () {
    var _createGfxResources = function () {
        // Create the graphical resources required to render a light
        var device = Device;
        var library = device.getProgramLibrary();
        var program = library.getProgram("basic", { vertexColors: false, diffuseMapping: false });
        var format = new ape.gfx.VertexFormat();
        format.begin();
        format.addElement(new ape.gfx.VertexElement("vertex_position", 3, ape.gfx.VertexElementType.FLOAT32));
        format.end();
        var vertexBuffer = new ape.gfx.VertexBuffer(format, 32, ape.gfx.VertexBufferUsage.DYNAMIC);
        // Generate the directional light arrow vertex data
        vertexData = [
            // Center arrow
            0, 0, 0, 0, -8, 0,       // Stalk
            -0.5, -8, 0, 0.5, -8, 0, // Arrowhead base
            0.5, -8, 0, 0, -10, 0,   // Arrowhead tip
            0, -10, 0, -0.5, -8, 0,  // Arrowhead tip
            // Lower arrow
            0, 0, -2, 0, -8, -2,         // Stalk
            -0.25, -8, -2, 0.25, -8, -2, // Arrowhead base
            0.25, -8, -2, 0, -10, -2,    // Arrowhead tip
            0, -10, -2, -0.25, -8, -2    // Arrowhead tip
        ];
        //var rot = ape.Mat4.makeRotate(Math.PI * 2 / 3, [0, 1, 0]);
        //for (var i = 0; i < 16; i++) {
        //    var pos = ape.Vec3.create(vertexData[(i+8)*3], vertexData[(i+8)*3+1], vertexData[(i+8)*3+2]);
        //    var posRot = ape.Mat4.multiplyVec3(pos, 1.0, rot);
        //    vertexData[(i+16)*3]   = posRot[0];
        //    vertexData[(i+16)*3+1] = posRot[1];
        //    vertexData[(i+16)*3+2] = posRot[2];
        //}
        // Copy vertex data into the vertex buffer
        var positions = new Float32Array(vertexBuffer.lock());
        for (var i = 0; i < vertexData.length; i++) {
            positions[i] = vertexData[i];
        }
        vertexBuffer.unlock();

        // Set the resources on the component
        return {
            program: program,
            vertexBuffer: vertexBuffer
        };
    };

    var DirectionalLightComponentSystem = function (context) {

        ape.fw.ComponentSystem.call(this,context);

        context.systems.add("directionallight", this);

        ape.extend(this, {
            _enable: function (componentData, enable) {
                if (enable !== undefined) {
                    componentData.enable = enable;
                    componentData.light.enable(enable);
                } else {
                    return componentData.enable;
                }
            },
            _color: function (componentData, color) {
                if (color) {
                    var rgb = parseInt(color);
                    componentData.color = [
                        ((rgb >> 16) & 0xff) / 255.0,
                        ((rgb >> 8) & 0xff) / 255.0,
                        ((rgb) & 0xff) / 255.0
                    ];
                    componentData.light.setColor(componentData.color);
                } else {
                    return componentData.color;
                }
            }
        });

        this.renderable = _createGfxResources();
    };

    DirectionalLightComponentSystem.prototype = Object.create(ape.fw.ComponentSystem.prototype);
    DirectionalLightComponentSystem.prototype.constructor = DirectionalLightComponentSystem;

    DirectionalLightComponentSystem.prototype.createComponent = function (entity, data) {
        var componentData = new ape.fw.DirectionalLightComponentData();
        var properties = ["enable", "color"];
        data = data || {};

        componentData.light = new ape.scene.LightNode();
        componentData.light.setType(ape.scene.LightType.DIRECTIONAL);
        entity.addChild(componentData.light);

        this.addComponent(entity, componentData);

        properties.forEach(function(value, index, arr) {
            if (ape.isDefined(data[value])) {
                this.set(entity, value, data[value]);
            }
        }, this);

        return componentData;
    };

    DirectionalLightComponentSystem.prototype.deleteComponent = function (entity) {
        var data = this._getComponentData(entity);
        entity.removeChild(data.light);
        data.light.enable(false);
        delete data.light;

        this.removeComponent(entity);
    };

    DirectionalLightComponentSystem.prototype.update = function (dt) {
        var id;
        var entity;
        var component;
        var components = this._getComponents();
        var transform;

        for (id in components) {
            if (components.hasOwnProperty(id)) {
                entity = components[id].entity;
                component = components[id].component;
            }
        }
    };

    DirectionalLightComponentSystem.prototype.toolsRender = function (fn) {
        var id;
        var entity;
        var componentData;
        var components = this._getComponents();
        var transform;
        var device;
        var program = this.renderable.program;
        var vertexBuffer = this.renderable.vertexBuffer;

        for (id in components) {
            if (components.hasOwnProperty(id)) {
                entity = components[id].entity;
                componentData = components[id].component;

                // Render a representation of the light
                device = ape.gfx.GraphicsDevice.getCurrent();
                device.setProgram(program);
                device.setVertexBuffer(vertexBuffer, 0);

                transform = entity.getWorldTransform();
                device.scope.resolve("matrix_model").setValue(transform);
                device.scope.resolve("constant_color").setValue([1,1,0,1]);
                device.draw({
                    primitiveType: ape.gfx.PrimType.LINES,
                    numVertices: vertexBuffer.getNumVertices(),
                    useIndexBuffer: false
                });
            }
        }
    };

    return {
        DirectionalLightComponentSystem: DirectionalLightComponentSystem
    };
}());
