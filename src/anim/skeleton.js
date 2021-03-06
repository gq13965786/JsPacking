Object.assign(ape, function () {
  function InterpolatedKey() {
    this._written = false;
    this._mame = "";
    this._keyFrames = [];
    //result of interpolation
    this._quat  = new ape.Quat();
    this._pos   = new ape.Vec3();
    this._scale = new ape.Vec3();
    //Optional destination for interpolation keyframe
    this._targetNode = null;
  }

  Object.assign(InterpolatedKey.prototype, {
    getTarget: function () {
      return this._targetNode;
    },
    setTarget: function (node) {
      this._targetNode = node;
    }
  });

  var Skeleton = function Skeleton(graph) {
    this._animation = null;
    this._time = 0;
    this.looping = true;

    this._interpolatedKeys = [];
    this._interpolatedKeyDict = {};
    this._currKeyIndices = {};

    this.graph = null;

    var self = this;

    function addInterpolatedKeys(node) {
      var interpKey = new InterpolatedKey();
      interpKey._name = node.name;
      self._interpolatedKeys.push(interpKey);
      self._interpolatedKeyDict[node.name] = interpKey;
      self._currKeyIndices[node.name] = 0;

      for (var i = 0; i < node._children.length; i++)
          addInterpolatedKeys(node._children[i]);
    }
    addInterpolatedKeys(graph);
  };
  Skeleton.prototype.addTime = function (delta) {
    if (this._animation !== null) {
            var i;
            var node, nodeName;
            var keys, interpKey;
            var k1, k2, alpha;
            var nodes = this._animation._nodes;
            var duration = this._animation.duration;

            // Check if we can early out
            if ((this._time === duration) && !this.looping) {
                return;
            }

            // Step the current time and work out if we need to jump ahead, clamp or wrap around
            this._time += delta;

            if (this._time > duration) {
                this._time = this.looping ? 0.0 : duration;
                for (i = 0; i < nodes.length; i++) {
                    node = nodes[i];
                    nodeName = node._name;
                    this._currKeyIndices[nodeName] = 0;
                }
            } else if (this._time < 0) {
                this._time = this.looping ? duration : 0.0;
                for (i = 0; i < nodes.length; i++) {
                    node = nodes[i];
                    nodeName = node._name;
                    this._currKeyIndices[nodeName] = node._keys.length - 2;
                }
            }


            // For each animated node...

            // keys index offset
            var offset = (delta >= 0 ? 1 : -1);

            var foundKey;
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                nodeName = node._name;
                keys = node._keys;

                // Determine the interpolated keyframe for this animated node
                interpKey = this._interpolatedKeyDict[nodeName];
                if (interpKey === undefined) {
                    // #ifdef DEBUG
                    console.warn('Unknown skeleton node name: ' + nodeName);
                    // #endif
                    continue;
                }
                // If there's only a single key, just copy the key to the interpolated key...
                foundKey = false;
                if (keys.length !== 1) {
                    // Otherwise, find the keyframe pair for this node
                    for (var currKeyIndex = this._currKeyIndices[nodeName]; currKeyIndex < keys.length - 1 && currKeyIndex >= 0; currKeyIndex += offset) {
                        k1 = keys[currKeyIndex];
                        k2 = keys[currKeyIndex + 1];

                        if ((k1.time <= this._time) && (k2.time >= this._time)) {
                            alpha = (this._time - k1.time) / (k2.time - k1.time);

                            interpKey._pos.lerp(k1.position, k2.position, alpha);
                            interpKey._quat.slerp(k1.rotation, k2.rotation, alpha);
                            interpKey._scale.lerp(k1.scale, k2.scale, alpha);
                            interpKey._written = true;

                            this._currKeyIndices[nodeName] = currKeyIndex;
                            foundKey = true;
                            break;
                        }
                    }
                }
                if (keys.length === 1 || (!foundKey && this._time === 0.0 && this.looping)) {
                    interpKey._pos.copy(keys[0].position);
                    interpKey._quat.copy(keys[0].rotation);
                    interpKey._scale.copy(keys[0].scale);
                    interpKey._written = true;
                }
            }
        }
  };
  Skeleton.prototype.blend = function (skel1, skel2, alpha) {
        var numNodes = this._interpolatedKeys.length;
        for (var i = 0; i < numNodes; i++) {
            var key1 = skel1._interpolatedKeys[i];
            var key2 = skel2._interpolatedKeys[i];
            var dstKey = this._interpolatedKeys[i];

            if (key1._written && key2._written) {
                dstKey._quat.slerp(key1._quat, skel2._interpolatedKeys[i]._quat, alpha);
                dstKey._pos.lerp(key1._pos, skel2._interpolatedKeys[i]._pos, alpha);
                dstKey._scale.lerp(key1._scale, key2._scale, alpha);
                dstKey._written = true;
            } else if (key1._written) {
                dstKey._quat.copy(key1._quat);
                dstKey._pos.copy(key1._pos);
                dstKey._scale.copy(key1._scale);
                dstKey._written = true;
            } else if (key2._written) {
                dstKey._quat.copy(key2._quat);
                dstKey._pos.copy(key2._pos);
                dstKey._scale.copy(key2._scale);
                dstKey._written = true;
            }
        }
    };

  Object.defineProperty(Skeleton.prototype, 'animation', {
    get: function () {
      return this._animation;
    },
    set: function (value) {
      this._animation = value;
      this.currentTime = 0;
    }
  });
  Skeleton.prototype.getAnimation = function () {
    return this._animation;
  };

  Object.defineProperty(Skeleton.prototype, 'currentTime', {
    get: function () {
      return this._time;
    },
    set: function (value) {
      this._time = value;
      var numNodes = this._interpolatedKeys.length;
      for (var i = 0; i < numNodes; i++) {
        var node = this._interpolatedKeys[i];
        var nodeName = node._name;
        this._currKeyIndices[nodeName] = 0;
      }
      this.addTime(0);
      this.updateGraph();
    }
  });
  Skeleton.prototype.getCurrentTime = function () {
    return this._time;
  };
  Skeleton.prototype.setCurrentTime = function (time) {
    this.currentTime = time;
  };

  Object.defineProperty(Skeleton.prototype, 'numNodes', {
    get: function () {
      return this._interpolatedKeys.length;
    }
  });
  Skeleton.prototype.getNumNodes = function () {
    return this._interpolatedKeys.length;
  };
  Skeleton.prototype.setAnimation = function (animation) {
    this.animation = animation;
  };
  Skeleton.prototype.setGraph = function (graph) {
    var i;
    this.graph = graph;

    if(graph) {
      for (i = 0; i < this._interpolatedKeys.length; i++) {
        var interpKey = this._interpolatedKeys[i];
        var graphNode = graph.findByName(interpKey._name);
        this._interpolatedKeys[i].setTarget(graphNode);
      }
    } else {
      for (i = 0; i< this._interpolatedKeys.length; i++) {
        this._interpolatedKeys[i].setTarget(null);
      }
    }
  };
  Skeleton.prototype.updateGraph = function () {
    if (this.graph) {
      for (var i = 0; i < this._interpolatedKeys.length; i++) {
        var interpKey = this._interpolatedKeys[i];
        if (interpKey._written) {
          var transform = interpKey.getTarget();

          transform.localPosition.copy(interpKey._pos);
          transform.localRotation.copy(interpKey._quat);
          transform.localScale.copy(interpKey._scale);

          if (!transform._dirtyLocal)
              transform._dirtyLocal();

          interpKey._written = false;
        }
      }
    }
  };
  Skeleton.prototype.setLooping = function (looping) {
    this.looping = looping;
  };
  Skeleton.prototype.getLooping = function () {
    return this.looping;
  };

  return {
    Skeleton: Skeleton
  };
}());
