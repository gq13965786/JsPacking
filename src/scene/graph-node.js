Object.assign(ape, function () {
  var scaleCompensatePosTransform = new ape.Mat4();
  var scaleCompensatePos = new ape.Vec3();
  var scaleCompensateRot = new ape.Quat();
  var scaleCompensateRot2 = new ape.Quat();
  var scaleCompensateScale = new ape.Vec3();
  var scaleCompensateScaleForParent = new ape.Vec3();

  var GraphNode = function GraphNode(name) {
    this.name = typeof name === "string" ? name : "Untitled";
    this.tags = new ape.Tags(this);

    this._labels = {};

    //Local-space properties of transform(only first 3 are settable by user)
    this.localPosition = new ape.Vec3(0, 0, 0);
    this.localRotation = new ape.Quat(0, 0, 0, 1);
    this.localScale = new ape.Vec3(1, 1, 1);
    this.localEulerAngles = new ape.Vec3(0, 0, 0);//Only calculated

    //World-space properties of transform
    this.position = new ape.Vec3(0, 0, 0);
    this.rotation = new ape.Quat(0, 0, 0, 1);
    this.eulerAngles = new ape.Vec3(0, 0, 0);

    this.localTransform = new ape.Mat4();
    this._dirtyLocal = false;
    this._aabbVer = 0;

    this.worldTransform = new ape.Mat4();
    this._dirtyWorld = false;

    this.normalMatrix = new ape.Mat3();
    this._dirtyNormal = true;

    this._right = null;
    this._up = null;
    this._forward = null;

    this._parent = null;
    this._children = [];
    this._graphDepth = 0;

    this._enabled = true;
    this._enabledInhierarchy = false;

    this.scaleCompensation = false;
  };

  Object.defineProperty(GraphNode.prototype, 'right', {
    get: function () {
      if (!this._right) {
        this._right = new ape.Vec3();
      }
      return this.getWorldTransform().getX(this._right).normalize();
    }
  });
  Object.defineProperty(GraphNode.prototype, 'up', {
    get: function () {
      if (!this._up) {
        this._up = new ape.Vec3();
      }
      return this.getWorldTransform().getY(this._up).normalize();
    }
  });
  Object.defineProperty(GraphNode.prototype, 'forward', {
    get: function () {
      if (!this._forward) {
        this._forward = new ape.Vec3();
      }
      return this.getWorldTransform().getZ(this._forward).normalize();
    }
  });
  Object.defineProperty(GraphNode.prototype, 'enabled', {
    get: function () {
      return this._enabled && this._enabledInhierarchy;
    },
    set: function (enabled) {
      if (this._enabled !== enabled) {
        this._enabled = enabled;

        if (!this._parent || this._parent.enabled)
            this._notifyHierarchyStateChanged(this, enabled);
      }
    }
  });
  Object.defineProperty(GraphNode.prototype, 'parent', {
    get: function () {
      return this._parent;
    }
  });
  Object.defineProperty(GraphNode.prototype, 'root', {
    get: function () {
      var parent = this._parent;
      if (!parent)
          return this;

      while (parent._parent)
          parent = parent._parent;

      return parent;
    }
  });
  Object.defineProperty(GraphNode.prototype, 'children', {
    get: function () {
      return this._children;
    }
  });
  Object.defineProperty(GraphNode.prototype, 'graphDepth', {
    get: function () {
      return this._graphDepth;
    }
  });


  Object.assign(GraphNode.prototype, {
    _notifyHierarchyStateChanged: function (node, enabled) {
      node._onHierarchyStateChanged(enabled);

      var c = node._children;
      for (var i = 0, len = c.length; i < len; i++) {
          if (c[i]._enabled)
              this._notifyHierarchyStateChanged(c[i], enabled);
      }
    },
    _onHierarchyStateChanged: function (enabled) {
      // Override in derived classes
      this._enabledInHierarchy = enabled;
    },
    _cloneInternal: function (clone) {
      clone.name = this.name;

      var tags = this.tags._list;
      for (var i = 0; i < tags.length; i++)
          clone.tags.add(tags[i]);

      clone._labels = Object.assign({}, this._labels);

      clone.localPosition.copy(this.localPosition);
      clone.localRotation.copy(this.localRotation);
      clone.localScale.copy(this.localScale);
      clone.localEulerAngles.copy(this.localEulerAngles);

      clone.position.copy(this.position);
      clone.rotation.copy(this.rotation);
      clone.eulerAngles.copy(this.eulerAngles);

      clone.localTransform.copy(this.localTransform);
      clone._dirtyLocal = this._dirtyLocal;

      clone.worldTransform.copy(this.worldTransform);
      clone._dirtyWorld = this._dirtyWorld;
      clone._dirtyNormal = this._dirtyNormal;
      clone._aabbVer = this._aabbVer + 1;

      clone._enabled = this._enabled;

      clone.scaleCompensation = this.scaleCompensation;

      // false as this node is not in the hierarchy yet
      clone._enabledInHierarchy = false;
    },
    clone: function () {
      var clone = new ape.GraphNode();
      this._cloneInternal(clone);
      return clone;
    },
    find: function (attr, value) {
      var results = [];
      var len = this._children.length;
      var i, descendants;

      if (attr instanceof Function) {
          var fn = attr;

          for (i = 0; i < len; i++) {
              if (fn(this._children[i]))
                  results.push(this._children[i]);

              descendants = this._children[i].find(fn);
              if (descendants.length)
                  results = results.concat(descendants);
          }
      } else {
          var testValue;

          if (this[attr]) {
              if (this[attr] instanceof Function) {
                  testValue = this[attr]();
              } else {
                  testValue = this[attr];
              }
              if (testValue === value)
                  results.push(this);
          }

          for (i = 0; i < len; ++i) {
              descendants = this._children[i].find(attr, value);
              if (descendants.length)
                  results = results.concat(descendants);
          }
      }

      return results;
    },
    findOne: function (attr, value) {
      var i;
      var len = this._children.length;
      var result = null;

      if (attr instanceof Function) {
          var fn = attr;

          result = fn(this);
          if (result)
              return this;

          for (i = 0; i < len; i++) {
              result = this._children[i].findOne(fn);
              if (result)
                  return this._children[i];
          }
      } else {
          var testValue;
          if (this[attr]) {
              if (this[attr] instanceof Function) {
                  testValue = this[attr]();
              } else {
                  testValue = this[attr];
              }
              if (testValue === value) {
                  return this;
              }
          }

          for (i = 0; i < len; i++) {
              result = this._children[i].findOne(attr, value);
              if (result !== null)
                  return result;
          }
      }

      return null;
    },
    findByTag: function () {
      var tags = this.tags._processArguments(arguments);
      return this._findByTag(tags);
    },
    _findByTag: function (tag) {
      var result = [];
      var i, len = this._children.length;
      var descendants;

      for (i = 0; i < len; i++) {
          if (this._children[i].tags._has(tags))
              result.push(this._children[i]);

          descendants = this._children[i]._findByTag(tags);
          if (descendants.length)
              result = result.concat(descendants);
      }

      return result;
    },
    findByName: function (name) {
      if (this.name === name) return this;

      for (var i = 0; i < this._children.length; i++) {
          var found = this._children[i].findByName(name);
          if (found !== null) return found;
      }
      return null;
    },
    findByPath: function (path) {
      // split the paths in parts. Each part represents a deeper hierarchy level
      var parts = path.split('/');
      var currentParent = this;
      var result = null;

      for (var i = 0, imax = parts.length; i < imax && currentParent; i++) {
          var part = parts[i];

          result = null;

          // check all the children
          var children = currentParent._children;
          for (var j = 0, jmax = children.length; j < jmax; j++) {
              if (children[j].name == part) {
                  result = children[j];
                  break;
              }
          }

          // keep going deeper in the hierarchy
          currentParent = result;
      }

      return result;
    },
    getPath: function () {
      var parent = this._parent;
      if (parent) {
          var path = this.name;
          var format = "{0}/{1}";

          while (parent && parent._parent) {
              path = ape.string.format(format, parent.name, path);
              parent = parent._parent;
          }

          return path;
      }
      return '';

    },
    getRoot: function () {
      var parent = this._parent;
      if (!parent) {
          return this;
      }

      while (parent._parent) {
          parent = parent._parent;
      }

      return parent;
    },
    getParent: function () {
      return this._parent;
    },
    isDescendantOf: function (node) {
      var parent = this._parent;
      while (parent) {
          if (parent === node)
              return true;

          parent = parent._parent;
      }
      return false;
    },
    isAncestorOf: function (node) {
      return node.isDescendantOf(this);
    },
    getChildren: function () {
      return this._children;
    },
    getEulerAngles: function () {
      this.getWorldTransform().getEulerAngles(this.eulerAngles);
      return this.eulerAngles;
    },
    getLocalEulerAngles: function () {
      this.localRotation.getEulerAngles(this.localEulerAngles);
      return this.localEulerAngles;
    },
    getLocalPosition: function () {
      return this.localPosition;
    },
    getLocalRotation: function () {
      return this.localRotation;
    },
    getLocalScale: function () {
      return this.localScale;
    },
    getLocalTransform: function () {
      if (this._dirtyLocal) {
          this.localTransform.setTRS(this.localPosition, this.localRotation, this.localScale);
          this._dirtyLocal = false;
      }
      return this.localTransform;
    },
    getName: function () {
      return this.name;
    },
    getPosition: function () {
      this.getWorldTransform().getTranslation(this.position);
      return this.position;
    },
    getRotation: function () {
      this.rotation.setFromMat4(this.getWorldTransform());
      return this.rotation;
    },
    getWorldTransform: function () {
      if (!this._dirtyLocal && !this._dirtyWorld)
          return this.worldTransform;

      if (this._parent)
          this._parent.getWorldTransform();

      this._sync();

      return this.worldTransform;
    },
    reparent: function (parent, index) {
      var current = this._parent;
      if (current)
          current.removeChild(this);

      if (parent) {
          if (index >= 0) {
              parent.insertChild(this, index);
          } else {
              parent.addChild(this);
          }
      }
    },
    setLocalEulerAngles: function (x, y, z) {
      if (x instanceof ape.Vec3) {
          this.localRotation.setFromEulerAngles(x.x, x.y, x.z);
      } else {
          this.localRotation.setFromEulerAngles(x, y, z);
      }

      if (!this._dirtyLocal)
          this._dirtifyLocal();
    },
    setLocalPosition: function (x, y, z) {
      if (x instanceof ape.Vec3) {
          this.localPosition.copy(x);
      } else {
          this.localPosition.set(x, y, z);
      }

      if (!this._dirtyLocal)
          this._dirtifyLocal();
    },
    setLocalRotation: function (x, y, z) {
      if (x instanceof ape.Quat) {
          this.localRotation.copy(x);
      } else {
          this.localRotation.set(x, y, z, w);
      }

      if (!this._dirtyLocal)
          this._dirtifyLocal();
    },
    setLocalScale: function (x, y, z) {
      if (x instanceof ape.Vec3) {
          this.localScale.copy(x);
      } else {
          this.localScale.set(x, y, z);
      }

      if (!this._dirtyLocal)
          this._dirtifyLocal();
    },
    setName: function (name) {
      this.name = name;
    },
    _dirtifyLocal: function () {
      if (!this._dirtyLocal) {
          this._dirtyLocal = true;
          if (!this._dirtyWorld)
              this._dirtifyWorld();
      }
    },
    _dirtifyWorld: function () {
      if (!this._dirtyWorld) {
          this._dirtyWorld = true;
          for (var i = 0; i < this._children.length; i++) {
              if (!this._children[i]._dirtyWorld)
                  this._children[i]._dirtifyWorld();
          }
      }
      this._dirtyNormal = true;
      this._aabbVer++;
    },
    setPosition: function () {
      var position = new ape.Vec3();
      var invParentWtm = new ape.Mat4();

      return function (x, y, z) {
          if (x instanceof ape.Vec3) {
              position.copy(x);
          } else {
              position.set(x, y, z);
          }

          if (this._parent === null) {
              this.localPosition.copy(position);
          } else {
              invParentWtm.copy(this._parent.getWorldTransform()).invert();
              invParentWtm.transformPoint(position, this.localPosition);
          }

          if (!this._dirtyLocal)
              this._dirtifyLocal();
      };
    }(),
    setRotation: function () {
      var rotation = new ape.Quat();
      var invParentRot = new ape.Quat();

      return function (x, y, z, w) {
          if (x instanceof ape.Quat) {
              rotation.copy(x);
          } else {
              rotation.set(x, y, z, w);
          }

          if (this._parent === null) {
              this.localRotation.copy(rotation);
          } else {
              var parentRot = this._parent.getRotation();
              invParentRot.copy(parentRot).invert();
              this.localRotation.copy(invParentRot).mul(rotation);
          }

          if (!this._dirtyLocal)
              this._dirtifyLocal();
      };
    }(),
    setEulerAngles: function () {
      var invParentRot = new ape.Quat();

      return function (x, y, z) {
          if (x instanceof ape.Vec3) {
              this.localRotation.setFromEulerAngles(x.x, x.y, x.z);
          } else {
              this.localRotation.setFromEulerAngles(x, y, z);
          }

          if (this._parent !== null) {
              var parentRot = this._parent.getRotation();
              invParentRot.copy(parentRot).invert();
              this.localRotation.mul2(invParentRot, this.localRotation);
          }

          if (!this._dirtyLocal)
              this._dirtifyLocal();
      };
    }(),
    addChild: function (node) {
      if (node._parent !== null)
          throw new Error("GraphNode is already parented");

      this._children.push(node);
      this._onInsertChild(node);
    },
    addChildAndSaveTransform: function (node) {
      var wPos = node.getPosition();
      var wRot = node.getRotation();

      var current = node._parent;
      if (current)
          current.removeChild(node);

      if (this.tmpMat4 === undefined) {
          this.tmpMat4 = new ape.Mat4();
          this.tmpQuat = new ape.Quat();
      }

      node.setPosition(this.tmpMat4.copy(this.worldTransform).invert().transformPoint(wPos));
      node.setRotation(this.tmpQuat.copy(this.getRotation()).invert().mul(wRot));

      this._children.push(node);

      this._onInsertChild(node);
    },
    insertChild: function (node, index) {
      if (node._parent !== null)
          throw new Error("GraphNode is already parented");

      this._children.splice(index, 0, node);
      this._onInsertChild(node);
    },
    _onInsertChild: function (node) {
      node._parent = this;

      // the child node should be enabled in the hierarchy only if itself is enabled and if
      // this parent is enabled
      var enabledInHierarchy = (node._enabled && this.enabled);
      if (node._enabledInHierarchy !== enabledInHierarchy) {
          node._enabledInHierarchy = enabledInHierarchy;

          // propagate the change to the children - necessary if we reparent a node
          // under a parent with a different enabled state (if we reparent a node that is
          // not active in the hierarchy under a parent who is active in the hierarchy then
          // we want our node to be activated)
          node._notifyHierarchyStateChanged(node, enabledInHierarchy);
      }

      // The graph depth of the child and all of its descendants will now change
      node._updateGraphDepth();

      // The child (plus subhierarchy) will need world transforms to be recalculated
      node._dirtifyWorld();

      // alert an entity that it has been inserted
      if (node.fire) node.fire('insert', this);

      // alert the parent that it has had a child inserted
      if (this.fire) this.fire('childinsert', node);
    },
    _updateGraphDepth: function () {
      if (this._parent) {
          this._graphDepth = this._parent._graphDepth + 1;
      } else {
          this._graphDepth = 0;
      }

      for (var i = 0, len = this._children.length; i < len; i++) {
          this._children[i]._updateGraphDepth();
      }
    },
    removeChild: function (child) {
      var i;
      var length = this._children.length;

      // Remove from child list
      for (i = 0; i < length; ++i) {
          if (this._children[i] === child) {
              this._children.splice(i, 1);

              // Clear parent
              child._parent = null;

              // alert the parent that it has had a child removed
              if (this.fire) this.fire('childremove', child);

              return;
          }
      }
    },
    addLabel: function (label) {
      this._labels[label] = true;
    },
    getLabels: function () {
      return Object.keys(this._labels);
    },
    hasLabel: function (label) {
      return !!this._labels[label];
    },
    removeLabel: function (label) {
      delete this._labels[label];
    },
    findByLabel: function (label, results) {
      var i, length = this._children.length;
      results = results || [];

      if (this.hasLabel(label)) {
          results.push(this);
      }

      for (i = 0; i < length; ++i) {
          results = this._children[i].findByLabel(label, results);
      }

      return results;
    },
    _sync: function () {
      if (this._dirtyLocal) {
          this.localTransform.setTRS(this.localPosition, this.localRotation, this.localScale);

          this._dirtyLocal = false;
      }

      if (this._dirtyWorld) {
          if (this._parent === null) {
              this.worldTransform.copy(this.localTransform);
          } else {
              if (this.scaleCompensation) {
                  var parentWorldScale;
                  var parent = this._parent;

                  // Find a parent of the first uncompensated node up in the hierarchy and use its scale * localScale
                  var scale = this.localScale;
                  var parentToUseScaleFrom = parent; // current parent
                  if (parentToUseScaleFrom) {
                      while (parentToUseScaleFrom && parentToUseScaleFrom.scaleCompensation) {
                          parentToUseScaleFrom = parentToUseScaleFrom._parent;
                      }
                      // topmost node with scale compensation
                      if (parentToUseScaleFrom) {
                          parentToUseScaleFrom = parentToUseScaleFrom._parent; // node without scale compensation
                          if (parentToUseScaleFrom) {
                              parentWorldScale = parentToUseScaleFrom.worldTransform.getScale();
                              scaleCompensateScale.mul2(parentWorldScale, this.localScale);
                              scale = scaleCompensateScale;
                          }
                      }
                  }

                  // Rotation is as usual
                  scaleCompensateRot2.setFromMat4(parent.worldTransform);
                  scaleCompensateRot.mul2(scaleCompensateRot2, this.localRotation);

                  // Find matrix to transform position
                  var tmatrix = parent.worldTransform;
                  if (parent.scaleCompensation) {
                      scaleCompensateScaleForParent.mul2(parentWorldScale, parent.getLocalScale());
                      scaleCompensatePosTransform.setTRS(parent.worldTransform.getTranslation(scaleCompensatePos),
                                                         scaleCompensateRot2,
                                                         scaleCompensateScaleForParent);
                      tmatrix = scaleCompensatePosTransform;
                  }
                  tmatrix.transformPoint(this.localPosition, scaleCompensatePos);

                  this.worldTransform.setTRS(scaleCompensatePos, scaleCompensateRot, scale);

              } else {
                  this.worldTransform.mul2(this._parent.worldTransform, this.localTransform);
              }
          }

          this._dirtyWorld = false;
      }
    },
    syncHierarchy: function () {
      if (!this._enabled)
          return;

      if (this._dirtyLocal || this._dirtyWorld) {
          this._sync();
      }

      var children = this._children;
      for (var i = 0, len = children.length; i < len; i++) {
          children[i].syncHierarchy();
      }
    },
    lookAt: function () {
      var matrix = new ape.Mat4();
      var target = new ape.Vec3();
      var up = new ape.Vec3();
      var rotation = new ape.Quat();

      return function (tx, ty, tz, ux, uy, uz) {
          if (tx instanceof ape.Vec3) {
              target.copy(tx);

              if (ty instanceof ape.Vec3) { // vec3, vec3
                  up.copy(ty);
              } else { // vec3
                  up.copy(ape.Vec3.UP);
              }
          } else if (tz === undefined) {
              return;
          } else {
              target.set(tx, ty, tz);

              if (ux !== undefined) { // number, number, number, number, number, number
                  up.set(ux, uy, uz);
              } else { // number, number, number
                  up.copy(ape.Vec3.UP);
              }
          }

          matrix.setLookAt(this.getPosition(), target, up);
          rotation.setFromMat4(matrix);
          this.setRotation(rotation);
      };
    }(),
    translate: function () {
      var translation = new ape.Vec3();

      return function (x, y, z) {
          if (x instanceof ape.Vec3) {
              translation.copy(x);
          } else {
              translation.set(x, y, z);
          }

          translation.add(this.getPosition());
          this.setPosition(translation);
      };
    }(),
    translateLocal: function () {
      var translation = new ape.Vec3();

      return function (x, y, z) {
          if (x instanceof ape.Vec3) {
              translation.copy(x);
          } else {
              translation.set(x, y, z);
          }

          this.localRotation.transformVector(translation, translation);
          this.localPosition.add(translation);

          if (!this._dirtyLocal)
              this._dirtifyLocal();
      };
    }(),
    rotate: function () {
      var quaternion = new ape.Quat();
      var invParentRot = new ape.Quat();

      return function (x, y, z) {
          if (x instanceof ape.Vec3) {
              quaternion.setFromEulerAngles(x.x, x.y, x.z);
          } else {
              quaternion.setFromEulerAngles(x, y, z);
          }

          if (this._parent === null) {
              this.localRotation.mul2(quaternion, this.localRotation);
          } else {
              var rot = this.getRotation();
              var parentRot = this._parent.getRotation();

              invParentRot.copy(parentRot).invert();
              quaternion.mul2(invParentRot, quaternion);
              this.localRotation.mul2(quaternion, rot);
          }

          if (!this._dirtyLocal)
              this._dirtifyLocal();
      };
    }(),
    rotateLocal: function () {
      var quaternion = new ape.Quat();

      return function (x, y, z) {
        if (x instanceof ape.Vec3) {
          quaternion.setFromEulerAngles(x.x, x.y, x.z);
        } else {
          quaternion.setFromEulerAngles(x, y, z);
        }

        this.localRotation.mul(quaternion);

        if (!this._dirtyLocal)
            this._dirtifyLocal();
      };
    }()
  });

  return {
    GraphNode: GraphNode
  };
}());
