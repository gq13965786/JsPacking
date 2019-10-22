Object.assign(ape.scene, function () {
  var GraphNode = function GraphNode(name) {
    this._name = name || "";//Non-unique human readable name
    this._ltm = new ape.Mat4();
    this._wtm = new ape.Mat4();
    this._parent = null;
    this._children = [];
    this._labels = {};
    this._graphId = -1;
  };

  GraphNode.prototype.clone = function () {
    var clone = new ape.scene.GraphNode();

    //GraphNode
    clone.setName(this.getName());
    clone.setLocalTransform(ape.Mat4.clone(this.getLocalTransform()));
    clone._graphId = this._graphId;

    return clone;
  };
  GraphNode.prototype.addGraphId = function (id) {
    this._graphId = id;
  };
  GraphNode.prototype.removeGraphId = function () {
    delete this._graphId;
  };
  GraphNode.prototype.find = function (attr, value) {
    var i;
    var children = this.getChildren();
    var length = children.length;
    var results = [];
    if(this[attr]) {
        if(this[attr] instanceof Function) {
            testValue = this[attr]();
        } else {
            testValue = this[attr];
        }
        if(testValue === value) {
            results.push(this);
        }
    }

    for(i = 0; i < length; ++i) {
        results = results.concat(children[i].find(attr, value));
    }

    return results;
  };
  GraphNode.prototype.findOne = function (attr, value) {
    var i;
    var children = this.getChildren();
    var length = children.length;
    var result = null;
    if(this[attr]) {
        if(this[attr] instanceof Function) {
            testValue = this[attr]();
        } else {
            testValue = this[attr];
        }
        if(testValue === value) {
            return this;
        }
    }

    for(i = 0; i < length; ++i) {
         result = children[i].findOne(attr, value);
         if(result !== null) {
             return result;
         }
    }

    return null;
  };
  GraphNode.prototype.findByName = function (name) {
    if (this._name === name) return this;

    for (var i = 0; i < this._children.length; i++) {
        var found = this._children[i].findByName(name);
        if (found !== null) return found;
    }
    return null;
  };
  GraphNode.prototype.findByGraphId = function (id) {
    if (this._graphId === id) return this;

    for (var i = 0; i < this._children.length; i++) {
        var found = this._children[i].findByGraphId(id);
        if (found !== null) return found;
    }
    return null;
  };
  GraphNode.prototype.getRoot = function () {
    var parent = this.getParent();
    if (!parent) {
      return this;
    }

    while(parent.getParent()) {
      parent = parent.getParent();
    }
    return parent;
  };
  GraphNode.prototype.getParent = function () {
    return this._parent;
  };
  GraphNode.prototype.getChildren = function () {
    return this._children;
  };
  GraphNode.prototype.getLocalTransform = function () {
    return this._ltm;
  };
  GraphNode.prototype.getName = function () {
    return this._name;
  };
  GraphNode.prototype.getWorldTransform = function () {
    return this._wtm;
  };
  GraphNode.prototype.setParent = function (node) {
    this._parent = node;
  };
  GraphNode.prototype.setChildren = function (children) {
    this._children = children;
  };
  GraphNode.prototype.setLocalTransform = function (ltm) {
    this._ltm = ltm;
  };
  GraphNode.prototype.setName = function (name) {
    this._name = name;
  };
  GraphNode.prototype.addChild = function (node) {
    if (node._parent != null) {
      throw new Error("GraphNode is already parented");
    }

    this._children.push(node);
    node.setParent(this);
  };
  GraphNode.prototype.removeChild = function (child) {
    var i;
    var length = this._children.length;

    //clear parent
    child.setParent(null);

    //Remove from child list
    for (i = 0; i < length; ++i) {
      if (this._children[i] === child) {
        this._children.splice(i, 1);
        return;
      }
    }
  };
  GraphNode.prototype.addLabel = function (label) {
    this._labels[label] = true;
  };
  GraphNode.prototype.getLabels = function () {
    return Object.keys(this._labels);
  };
  GraphNode.prototype.hasLabel = function (label) {
    return !!this._labels[label];
  };
  GraphNode.prototype.removeLabel = function (label) {
    delete this._labels[label];
  };
  GraphNode.prototype.findByLabel = function (label, results) {
    var i, length = this._children.length;
    results = results || [];

    if(this.hasLabel(label)) {
        results.push(this);
    }

    for(i = 0; i < length; ++i) {
        results = this._children[i].findByLabel(label, results);
    }

    return results;
  };
  GraphNode.prototype.syncHierarchy = function () {
    function _syncHierarchy(node, parentTransform) {
        // Now calculate this nodes world space transform
        //ape.Mat4.multiply(parentTransform, node._ltm, node._wtm);
        //node._wtm.mul2(parentTransform, node._ltm);


        // Sync subhierarchy
        for (var i = 0, len = node._children.length; i < len; i++) {
            _syncHierarchy(node._children[i], node._wtm);
        }
    }

    _syncHierarchy(this, ape.Mat4());
  };

  return {
    GraphNode: GraphNode
  };
}());
