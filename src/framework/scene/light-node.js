
ape.scene.LightType = {
    /** Directional (global) light source. */
    DIRECTIONAL: 1,
    /** Point (local) light source. */
    POINT: 2,
    /** Spot (local) light source. */
    SPOT: 4
};

Object.assign(ape.scene, function () {
    // TODO: This won't work for multiple
    var _activeLightsChanged = false;
    var _activeLights = [];
    _activeLights[ape.scene.LightType.DIRECTIONAL] = [];
    _activeLights[ape.scene.LightType.POINT] = [];
    _activeLights[ape.scene.LightType.SPOT] = [];
    var _globalAmbient = [0.0, 0.0, 0.0];

    var LightNode = function LightNode() {
        // LightNode properties (defaults)
        this._type      = ape.scene.LightType.DIRECTIONAL;
        this._color     = [0.8, 0.8, 0.8];
        this._radius    = 1.0;
        this._coneAngle = Math.PI * 0.5;
        this._enabled   = false;
    };

    LightNode.prototype = Object.create(ape.scene.GraphNode);
    LightNode.prototype.constructor = LightNode;

    LightNode.prototype.clone = function () {
        var clone = new ape.scene.LightNode();

        // GraphNode
        clone.setName(this.getName());
        clone.setLocalTransform(ape.Mat4.clone(this.getLocalTransform()));
        clone._graphId = this._graphId;

        // LightNode
        clone.setType(this.getType());
        clone.setColor(this.getColor().splice(0));
        clone.setRadius(this.getRadius());
//        clone.setConeAngle(this.getConeAngle());

        return clone;
    };

    LightNode.prototype.enable = function (enable) {
        if (enable && !this._enabled) {
            switch (this._type) {
                case ape.scene.LightType.DIRECTIONAL:
                case ape.scene.LightType.POINT:
                case ape.scene.LightType.SPOT:
                    _activeLights[this._type].push(this);
                    _activeLights.dirty = true;
                    break;
            }
            this._enabled = true;
        } else if (!enable && this._enabled) {
            switch (this._type) {
                case ape.scene.LightType.DIRECTIONAL:
                case ape.scene.LightType.POINT:
                case ape.scene.LightType.SPOT:
                    var index = _activeLights[this._type].indexOf(this);
                    if (index !== -1) {
                        _activeLights[this._type].splice(index, 1);
                        _activeLights.dirty = true;
                    }
                    break;
            }
            this._enabled = false;
        }
    };

    LightNode.prototype.getColor = function () {
        return this._color;
    };
    LightNode.prototype.getRadius = function () {
        return this._radius;
    };
    LightNode.prototype.getType = function () {
        return this._type;
    };
    LightNode.prototype.setColor = function (color) {
        this._color = color;
    };
    LightNode.prototype.setRadius = function (radius) {
        this._radius = radius;
    }
    LightNode.prototype.setType = function (type) {
        this._type = type;
    };
    LightNode.getGlobalAmbient = function () {
        return _globalAmbient;
    };
    LightNode.setGlobalAmbient = function (color) {
        _globalAmbient = color;
    };
    LightNode.dispatch = function () {
        var dirs = _activeLights[ape.scene.LightType.DIRECTIONAL];
        var pnts = _activeLights[ape.scene.LightType.POINT];
        var spts = _activeLights[ape.scene.LightType.SPOT];

        var numDirs = dirs.length;
        var numPnts = pnts.length;
        var numSpts = spts.length;

        var device = Device;
        var scope = device.scope;

        scope.resolve("light_globalAmbient").setValue(_globalAmbient);

        for (var i = 0; i < numDirs; i++) {
            var directional = dirs[i];
            var wtm = directional.getWorldTransform();
            var light = "light" + i;

            scope.resolve(light + "_color").setValue(directional._color);
            scope.resolve(light + "_position").setValue([-wtm[4], -wtm[5], -wtm[6]]);
        }

        for (var i = 0; i < numPnts; i++) {
            var point = pnts[i];
            var wtm = point.getWorldTransform();
            var light = "light" + (numDirs + i);

            scope.resolve(light + "_color").setValue(point._color);
            scope.resolve(light + "_position").setValue([wtm[12], wtm[13], wtm[14]]);
        }
    };

    LightNode.getNumEnabled = function (type) {
        if (type === undefined) {
            return _activeLights[ape.scene.LightType.DIRECTIONAL].length +
                   _activeLights[ape.scene.LightType.POINT].length +
                   _activeLights[ape.scene.LightType.SPOT].length;
        } else {
            return _activeLights[type].length;
        }
    }

    return {
        LightNode: LightNode
    };
}());
