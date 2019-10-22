Object.assign(ape, function () {
  var Key = function Key(time, position, rotation, scale) {
    this.time = time;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  };
  var Node = function Node() {
    this._name = "";
    this._keys = [];
  };
  var Animation = function Animation() {
    this.name = '';
    this.duration = 0;
    this._nodes = [];
    this._nodeDict = {};
  };
  Animation.prototype.getDuration = function () {
    return this.duration;
  };
  Animation.prototype.getName = function () {
    return this.name;
  };
  Animation.prototype.getNode = function (name) {
    return this._nodeDict[name];
  };
  Object.defineProperty(Animation.prototype, 'nodes', {
    get: function () {
      return this._nodes;
    }
  });
  //data struct
  Animation.prototype.getNodes = function () {
    return this._nodes;
  };
  Animation.prototype.setDuration = function (duration) {
    this.duration = duration;
  };
  Animation.prototype.setName = function (name) {
    this.name = name;
  };
  Animation.prototype.addNode = function (node) {
    this._nodes.push(node);
    this._nodes[node._name] = node;
  };

  return {
    Animation: Animation,
    Key: Key,
    Node: Node
  };
}());
