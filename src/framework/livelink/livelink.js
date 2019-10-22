Object.assign(ape.fw, function () {

  var LiveLink = function () {
    this._destinations = [];
    this._callbacks = {};
    this._linkid = ape.guid.create();
    this._listener = null;
    this._handler = ape.callback(this, this._handleMessage);
    window.addEventListener("message", this._handler, false);
  }

  LiveLink.prototype.detach = function () {
    this._listener = null;
    window.removeEventListener("message", thie._handler, false);
  };
  LiveLink.prototype.addDestinationWindow = function (_window) {
    this._destinations.push(_window);
  };
  LiveLink.prototype.removeDestinationWindow = function (window) {
    var i;
    for (i = 0; i < this._destinations.length; ++i) {
        if(this._destinations[i] == window) {
            this._destinations.splice(i, 1);
            break;
        }
    }
  };

  LiveLink.prototype.send = function (msg, success) {
    success = success || function () {};

    this._destinations.forEach( function (w, index, arr) {
      var origin = w.location.protocol + "//" + w.location.host;
      this._send(msg, success, w, origin);
    }, this);
  };
  LiveLink.prototype._send = function (msg, success, _window, origin) {
    logINFO("Send:" + msg.type);
    msg.senderid = this._linkid;
    if (this._callbacks[msg.id]) {
      this._callbacks[msg.id].count++;
    } else {
      this._callbacks[msg.id] = {
        count: 1,
        callback: ape.callback(this, success)
      }
    }
    var data = ape.fw.LiveLinkMessage.serialize(msg);
    _winow.postMessage(data, origin);
  };
  LiveLink.prototype.listen = function (callback, _window) {
    if (this._listener) {
      throw new Error("LiveLink already listening");
    }
    this._listener = callback;
  };
  LiveLink.prototype._handleMessage = function (event) {
    var msg, newmsg;
    var data = ape.fw.LiveLinkMessage.deserialize(event.data);

    if(!data) {
        return;
    }
    msg = new ape.fw.LiveLinkMessage(data, event.source);

    if(msg.type == ape.fw.LiveLinkMessageType.RECEIVED) {
        // If this is a receipt of a message that this LiveLink has sent
        if(msg.content.received_from == this._linkid) {
            // Call the callback and delete it
            this._callbacks[msg.content.id].count--;
            if(this._callbacks[msg.content.id].count == 0) {
                this._callbacks[msg.content.id].callback();
                delete this._callbacks[msg.content.id];
            }
        }
    } else if(this._listener) {
        // Fire off the listener callback
        this._listener(msg);

        // send a receipt so the sender knows we received the message
        newmsg = new ape.fw.LiveLinkMessage();
        newmsg.type = ape.fw.LiveLinkMessageType.RECEIVED;
        newmsg.content = {
            id: msg.id,
            received_from: msg.senderid
        };
        this._send(newmsg, null, event.source, event.origin);
    } else {
        // do nothing
    }
  };

  return {
    LiveLink: LiveLink
  };
}());
