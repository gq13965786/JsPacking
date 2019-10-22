Object.assign(ape.fw, function () {
  var LiveLinkMessage = function (data, source) {
    data = data || {};
    this.type = data.type || ape.fw.LiveLinkMessageType.NO_TYPE;
    this.content = data.content || {};
    this.id = data.id || ape.guid.create();
    this.sendid = data.senderid || null;
    this.source = source || null;
  };

  LiveLinkMessage.prototype.register = function (type) {
    ape.fw.LiveLinkMessage[type] = type;
  };
  LiveLinkMessage.prototype.serialize = function (msg) {
    var o = {
      type: msg.type,
      content: msg.content,
      id: msg.id,
      senderid: msg.senderid
    };

    return JSON.stringify(o, function (key, value) {
      if (this[key] instanceof Float32Array) {
        return ape.makeArray(this[key]);
      } else {
        return this[key];
      }
    });
  };
  LiveLinkMessage.prototype.deserialize = function (data) {
    try {
      var o = JSON.parse(data);
      return o;
    } catch (e) {
      return null;
    }
  };

  return {
    LiveLinkMessage: LiveLinkMessage,
    LiveLinkMessageRegister: {},
    LiveLinkMessageType: {
      NO_TYPE: "NO_TYPE",
      RECEIVED: "RECEIVED"
    }
  };
}());
