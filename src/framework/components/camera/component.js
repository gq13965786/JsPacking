Object.assign(ape.fw, function () {
    var _createGfxResources = function () {
        // Create the graphical resources required to render a camera frustum
        var device = Device;
        var library = device.getProgramLibrary();
        var program = library.getProgram("basic", { vertexColors: false, diffuseMapping: false });
        var format = new ape.gfx.VertexFormat();
        format.begin();
        format.addElement(new ape.gfx.VertexElement("vertex_position", 3, ape.gfx.VertexElementType.FLOAT32));
        format.end();
        var vertexBuffer = new ape.gfx.VertexBuffer(format, 8, ape.gfx.VertexBufferUsage.DYNAMIC);
        var indexBuffer = new ape.gfx.IndexBuffer(ape.gfx.IndexFormat.UINT16, 24);
        var indices = new Uint16Array(indexBuffer.lock());
        indices.set([0,1,1,2,2,3,3,0, // Near plane
                     4,5,5,6,6,7,7,4, // Far plane
                     0,4,1,5,2,6,3,7]); // Near to far edges
        indexBuffer.unlock();

        // Set the resources on the component
        return {
            program: program,
            indexBuffer: indexBuffer,
            vertexBuffer: vertexBuffer
        };
    };

    var _createOffscreenBuffer = function () {
        var backBuffer = Device;
        var w = backBuffer.getWidth();
        var h = backBuffer.getHeight();
        var offscreenBuffer = new ape.gfx.FrameBuffer(w, h, true);
        var offscreenTexture = offscreenBuffer.getTexture();
        offscreenTexture.setFilterMode(ape.gfx.TextureFilter.LINEAR, ape.gfx.TextureFilter.LINEAR);
        offscreenTexture.setAddressMode(ape.gfx.TextureAddress.CLAMP_TO_EDGE, ape.gfx.TextureAddress.CLAMP_TO_EDGE);
        return offscreenBuffer;
    };

    var CameraComponentSystem = function (context) {

            ape.fw.ComponentSystem.call(this,context);

            context.systems.add("camera", this);

            ape.extend(this, {
                _cameraStack: [],
                _camera: null,
                _current: null,

                _clearColor: function (componentData, clearColor) {
                    if (clearColor) {
                        var color = parseInt(clearColor);
                        componentData.camera.getClearOptions().color = [
                            ((color >> 24) & 0xff) / 255.0,
                            ((color >> 16) & 0xff) / 255.0,
                            ((color >> 8) & 0xff) / 255.0,
                            ((color) & 0xff) / 255.0
                        ];
                    } else {
                        return componentData.camera.getClearOptions().color;
                    }
                },

                _cam: function (componentData) {
                    return componentData.camera;
                },

                _fov: function (componentData, fov) {
                    if (fov) {
                        componentData.fov = fov;
                        componentData.camera.setFov(fov);
                    } else {
                        return componentData.camera.getFov();
                    }
                },

                _viewWindowX: function (componentData, vwx) {
                    if (vwx) {
                        componentData.viewWindowX = vwx;
                        var vw = componentData.camera.getViewWindow();
                        componentData.camera.setViewWindow(ape.Vec2.create(vwx, vw[1]));
                    } else {
                        return componentData.viewWindowX;
                    }
                },

                _viewWindowY: function (componentData, vwy) {
                    if (vwy) {
                        componentData.viewWindowY = vwy;
                        var vw = componentData.camera.getViewWindow();
                        componentData.camera.setViewWindow(ape.Vec2.create(vw[0], vwy));
                    } else {
                        return componentData.viewWindowY;
                    }
                },

                _nearClip: function (componentData, nearClip) {
                    if (nearClip) {
                        componentData.nearClip = nearClip;
                        componentData.camera.setNearClip(nearClip);
                    } else {
                        return componentData.camera.getNearClip();
                    }
                },

                _farClip: function (componentData, farClip) {
                    if (farClip) {
                        componentData.farClip = farClip;
                        componentData.camera.setFarClip(farClip);
                    } else {
                        return componentData.camera.getFarClip();
                    }
                },

                _offscreen: function (componentData, offscreen) {
                    if (offscreen !== undefined) {
                        if (offscreen) {
                            componentData.offscreen = offscreen;
                            var offscreenBuffer = _createOffscreenBuffer();
                            componentData.camera.setRenderTarget(new ape.gfx.RenderTarget(offscreenBuffer));
                        } else {
                            var backBuffer = ape.gfx.FrameBuffer.getBackBuffer();
                            componentData.camera.setRenderTarget(new ape.gfx.RenderTarget(backBuffer));
                        }
                    } else {
                        return componentData.offscreen;
                    }
                },

                _projection: function (componentData, projection) {
                    if (projection) {
                        componentData.projection = projection;
                        componentData.camera.setProjection(projection);
                    } else {
                        return componentData.camera.getProjection();
                    }
                }
            });

            this.renderable = _createGfxResources();
        };

    CameraComponentSystem.prototype = Object.create(ape.fw.ComponentSystem.prototype);
    CameraComponentSystem.prototype.constructor = CameraComponentSystem;

    CameraComponentSystem.prototype.createComponent = function (entity, data) {
        var componentData = new ape.fw.CameraComponentData();
        var properties = ['clearColor', 'fov', 'viewWindowX', 'viewWindowY', 'activate', 'nearClip', 'farClip', 'offscreen', 'projection'];
        data = data || {};

        componentData.camera = new ape.scene.CameraNode();
        entity.addChild(componentData.camera);

        this.addComponent(entity, componentData);

        properties.forEach(function(value, index, arr) {
            if(ape.isDefined(data[value])) {
                this.set(entity, value, data[value]);
            }
        }, this);

        if(!window.ape.apps.designer && this.get(entity, "activate") && !entity.hasLabel("ape:designer")) {
            this.push(entity);
        }

        return componentData;
    };

    CameraComponentSystem.prototype.deleteComponent = function (entity) {
        var data = this._getComponentData(entity);

        if(data.camera) {
            entity.removeChild(data.camera);
            data.camera = null;
        }

        this.removeComponent(entity);
    };

    CameraComponentSystem.prototype.update = function (dt) {
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

    CameraComponentSystem.prototype.toolsRender = function (fn) {
        var id;
        var entity;
        var componentData;
        var components = this._getComponents();
        var transform;
        var device;
        var program = this.renderable.program;
        var vertexBuffer = this.renderable.vertexBuffer;
        var indexBuffer = this.renderable.indexBuffer;

        for (id in components) {
            if (false) { //(components.hasOwnProperty(id)) {
                entity = components[id].entity;
                componentData = components[id].component;

                // Retrieve the characteristics of the camera frustum
                var cam = componentData.camera;
                var nearClip = cam.getNearClip();
                var farClip  = cam.getFarClip();
                var fov      = cam.getFov() * Math.PI / 180.0;
                var viewport = cam.getRenderTarget().getViewport();

                // Write the frustum corners into a dynamic vertex buffer
                var positions = new Float32Array(vertexBuffer.lock());
                var y = Math.tan(fov / 2.0) * nearClip;
                var x = y * viewport.width / viewport.height;
                positions[0]  = x;
                positions[1]  = -y;
                positions[2]  = -nearClip;
                positions[3]  = x;
                positions[4]  = y;
                positions[5]  = -nearClip;
                positions[6]  = -x;
                positions[7]  = y;
                positions[8]  = -nearClip;
                positions[9]  = -x;
                positions[10] = -y;
                positions[11] = -nearClip;

                y = Math.tan(fov / 2.0) * farClip;
                x = y * viewport.width / viewport.height;
                positions[12]  = x;
                positions[13]  = -y;
                positions[14]  = -farClip;
                positions[15]  = x;
                positions[16]  = y;
                positions[17]  = -farClip;
                positions[18]  = -x;
                positions[19]  = y;
                positions[20]  = -farClip;
                positions[21]  = -x;
                positions[22] = -y;
                positions[23] = -farClip;
                vertexBuffer.unlock();

                // Render the camera frustum
                device = ape.gfx.GraphicsDevice.getCurrent();
                device.setProgram(program);
                device.setIndexBuffer(indexBuffer);
                device.setVertexBuffer(vertexBuffer, 0);

                transform = entity.getWorldTransform();
                device.scope.resolve("matrix_model").setValue(transform);
                device.scope.resolve("constant_color").setValue([1,1,0,1]);
                device.draw({
                    primitiveType: ape.gfx.PrimType.LINES,
                    numVertices: indexBuffer.getNumIndices(),
                    useIndexBuffer: true
                });
            }
        }
    };

    CameraComponentSystem.prototype.getCurrent = function () {
        return this._current;
    };

    CameraComponentSystem.prototype.push = function (entity) {
        this._current = entity;
        this._cameraStack.push(entity);
        this._camera = this._getComponentData(entity).camera;
    };

    CameraComponentSystem.prototype.pop = function () {
        if(!this._cameraStack.length) {
            return null;
        }
        var cam = this._cameraStack.pop();
        this._current = this._cameraStack.length ? this._cameraStack[this._cameraStack.length - 1] : null;
        this._camera = this._current ? this._getComponentData(this._current).camera : null;
        return cam;
    };

    CameraComponentSystem.prototype.frameBegin = function () {
        if (!this._camera) {
            return;
        }

/*
        if (this._current) {
            var componentData = this._getComponentData(this._current);
            var canvas = ape.gfx.Device.getCurrent().canvas;
            var target = componentData.camera.getRenderTarget();
            var viewport = target.getViewport();
            if ((canvas.width !== viewport.width) || (canvas.height !== viewport.height)) {
                buffer = componentData.offscreen ? _createOffscreenBuffer() : ape.gfx.FrameBuffer.getBackBuffer();
                componentData.camera.setRenderTarget(new ape.gfx.RenderTarget(buffer));
            }
        }
*/

        this._camera.frameBegin();
    };

    CameraComponentSystem.prototype.frameEnd = function () {
        if(!this._camera) {
            return;
        }
        this._camera.frameEnd();
    };

    return {
        CameraComponentSystem: CameraComponentSystem
    };
}());
