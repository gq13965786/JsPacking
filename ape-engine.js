;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        try {
            var JSDOM = require("jsdom").JSDOM;
            var DOM = new JSDOM();
            var window = DOM.window;
            var navigator = window.navigator;
            module.exports = factory(window, navigator);
        } catch (error) {
            module.exports = factory();
        }
    } else {
        root.ape = factory(root, root.navigator);
  }
}(this, function (_window, _navigator) {
  window = _window || window;
  navigator = _navigator || navigator;

  var _typeLookup = function() {
  var result = {};
  var names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];
  for (var i = 0; i < names.length; i++) {
    result["[object " + names[i] + "]"] = names[i].toLowerCase();
  }
  return result;
}();
var ape = {version:"0.1", config:{}, common:{}, apps:{}, data:{}, unpack:function() {
  console.warn("ape.unpack has been deprecated and will be removed shortly. Please update your code.");
}, makeArray:function(array) {
  var i, ret = [], length = array.length;
  for (i = 0; i < length; ++i) {
    ret.push(array[i]);
  }
  return ret;
}, type:function(obj) {
  if (obj === null) {
    return "null";
  }
  var type = typeof obj;
  if (type === "undefined" || type === "number" || type === "string" || type === "boolean") {
    return type;
  }
  return _typeLookup[Object.prototype.toString.call(obj)];
}, extend:function(target, ex) {
  var prop, copy;
  for (prop in ex) {
    copy = ex[prop];
    if (ape.type(copy) == "object") {
      target[prop] = ape.extend({}, copy);
    } else {
      if (ape.type(copy) == "array") {
        target[prop] = ape.extend([], copy);
      } else {
        target[prop] = copy;
      }
    }
  }
  return target;
}, isDefined:function(o) {
  var a;
  return o !== a;
}, callback:function(self, fn) {
  return function() {
    var args = ape.makeArray(arguments);
    return fn.apply(self, args);
  };
}};
if (typeof exports !== "undefined") {
  exports.ape = ape;
}
;(function() {
  if (typeof document === "undefined") {
    return;
  }
  var fullscreenchange = function(event) {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent("fullscreenchange", true, false, null);
    event.target.dispatchEvent(e);
  };
  var fullscreenerror = function(event) {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent("fullscreenerror", true, false, null);
    event.target.dispatchEvent(e);
  };
  document.addEventListener("webkitfullscreenchange", fullscreenchange, false);
  document.addEventListener("mozfullscreenchange", fullscreenchange, false);
  document.addEventListener("MSFullscreenChange", fullscreenchange, false);
  document.addEventListener("webkitfullscreenerror", fullscreenerror, false);
  document.addEventListener("mozfullscreenerror", fullscreenerror, false);
  document.addEventListener("MSFullscreenError", fullscreenerror, false);
  if (Element.prototype.mozRequestFullScreen) {
    Element.prototype.requestFullscreen = function() {
      this.mozRequestFullScreen();
    };
  } else {
    Element.prototype.requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.msRequestFullscreen;
  }
  document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
  if (!document.hasOwnProperty("fullscreenElement")) {
    Object.defineProperty(document, "fullscreenElement", {enumerable:true, configurable:false, get:function() {
      return document.webkitCurrentFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }});
  }
  if (!document.hasOwnProperty("fullscreenEnabled")) {
    Object.defineProperty(document, "fullscreenEnabled", {enumerable:true, configurable:false, get:function() {
      return document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    }});
  }
})();
Math.log2 = Math.log2 || function(x) {
  return Math.log(x) * Math.LOG2E;
};
if (typeof Object.assign != "function") {
  Object.defineProperty(Object, "assign", {value:function assign(target, varArgs) {
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];
      if (nextSource != null) {
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  }, writable:true, configurable:true});
}
;(function() {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    return;
  }
  navigator.pointer = navigator.pointer || navigator.webkitPointer || navigator.mozPointer;
  var pointerlockchange = function() {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent("pointerlockchange", true, false, null);
    document.dispatchEvent(e);
  };
  var pointerlockerror = function() {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent("pointerlockerror", true, false, null);
    document.dispatchEvent(e);
  };
  document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
  document.addEventListener("webkitpointerlocklost", pointerlockchange, false);
  document.addEventListener("mozpointerlockchange", pointerlockchange, false);
  document.addEventListener("mozpointerlocklost", pointerlockchange, false);
  document.addEventListener("webkitpointerlockerror", pointerlockerror, false);
  document.addEventListener("mozpointerlockerror", pointerlockerror, false);
  if (Element.prototype.mozRequestPointerLock) {
    Element.prototype.requestPointerLock = function() {
      this.mozRequestPointerLock();
    };
  } else {
    Element.prototype.requestPointerLock = Element.prototype.requestPointerLock || Element.prototype.webkitRequestPointerLock || Element.prototype.mozRequestPointerLock;
  }
  if (!Element.prototype.requestPointerLock && navigator.pointer) {
    Element.prototype.requestPointerLock = function() {
      var el = this;
      document.pointerLockElement = el;
      navigator.pointer.lock(el, pointerlockchange, pointerlockerror);
    };
  }
  document.exitPointerLock = document.exitPointerLock || document.webkitExitPointerLock || document.mozExitPointerLock;
  if (!document.exitPointerLock) {
    document.exitPointerLock = function() {
      if (navigator.pointer) {
        document.pointerLockElement = null;
        navigator.pointer.unlock();
      }
    };
  }
})();
(function() {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = (new Date).getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== "number") {
      start = 0;
    }
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}
;Object.assign(ape, function() {
  var Color = function(r, g, b, a) {
    var length = r && r.length;
    if (length === 3 || length === 4) {
      this.r = r[0];
      this.g = r[1];
      this.b = r[2];
      this.a = r[3] !== undefined ? r[3] : 1;
    } else {
      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a !== undefined ? a : 1;
    }
  };
  Object.assign(Color.prototype, {clone:function() {
    return new ape.Color(this.r, this.g, this.b, this.a);
  }, copy:function(rhs) {
    this.r = rhs.r;
    this.g = rhs.g;
    this.b = rhs.b;
    this.a = rhs.a;
    return this;
  }, set:function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a === undefined ? 1 : a;
    return this;
  }, lerp:function(lhs, rhs, alpha) {
    this.r = lhs.r + alpha * (rhs.r - lhs.r);
    this.g = lhs.g + alpha * (rhs.g - lhs.g);
    this.b = lhs.b + alpha * (rhs.b - lhs.b);
    this.a = lhs.a + alpha * (rhs.a - lhs.a);
    return this;
  }, fromString:function(hex) {
    var i = parseInt(hex.replace("#", "0x"), 16);
    var bytes;
    if (hex.length > 7) {
      bytes = ape.math.intToBytes32(i);
    } else {
      bytes = ape.math.intToBytes24(i);
      bytes[3] = 255;
    }
    this.set(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] / 255);
    return this;
  }, toString:function(alpha) {
    var s = "#" + ((1 << 24) + (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255)).toString(16).slice(1);
    if (alpha === true) {
      var a = Math.round(this.a * 255).toString(16);
      if (this.a < 16 / 255) {
        s += "0" + a;
      } else {
        s += a;
      }
    }
    return s;
  }});
  return {Color:Color};
}());
ape.guid = function() {
  return {create:function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }};
}();
Object.assign(ape, function() {
  var Timer = function Timer() {
    this._isRunning = false;
    this._a = 0;
    this._b = 0;
  };
  Object.assign(Timer.prototype, {start:function() {
    this._isRunning = true;
    this._a = ape.now();
  }, stop:function() {
    this._isRunning = false;
    this._b = ape.now();
  }, getMilliseconds:function() {
    return this._b - this._a;
  }});
  return {Timer:Timer, now:!window.performance || !window.performance.now || !window.performance.timing ? Date.now : function() {
    return window.performance.now();
  }};
}());
Object.assign(ape, function() {
  return {hashCode:function(str) {
    var hash = 0;
    for (var i = 0, len = str.length; i < len; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }};
}());
Object.assign(ape, function() {
  return {createURI:function(options) {
    var s = "";
    if ((options.authority || options.scheme) && (options.host || options.hostpath)) {
      throw new Error("Can't have 'scheme' or 'authority' and 'host' or 'hostpath' option");
    }
    if (options.host && options.hostpath) {
      throw new Error("Can't have 'host' and 'hostpath' option");
    }
    if (options.path && options.hostpath) {
      throw new Error("Can't have 'path' and 'hostpath' option");
    }
    if (options.scheme) {
      s += options.scheme + ":";
    }
    if (options.authority) {
      s += "//" + options.authority;
    }
    if (options.host) {
      s += options.host;
    }
    if (options.path) {
      s += options.path;
    }
    if (options.hostpath) {
      s += options.hostpath;
    }
    if (options.query) {
      s += "?" + options.query;
    }
    if (options.fragment) {
      s += "#" + options.fragment;
    }
    return s;
  }, URI:function(uri) {
    var re = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/, result = uri.match(re);
    this.scheme = result[2];
    this.authority = result[4];
    this.path = result[5];
    this.query = result[7];
    this.fragment = result[9];
    this.toString = function() {
      var s = "";
      if (this.scheme) {
        s += this.scheme + ":";
      }
      if (this.authority) {
        s += "//" + this.authority;
      }
      s += this.path;
      if (this.query) {
        s += "?" + this.query;
      }
      if (this.fragment) {
        s += "#" + this.fragment;
      }
      return s;
    };
    this.getQuery = function() {
      var vars;
      var pair;
      var result = {};
      if (this.query) {
        vars = decodeURIComponent(this.query).split("&");
        vars.forEach(function(item, index, arr) {
          pair = item.split("=");
          result[pair[0]] = pair[1];
        }, this);
      }
      return result;
    };
    this.setQuery = function(params) {
      var q = "";
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          if (q !== "") {
            q += "&";
          }
          q += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        }
      }
      this.query = q;
    };
  }};
}());
Object.assign(ape, function() {
  var log = {write:function(text) {
    console.log(text);
  }, open:function(text) {
    ape.log.write("Powered by 9 arts, ape engine" + ape.version + " ^_^ ");
  }, info:function(text) {
    console.info("INFO:   " + text);
  }, debug:function(text) {
    console.debug("DEBUG:   " + text);
  }, error:function(text) {
    console.error("ERROR:   " + text);
  }, warning:function(text) {
    console.warn("WARNING:    " + text);
  }, alert:function(text) {
    ape.log.write("ALERT:   " + text);
    alert(text);
  }, assert:function(condition, text) {
    if (condition === false) {
      ape.log.write("ASSET:   " + text);
    }
  }};
  return {log:log};
}());
var logINFO = ape.log.info;
var logDEBUG = ape.log.debug;
var logWARNING = ape.log.warning;
var logERROR = ape.log.error;
var logALERT = ape.log.alert;
var logASSERT = ape.log.assert;
ape.path = function() {
  return {delimiter:"/", join:function() {
    var index;
    var num = arguments.length;
    var result = arguments[0];
    for (index = 0; index < num - 1; ++index) {
      var one = arguments[index];
      var two = arguments[index + 1];
      if (!ape.isDefined(one) || !ape.isDefined(two)) {
        throw new Error("undefined argument to ape.path.join");
      }
      if (two[0] === ape.path.delimiter) {
        result = two;
        continue;
      }
      if (one && two && one[one.length - 1] !== ape.path.delimiter && two[0] !== ape.path.delimiter) {
        result += ape.path.delimiter + two;
      } else {
        result += two;
      }
    }
    return result;
  }, normalize:function(path) {
    var lead = path.startsWith(ape.path.delimiter);
    var trail = path.endsWith(ape.path.delimiter);
    var parts = path.split("/");
    var result = "";
    var cleaned = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === "") {
        continue;
      }
      if (parts[i] === ".") {
        continue;
      }
      if (parts[i] === ".." && cleaned.length > 0) {
        cleaned = cleaned.slice(0, cleaned.length - 2);
        continue;
      }
      if (i > 0) {
        cleaned.push(ape.path.delimiter);
      }
      cleaned.push(parts[i]);
    }
    result = cleaned.join("");
    if (!lead && result[0] === ape.path.delimiter) {
      result = result.slice(1);
    }
    if (trail && result[result.length - 1] !== ape.path.delimiter) {
      result += ape.path.delimiter;
    }
    return result;
  }, split:function(path) {
    var parts = path.split(ape.path.delimiter);
    var tail = parts.slice(parts.length - 1)[0];
    var head = parts.slice(0, parts.length - 1).join(ape.path.delimiter);
    return [head, tail];
  }, getBasename:function(path) {
    return ape.path.split(path)[1];
  }, getDirectory:function(path) {
    var parts = path.split(ape.path.delimiter);
    return parts.slice(0, parts.length - 1).join(ape.path.delimiter);
  }, getExtension:function(path) {
    var ext = path.split("?")[0].split(".").pop();
    if (ext !== path) {
      return "." + ext;
    }
    return "";
  }, isRelativePath:function(s) {
    return s.charAt(0) !== "/" && s.match(/:\/\//) === null;
  }, extractPath:function(s) {
    var path = ".", parts = s.split("/"), i = 0;
    if (parts.length > 1) {
      if (ape.path.isRelativePath(s) === false) {
        path = "";
      }
      for (i = 0; i < parts.length - 1; ++i) {
        path += "/" + parts[i];
      }
    }
    return path;
  }};
}();
ape.string = function() {
  var ASCII_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  var ASCII_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var ASCII_LETTERS = ASCII_LOWERCASE + ASCII_UPPERCASE;
  var HIGH_SURROGATE_BEGIN = 55296;
  var HIGH_SURROGATE_END = 56319;
  var LOW_SURROGATE_BEGIN = 56320;
  var LOW_SURROGATE_END = 57343;
  var ZERO_WIDTH_JOINER = 8205;
  var REGIONAL_INDICATOR_BEGIN = 127462;
  var REGIONAL_INDICATOR_END = 127487;
  var FITZPATRICK_MODIFIER_BEGIN = 127995;
  var FITZPATRICK_MODIFIER_END = 127999;
  var DIACRITICAL_MARKS_BEGIN = 8400;
  var DIACRITICAL_MARKS_END = 8447;
  var VARIATION_MODIFIER_BEGIN = 65024;
  var VARIATION_MODIFIER_END = 65039;
  function getCodePointData(string, i) {
    var size = string.length;
    i = i || 0;
    if (i < 0 || i >= size) {
      return null;
    }
    var first = string.charCodeAt(i);
    var second;
    if (size > 1 && first >= HIGH_SURROGATE_BEGIN && first <= HIGH_SURROGATE_END) {
      second = string.charCodeAt(i + 1);
      if (second >= LOW_SURROGATE_BEGIN && second <= LOW_SURROGATE_END) {
        return {code:(first - HIGH_SURROGATE_BEGIN) * 1024 + second - LOW_SURROGATE_BEGIN + 65536, long:true};
      }
    }
    return {code:first, long:false};
  }
  function isCodeBetween(string, begin, end) {
    if (!string) {
      return false;
    }
    var codeData = getCodePointData(string);
    if (codeData) {
      var code = codeData.code;
      return code >= begin && code <= end;
    }
    return false;
  }
  function numCharsToTakeForNextSymbol(string, index) {
    if (index === string.length - 1) {
      return 1;
    }
    if (isCodeBetween(string[index], HIGH_SURROGATE_BEGIN, HIGH_SURROGATE_END)) {
      var first = string.substring(index, index + 2);
      var second = string.substring(index + 2, index + 4);
      if (isCodeBetween(second, FITZPATRICK_MODIFIER_BEGIN, FITZPATRICK_MODIFIER_END) || isCodeBetween(first, REGIONAL_INDICATOR_BEGIN, REGIONAL_INDICATOR_END) && isCodeBetween(second, REGIONAL_INDICATOR_BEGIN, REGIONAL_INDICATOR_END)) {
        return 4;
      }
      return 2;
    }
    return 1;
  }
  return {ASCII_LOWERCASE:ASCII_LOWERCASE, ASCII_UPPERCASE:ASCII_UPPERCASE, ASCII_LETTERS:ASCII_LETTERS, format:function(s) {
    var i = 0, regexp, args = ape.makeArray(arguments);
    args.shift();
    for (i = 0; i < args.length; i++) {
      regexp = new RegExp("\\{" + i + "\\}", "gi");
      s = s.replace(regexp, args[i]);
    }
    return s;
  }, startsWith:function(s, subs) {
    console.warn("WARNING: startsWith: Function is deprecated. Use String.startsWith instead.");
    return s.startsWith(subs);
  }, endsWith:function(s, subs) {
    console.warn("WARNING: endsWith: Function is deprecated. Use String.endsWith instead.");
    return s.endsWith(subs);
  }, toBool:function(s, strict) {
    if (s === "true") {
      return true;
    }
    if (strict) {
      if (s === "false") {
        return false;
      }
      throw new TypeError("Not a boolean string");
    }
    return false;
  }, getCodePoint:function(string, i) {
    var codePointData = getCodePointData(string, i);
    return codePointData && codePointData.code;
  }, getCodePoints:function(string) {
    if (typeof string !== "string") {
      throw new TypeError("Not a string");
    }
    var i = 0;
    var arr = [];
    var codePoint;
    while (!!(codePoint = getCodePointData(string, i))) {
      arr.push(codePoint.code);
      i += codePoint.long ? 2 : 1;
    }
    return arr;
  }, getSymbols:function(string) {
    if (typeof string !== "string") {
      throw new TypeError("Not a string");
    }
    var index = 0;
    var length = string.length;
    var output = [];
    var take = 0;
    var ch;
    while (index < length) {
      take += numCharsToTakeForNextSymbol(string, index + take);
      ch = string[index + take];
      if (isCodeBetween(ch, DIACRITICAL_MARKS_BEGIN, DIACRITICAL_MARKS_END)) {
        ch = string[index + take++];
      }
      if (isCodeBetween(ch, VARIATION_MODIFIER_BEGIN, VARIATION_MODIFIER_END)) {
        ch = string[index + take++];
      }
      if (ch && ch.charCodeAt(0) === ZERO_WIDTH_JOINER) {
        ch = string[index + take++];
        continue;
      }
      var char = string.substring(index, index + take);
      output.push(char);
      index += take;
      take = 0;
    }
    return output;
  }, fromCodePoint:function() {
    var chars = [];
    var current;
    var codePoint;
    var units;
    for (var i = 0; i < arguments.length; ++i) {
      current = Number(arguments[i]);
      codePoint = current - 65536;
      units = current > 65535 ? [(codePoint >> 10) + 55296, codePoint % 1024 + 56320] : [current];
      chars.push(String.fromCharCode.apply(null, units));
    }
    return chars.join("");
  }};
}();
ape.debug = function() {
  var table = null;
  var row = null;
  var title = null;
  var field = null;
  return {display:function(data) {
    function init() {
      table = document.createElement("table");
      row = document.createElement("tr");
      title = document.createElement("td");
      field = document.createElement("td");
      table.style.cssText = "position:absolute;font-family:sans-serif;font-size:12px;color:#cccccc";
      table.style.top = "0px";
      table.style.left = "0px";
      table.style.border = "thin solid #cccccc";
      document.body.appendChild(table);
    }
    if (!table) {
      init();
    }
    table.innerHTML = "";
    for (var key in data) {
      var r = row.cloneNode();
      var t = title.cloneNode();
      var f = field.cloneNode();
      t.textContent = key;
      f.textContent = data[key];
      r.appendChild(t);
      r.appendChild(f);
      table.appendChild(r);
    }
  }};
}();
ape.events = {attach:function(target) {
  var ev = ape.events;
  target.on = ev.on;
  target.off = ev.off;
  target.fire = ev.fire;
  target.once = ev.once;
  target.hasEvent = ev.hasEvent;
  target._callbackActive = {};
  return target;
}, on:function(name, callback, scope) {
  if (!name || typeof name !== "string" || !callback) {
    return this;
  }
  if (!this._callbacks) {
    this._callbacks = {};
  }
  if (!this._callbacks[name]) {
    this._callbacks[name] = [];
  }
  if (!this._callbackActive) {
    this._callbackActive = {};
  }
  if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name]) {
    this._callbackActive[name] = this._callbackActive[name].slice();
  }
  this._callbacks[name].push({callback:callback, scope:scope || this});
  return this;
}, off:function(name, callback, scope) {
  if (!this._callbacks) {
    return this;
  }
  if (this._callbackActive) {
    if (name) {
      if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name]) {
        this._callbackActive[name] = this._callbackActive[name].slice();
      }
    } else {
      for (var key in this._callbackActive) {
        if (!this._callbacks[key]) {
          continue;
        }
        if (this._callbacks[key] !== this._callbackActive[key]) {
          continue;
        }
        this._callbackActive[key] = this._callbackActive[key].slice();
      }
    }
  }
  if (!name) {
    this._callbacks = null;
  } else {
    if (!callback) {
      if (this._callbacks[name]) {
        delete this._callbacks[name];
      }
    } else {
      var events = this._callbacks[name];
      if (!events) {
        return this;
      }
      var i = events.length;
      while (i--) {
        if (events[i].callback !== callback) {
          continue;
        }
        if (scope && events[i].scope !== scope) {
          continue;
        }
        events.splice(i, 1);
      }
    }
  }
  return this;
}, fire:function(name, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  if (!name || !this._callbacks || !this._callbacks[name]) {
    return this;
  }
  var callbacks;
  if (!this._callbackActive) {
    this._callbackActive = {};
  }
  if (!this._callbackActive[name]) {
    this._callbackActive[name] = this._callbacks[name];
  } else {
    if (this._callbackActive[name] === this._callbacks[name]) {
      this._callbackActive[name] = this._callbackActive[name].slice();
    }
    callbacks = this._callbacks[name].slice();
  }
  for (var i = 0; (callbacks || this._callbackActive[name]) && i < (callbacks || this._callbackActive[name]).length; i++) {
    var evt = (callbacks || this._callbackActive[name])[i];
    evt.callback.call(evt.scope, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
    if (evt.callback.once) {
      var ind = this._callbacks[name].indexOf(evt);
      if (ind !== -1) {
        if (this._callbackActive[name] === this._callbacks[name]) {
          this._callbackActive[name] = this._callbackActive[name].slice();
        }
        this._callbacks[name].splice(ind, 1);
      }
    }
  }
  if (!callbacks) {
    this._callbackActive[name] = null;
  }
  return this;
}, once:function(name, callback, scope) {
  callback.once = true;
  this.on(name, callback, scope);
  return this;
}, hasEvent:function(name) {
  return this._callbacks && this._callbacks[name] && this._callbacks[name].length !== 0 || false;
}};
Object.assign(ape, function() {
  var TagsCache = function(key) {
    this._index = {};
    this._key = key || null;
  };
  Object.assign(TagsCache.prototype, {addItem:function(item) {
    var tags = item.tags._list;
    for (var i = 0; i < tags.length; i++) {
      this.add(tags[i], item);
    }
  }, removeItem:function(item) {
    var tags = item.tags._list;
    for (var i = 0; i < tags.length; i++) {
      this.remove(tags[i], item);
    }
  }, add:function(tag, item) {
    if (this._index[tag] && this._index[tag].list.indexOf(item) !== -1) {
      return;
    }
    if (!this._index[tag]) {
      this._index[tag] = {list:[]};
      if (this._key) {
        this._index[tag].keys = {};
      }
    }
    this._index[tag].list.push(item);
    if (this._key) {
      this._index[tag].keys[item[this._key]] = item;
    }
  }, remove:function(tag, item) {
    if (!this._index[tag]) {
      return;
    }
    if (this._key) {
      if (!this._index[tag].keys[item[this._key]]) {
        return;
      }
    }
    var ind = this._index[tag].indexOf(item);
    if (ind === -1) {
      return;
    }
    this._index[tag].list.splice(ind, 1);
    if (this._key) {
      delete this._index[tag].keys[item[this._key]];
    }
    if (this._index[tag].list.length === 0) {
      delete this._index[tag];
    }
  }, find:function(args) {
    var self = this;
    var index = {};
    var items = [];
    var i, n, t;
    var item, tag, tags, tagsRest, missingIndex;
    var sort = function(a, b) {
      return self._index[a].list.length - self._index[b].list.length;
    };
    for (i = 0; i < args.length; i++) {
      tag = args[i];
      if (tag instanceof Array) {
        if (tag.length === 0) {
          continue;
        }
        if (tag.length === 1) {
          tag = tag[0];
        } else {
          missingIndex = false;
          for (t = 0; t < tag.length; t++) {
            if (!this._index[tag[t]]) {
              missingIndex = true;
              break;
            }
          }
          if (missingIndex) {
            continue;
          }
          tags = tag.slice(0).sort(sort);
          tagsRest = tags.slice(1);
          if (tagsRest.length === 1) {
            tagsRest = tagsRest[0];
          }
          for (n = 0; n < this._index[tags[0]].list.length; n++) {
            item = this._index[tags[0]].list[n];
            if ((this._key ? !index[item[this._key]] : items.indexOf(item) === -1) && item.tags.has(tagsRest)) {
              if (this._key) {
                index[item[this._key]] = true;
              }
              items.push(item);
            }
          }
          continue;
        }
      }
      if (tag && typeof tag === "string" && this._index[tag]) {
        for (n = 0; n < this._index[tag].list.length; n++) {
          item = this._index[tag].list[n];
          if (this._key) {
            if (!index[item[this._key]]) {
              index[item[this._key]] = true;
              items.push(item);
            }
          } else {
            if (items.indexOf(item) === -1) {
              items.push(item);
            }
          }
        }
      }
    }
    return items;
  }});
  var Tags = function(parent) {
    this._index = {};
    this._list = [];
    this._parent = parent;
    ape.events.attach(this);
  };
  Object.assign(Tags.prototype, {add:function() {
    var changed = false;
    var tags = this._processArguments(arguments, true);
    if (!tags.length) {
      return changed;
    }
    for (var i = 0; i < tags.length; i++) {
      if (this._index[tags[i]]) {
        continue;
      }
      changed = true;
      this._index[tags[i]] = true;
      this._list.push(tags[i]);
      this.fire("add", tags[i], this._parent);
    }
    if (changed) {
      this.fire("change", this._parent);
    }
    return changed;
  }, remove:function() {
    var changed = false;
    if (!this._list.length) {
      return changed;
    }
    var tags = this._processArguments(arguments, true);
    if (!tags.length) {
      return changed;
    }
    for (var i = 0; i < tags.length; i++) {
      if (!this._index[tags[i]]) {
        continue;
      }
      changed = true;
      delete this._index[tags[i]];
      this._list.splice(this._list.indexOf(tags[i]), 1);
      this.fire("remove", tags[i], this._parent);
    }
    if (changed) {
      this.fire("change", this._parent);
    }
    return changed;
  }, clear:function() {
    if (!this._list.length) {
      return;
    }
    var tags = this._list.slice(0);
    this._list = [];
    this._index = {};
    for (var i = 0; i < tags.length; i++) {
      this.fire("remove", tags[i], this._parent);
    }
    this.fire("change", this._parent);
  }, has:function() {
    if (!this._list.length) {
      return false;
    }
    return this._has(this._processArguments(arguments));
  }, _has:function(tags) {
    if (!this._list.length || !tags.length) {
      return false;
    }
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].length === 1) {
        if (this._index[tags[i][0]]) {
          return true;
        }
      } else {
        var multiple = true;
        for (var t = 0; t < tags[i].length; t++) {
          if (this._index[tags[i][t]]) {
            continue;
          }
          multiple = false;
          break;
        }
        if (multiple) {
          return true;
        }
      }
    }
    return false;
  }, list:function() {
    return this._list.slice(0);
  }, _processArguments:function(args, flat) {
    var tags = [];
    var tmp = [];
    if (!args || !args.length) {
      return tags;
    }
    for (var i = 0; i < args.length; i++) {
      if (args[i] instanceof Array) {
        if (!flat) {
          tmp = [];
        }
        for (var t = 0; t < args[i].length; t++) {
          if (typeof args[i][t] !== "string") {
            continue;
          }
          if (flat) {
            tags.push(args[i][t]);
          } else {
            tmp.push(args[i][t]);
          }
        }
        if (!flat && tmp.length) {
          tags.push(tmp);
        }
      } else {
        if (typeof args[i] === "string") {
          if (flat) {
            tags.push(args[i]);
          } else {
            tags.push([args[i]]);
          }
        }
      }
    }
    return tags;
  }});
  Object.defineProperty(Tags.prototype, "size", {get:function() {
    return this._list.length;
  }});
  return {TagsCache:TagsCache, Tags:Tags};
}());
Object.assign(ape, function() {
  var AllocatePool = function(constructor, size) {
    this._constructor = constructor;
    this._pool = [];
    this._count = 0;
    this._resize(size);
  };
  Object.assign(AllocatePool.prototype, {_resize:function(size) {
    if (size > this._pool.length) {
      for (var i = this._pool.length; i < size; i++) {
        this._pool[i] = new this._constructor;
      }
    }
  }, allocate:function() {
    if (this._count >= this._pool.length) {
      this._resize(this._pool.length * 2);
    }
    return this._pool[this._count++];
  }, freeAll:function() {
    this._count = 0;
  }});
  return {AllocatePool:AllocatePool};
}());
Object.assign(ape, function() {
  var platform = {desktop:false, mobile:false, ios:false, android:false, windows:false, cocoonjs:false, xbox:false, gamepads:false, touch:false, workers:false};
  var ua = navigator.userAgent;
  if (/(windows|mac os|linux|cros)/i.test(ua)) {
    platform.desktop = true;
  }
  if (/xbox/i.test(ua)) {
    platform.xbox = true;
  }
  if (/(windows phone|iemobile|wpdesktop)/i.test(ua)) {
    platform.desktop = false;
    platform.mobile = true;
    platform.windows = true;
  } else {
    if (/android/i.test(ua)) {
      platform.desktop = false;
      platform.mobile = true;
      platform.android = true;
    } else {
      if (/ip([ao]d|hone)/i.test(ua)) {
        platform.desktop = false;
        platform.mobile = true;
        platform.ios = true;
      }
    }
  }
  if (navigator.isCocoonJS) {
    platform.cocoonjs = true;
  }
  platform.touch = "ontouchstart" in window || "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;
  platform.gamepads = "getGamepads" in navigator;
  platform.workers = typeof Worker !== "undefined";
  return {platform:platform};
}());
Object.assign(ape, function() {
  var IndexedList = function() {
    this._list = [];
    this._index = {};
  };
  Object.assign(IndexedList.prototype, {push:function(key, item) {
    if (this._list[key]) {
      throw Error("Key already in index" + key);
    }
    var location = this._list.push(item) - 1;
    this._index[key] = location;
  }, has:function(key) {
    return this._index[key] !== undefined;
  }, get:function(key) {
    var location = this._index[key];
    if (location !== undefined) {
      return this._list[location];
    }
    return null;
  }, remove:function(key) {
    var location = this._index[key];
    if (location !== undefined) {
      this._list.splice(location, 1);
      delete this._index[key];
      for (key in this._index) {
        var idx = this._index[key];
        if (idx > location) {
          this._index[key] = idx - 1;
        }
      }
      return true;
    }
    return false;
  }, list:function() {
    return this._list;
  }, clear:function() {
    this._list.length = 0;
    for (var prop in this._index) {
      delete this._index[prop];
    }
  }});
  return {IndexedList:IndexedList};
}());
ape.math = {DEG_TO_RAD:Math.PI / 180, RAD_TO_DEG:180 / Math.PI, clamp:function(value, min, max) {
  if (value >= max) {
    return max;
  }
  if (value <= min) {
    return min;
  }
  return value;
}, intToBytes24:function(i) {
  var r, g, b;
  r = i >> 16 & 255;
  g = i >> 8 & 255;
  b = i & 255;
  return [r, g, b];
}, intToBytes32:function(i) {
  var r, g, b, a;
  r = i >> 24 & 255;
  g = i >> 16 & 255;
  b = i >> 8 & 255;
  a = i & 255;
  return [r, g, b, a];
}, bytesToInt24:function(r, g, b) {
  if (r.length) {
    b = r[2];
    g = r[1];
    r = r[0];
  }
  return r << 16 | g << 8 | b;
}, bytesToInt32:function(r, g, b, a) {
  if (r.length) {
    a = r[3];
    b = r[2];
    g = r[1];
    r = r[0];
  }
  return (r << 24 | g << 16 | b << 8 | a) >>> 32;
}, lerp:function(a, b, alpha) {
  return a + (b - a) * ape.math.clamp(alpha, 0, 1);
}, lerpAngle:function(a, b, alpha) {
  if (b - a > 180) {
    b -= 360;
  }
  if (b - a < -180) {
    b += 360;
  }
  return ape.math.lerp(a, b, ape.math.clamp(alpha, 0, 1));
}, powerOfTwo:function() {
  return x !== 0 && !(x & x - 1);
}, nextPowerOfTwo:function() {
  val--;
  val |= val >> 1;
  val |= val >> 2;
  val |= val >> 4;
  val |= val >> 8;
  val |= val >> 16;
  val++;
  return val;
}, random:function(min, max) {
  var diff = max - min;
  return Math.random() * diff + min;
}, smoothstep:function(min, max, x) {
  if (x <= min) {
    return 0;
  }
  if (x >= max) {
    return 1;
  }
  x = (x - min) / (max - min);
  return x * x * (3 - 2 * x);
}, smootherstep:function(min, max, x) {
  if (x <= min) {
    return 0;
  }
  if (x >= max) {
    return 1;
  }
  x = (x - min) / (max - min);
  return x * x * x * (x * (x * 6 - 15) + 10);
}};
Object.assign(ape, function() {
  var Vec2 = function(x, y) {
    if (x && x.length === 2) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
  };
  Object.assign(Vec2.prototype, {add:function(rhs) {
    this.x += rhs.x;
    this.y += rhs.y;
    return this;
  }, add2:function(lhs, rhs) {
    this.x = lhs.x + rhs.x;
    this.y = lhs.y + rhs.y;
    return this;
  }, clone:function() {
    return (new Vec2).copy(this);
  }, copy:function(rhs) {
    this.x = rhs.x;
    this.y = rhs.y;
    return this;
  }, dot:function(rhs) {
    return this.x * rhs.x + this.y * rhs.y;
  }, equals:function(rhs) {
    return this.x === rhs.x && this.y === rhs.y;
  }, length:function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }, lengthSq:function() {
    return this.x * this.x + this.y * this.y;
  }, lerp:function(lhs, rhs, alpha) {
    this.x = lhs.x + alpha * (rhs.x - lhs.x);
    this.y = lhs.y + alpha * (rhs.y - lhs.y);
    return this;
  }, mul:function(rhs) {
    this.x *= rhs.x;
    this.y *= rhs.y;
    return this;
  }, mul2:function(lhs, rhs) {
    this.x = lhs.x * rhs.x;
    this.y = lhs.y * rhs.y;
    return this;
  }, normalize:function() {
    var lengthSq = this.x * this.x + this.y * this.y;
    if (lengthSq > 0) {
      var invLength = 1 / Math.sqrt(lengthSq);
      this.x *= invLength;
      this.y *= invLength;
    }
    return this;
  }, scale:function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }, set:function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }, sub:function(rhs) {
    this.x -= rhs.x;
    this.y -= rhs.y;
    return this;
  }, sub2:function(lhs, rhs) {
    this.x = lhs.x - rhs.x;
    this.y = lhs.y - rhs.y;
    return this;
  }, toString:function() {
    return "[" + this.x + "," + this.y + "]";
  }});
  Object.defineProperty(Vec2, "ONE", {get:function() {
    var one = new Vec2(1, 1);
    return function() {
      return one;
    };
  }()});
  Object.defineProperty(Vec2, "RIGHT", {get:function() {
    var right = new Vec2(1, 0);
    return function() {
      return right;
    };
  }()});
  Object.defineProperty(Vec2, "UP", {get:function() {
    var up = new Vec2(0, 1);
    return function() {
      return up;
    };
  }()});
  Object.defineProperty(Vec2, "ZERO", {get:function() {
    var zero = new Vec2(0, 0);
    return function() {
      return zero;
    };
  }()});
  return {Vec2:Vec2};
}());
Object.assign(ape, function() {
  var Vec3 = function(x, y, z) {
    if (x && x.length === 3) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }
    var create = function() {
      if (arguments.length === 9) {
        var a = arguments;
        return [a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]];
      } else {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
      }
    };
  };
  Object.assign(Vec3.prototype, {add:function(rhs) {
    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;
    return this;
  }, add2:function(lhs, rhs) {
    this.x = lhs.x + rhs.x;
    this.y = lhs.y + rhs.y;
    this.z = lhs.z + rhs.z;
    return this;
  }, clone:function() {
    return (new Vec3).copy(this);
  }, copy:function(rhs) {
    this.x = rhs.x;
    this.y = rhs.y;
    this.z = rhs.z;
    return this;
  }, cross:function(lhs, rhs) {
    var lx = lhs.x;
    var ly = lhs.y;
    var lz = lhs.z;
    var rx = rhs.x;
    var ry = rhs.y;
    var rz = rhs.z;
    this.x = ly * rz - ry * lz;
    this.y = lz * rx - rz * lx;
    this.z = lx * ry - rx * ly;
    return this;
  }, dot:function(rhs) {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
  }, equals:function(rhs) {
    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
  }, length:function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }, lengthSq:function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }, lerp:function(lhs, rhs, alpha) {
    this.x = lhs.x + alpha * (rhs.x - lhs.x);
    this.y = lhs.y + alpha * (rhs.y - lhs.y);
    this.z = lhs.z + alpha * (rhs.z - lhs.z);
    return this;
  }, mul:function(rhs) {
    this.x *= rhs.x;
    this.y *= rhs.y;
    this.z *= rhs.z;
    return this;
  }, mul2:function(lhs, rhs) {
    this.x = lhs.x * rhs.x;
    this.y = lhs.y * rhs.y;
    this.z = lhs.z * rhs.z;
    return this;
  }, normalize:function() {
    var lengthSq = this.x * this.x + this.y * this.y + this.z * this.z;
    if (lengthSq > 0) {
      var invLength = 1 / Math.sqrt(lengthSq);
      this.x *= invLength;
      this.y *= invLength;
      this.z *= invLength;
    }
    return this;
  }, project:function(rhs) {
    var a_dot_b = this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
    var b_dot_b = rhs.x * rhs.x + rhs.y * rhs.y + rhs.z * rhs.z;
    var s = a_dot_b / b_dot_b;
    this.x = rhs.x * s;
    this.y = rhs.y * s;
    this.z = rhs.z * s;
    return this;
  }, scale:function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }, set:function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }, sub:function(rhs) {
    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;
    return this;
  }, sub2:function(lhs, rhs) {
    this.x = lhs.x - rhs.x;
    this.y = lhs.y - rhs.y;
    this.z = lhs.z - rhs.z;
    return this;
  }, toString:function() {
    return "[" + this.x + ", " + this.y + ", " + this.z + "]";
  }});
  Object.defineProperty(Vec3, "BACK", {get:function() {
    var back = new Vec3(0, 0, 1);
    return function() {
      return back;
    };
  }()});
  Object.defineProperty(Vec3, "DOWN", {get:function() {
    var down = new Vec3(0, -1, 0);
    return function() {
      return down;
    };
  }()});
  Object.defineProperty(Vec3, "FORWARD", {get:function() {
    var forward = new Vec3(0, 0, -1);
    return function() {
      return forward;
    };
  }()});
  Object.defineProperty(Vec3, "LEFT", {get:function() {
    var left = new Vec3(-1, 0, 0);
    return function() {
      return left;
    };
  }()});
  Object.defineProperty(Vec3, "ONE", {get:function() {
    var one = new Vec3(1, 1, 1);
    return function() {
      return one;
    };
  }()});
  Object.defineProperty(Vec3, "RIGHT", {get:function() {
    var right = new Vec3(1, 0, 0);
    return function() {
      return right;
    };
  }()});
  Object.defineProperty(Vec3, "UP", {get:function() {
    var up = new Vec3(0, 1, 0);
    return function() {
      return up;
    };
  }()});
  Object.defineProperty(Vec3, "ZERO", {get:function() {
    var zero = new Vec3(0, 0, 0);
    return function() {
      return zero;
    };
  }()});
  return {Vec3:Vec3};
}());
Object.assign(ape, function() {
  var Vec4 = function(x, y, z, w) {
    if (x && x.length === 4) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
      this.w = x[3];
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
    }
  };
  Object.assign(Vec4.prototype, {add:function(rhs) {
    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;
    this.w += rhs.w;
    return this;
  }, add2:function(lhs, rhs) {
    this.x = lhs.x + rhs.x;
    this.y = lhs.y + rhs.y;
    this.z = lhs.z + rhs.z;
    this.w = lhs.w + rhs.w;
    return this;
  }, clone:function() {
    return (new Vec4).copy(this);
  }, copy:function(rhs) {
    this.x = rhs.x;
    this.y = rhs.y;
    this.z = rhs.z;
    this.w = rhs.w;
    return this;
  }, dot:function(rhs) {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
  }, equals:function(rhs) {
    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
  }, length:function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }, lengthSq:function() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }, lerp:function(lhs, rhs, alpha) {
    this.x = lhs.x + alpha * (rhs.x - lhs.x);
    this.y = lhs.y + alpha * (rhs.y - lhs.y);
    this.z = lhs.z + alpha * (rhs.z - lhs.z);
    this.w = lhs.w + alpha * (rhs.w - lhs.w);
    return this;
  }, mul:function(rhs) {
    this.x *= rhs.x;
    this.y *= rhs.y;
    this.z *= rhs.z;
    this.w *= rhs.w;
    return this;
  }, mul2:function(lhs, rhs) {
    this.x = lhs.x * rhs.x;
    this.y = lhs.y * rhs.y;
    this.z = lhs.z * rhs.z;
    this.w = lhs.w * rhs.w;
    return this;
  }, normalize:function() {
    var lengthSq = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    if (lengthSq > 0) {
      var invLength = 1 / Math.sqrt(lengthSq);
      this.x *= invLength;
      this.y *= invLength;
      this.z *= invLength;
      this.w *= invLength;
    }
    return this;
  }, scale:function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }, set:function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }, sub:function(rhs) {
    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;
    this.w -= rhs.w;
    return this;
  }, sub2:function(lhs, rhs) {
    this.x = lhs.x - rhs.x;
    this.y = lhs.y - rhs.y;
    this.z = lhs.z - rhs.z;
    this.w = lhs.w - rhs.w;
    return this;
  }, toString:function() {
    return "[" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + "]";
  }});
  Object.defineProperty(Vec4, "ONE", {get:function() {
    var one = new Vec4(1, 1, 1, 1);
    return function() {
      return one;
    };
  }()});
  Object.defineProperty(Vec4, "ZERO", {get:function() {
    var zero = new Vec4(0, 0, 0, 0);
    return function() {
      return zero;
    };
  }()});
  return {Vec4:Vec4};
}());
Object.assign(ape, function() {
  var Mat3 = function() {
    var data;
    data = new Float32Array(9);
    data[0] = data[4] = data[8] = 1;
    this.data = data;
  };
  Object.assign(Mat3.prototype, {clone:function() {
    return (new ape.Mat3).copy(this);
  }, copy:function(rhs) {
    var src = rhs.data;
    var dst = this.data;
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = src[5];
    dst[6] = src[6];
    dst[7] = src[7];
    dst[8] = src[8];
    return this;
  }, set:function(src) {
    var dst = this.data;
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = src[5];
    dst[6] = src[6];
    dst[7] = src[7];
    dst[8] = src[8];
    return this;
  }, equals:function(rhs) {
    var l = this.data;
    var r = rhs.data;
    return l[0] === r[0] && l[1] === r[1] && l[2] === r[2] && l[3] === r[3] && l[4] === r[4] && l[5] === r[5] && l[6] === r[6] && l[7] === r[7] && l[8] === r[8];
  }, isIdentity:function() {
    var m = this.data;
    return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 1 && m[5] === 0 && m[6] === 0 && m[7] === 0 && m[8] === 1;
  }, setIdentity:function() {
    var m = this.data;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 1;
    m[5] = 0;
    m[6] = 0;
    m[7] = 0;
    m[8] = 1;
    return this;
  }, toString:function() {
    var t = "[";
    for (var i = 0; i < 9; i++) {
      t += this.data[i];
      t += i !== 9 ? ", " : "";
    }
    t += "]";
    return t;
  }, transpose:function() {
    var m = this.data;
    var tmp;
    tmp = m[1];
    m[1] = m[3];
    m[3] = tmp;
    tmp = m[2];
    m[2] = m[6];
    m[6] = tmp;
    tmp = m[5];
    m[5] = m[7];
    m[7] = tmp;
    return this;
  }});
  Object.defineProperty(Mat3, "IDENTITY", {get:function() {
    var identity = new Mat3;
    return function() {
      return identity;
    };
  }()});
  Object.defineProperty(Mat3, "ZERO", {get:function() {
    var zero = (new Mat3).set([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return function() {
      return zero;
    };
  }()});
  return {Mat3:Mat3};
}());
Object.assign(ape, function() {
  var Mat4 = function() {
    var data = new Float32Array(16);
    data[0] = data[5] = data[10] = data[15] = 1;
    this.data = data;
    var multiply = function(a, b, r) {
      if (r === undefined) {
        r = new ape.Mat4;
      }
      r.mul2(a, b);
    };
    var multiplyVec3 = function(v, w, m, r) {
      if (r === undefined) {
        r = pc.math.vec3.create();
      }
      var x, y, z;
      x = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + w * m[12];
      y = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + w * m[13];
      z = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + w * m[14];
      r[0] = x;
      r[1] = y;
      r[2] = z;
      return r;
    };
    var makeRotate = function(angle, axis, r) {
      if (r === undefined) {
        r = pc.math.mat4.create();
      }
      var x = axis[0], y = axis[1], z = axis[2];
      var c = Math.cos(angle);
      var c1 = 1 - c;
      var s = Math.sin(angle);
      r[0] = x * x * c1 + c;
      r[1] = y * x * c1 + z * s;
      r[2] = z * x * c1 - y * s;
      r[3] = 0;
      r[4] = x * y * c1 - z * s;
      r[5] = y * y * c1 + c;
      r[6] = y * z * c1 + x * s;
      r[7] = 0;
      r[8] = x * z * c1 + y * s;
      r[9] = y * z * c1 - x * s;
      r[10] = z * z * c1 + c;
      r[11] = 0;
      r[12] = 0;
      r[13] = 0;
      r[14] = 0;
      r[15] = 1;
      return r;
    };
  };
  Object.assign(Mat4.prototype, {add2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    r[4] = a[4] + b[4];
    r[5] = a[5] + b[5];
    r[6] = a[6] + b[6];
    r[7] = a[7] + b[7];
    r[8] = a[8] + b[8];
    r[9] = a[9] + b[9];
    r[10] = a[10] + b[10];
    r[11] = a[11] + b[11];
    r[12] = a[12] + b[12];
    r[13] = a[13] + b[13];
    r[14] = a[14] + b[14];
    r[15] = a[15] + b[15];
    return this;
  }, add:function(rhs) {
    return this.add2(this, rhs);
  }, clone:function() {
    return (new ape.Mat4).copy(this);
  }, copy:function(rhs) {
    var src = rhs.data, dst = this.data;
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = src[5];
    dst[6] = src[6];
    dst[7] = src[7];
    dst[8] = src[8];
    dst[9] = src[9];
    dst[10] = src[10];
    dst[11] = src[11];
    dst[12] = src[12];
    dst[13] = src[13];
    dst[14] = src[14];
    dst[15] = src[15];
    return this;
  }, equals:function(rhs) {
    var l = this.data, r = rhs.data;
    return l[0] === r[0] && l[1] === r[1] && l[2] === r[2] && l[3] === r[3] && l[4] === r[4] && l[5] === r[5] && l[6] === r[6] && l[7] === r[7] && l[8] === r[8] && l[9] === r[9] && l[10] === r[10] && l[11] === r[11] && l[12] === r[12] && l[13] === r[13] && l[14] === r[14] && l[15] === r[15];
  }, isIdentity:function() {
    var m = this.data;
    return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 0 && m[5] === 1 && m[6] === 0 && m[7] === 0 && m[8] === 0 && m[9] === 0 && m[10] === 1 && m[11] === 0 && m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1;
  }, mul2:function(lhs, rhs) {
    var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b0, b1, b2, b3, a = lhs.data, b = rhs.data, r = this.data;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    a30 = a[12];
    a31 = a[13];
    a32 = a[14];
    a33 = a[15];
    b0 = b[0];
    b1 = b[1];
    b2 = b[2];
    b3 = b[3];
    r[0] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[1] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[2] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[3] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    r[4] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[5] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[6] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[7] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    r[8] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[9] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[10] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[11] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    r[12] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[13] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[14] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[15] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    return this;
  }, mul:function(rhs) {
    return this.mul2(this, rhs);
  }, transformPoint:function(vec, res) {
    var x, y, z, m;
    m = this.data;
    x = vec.x;
    y = vec.y;
    z = vec.z;
    res = res === undefined ? new ape.Vec3 : res;
    res.x = x * m[0] + y * m[4] + z * m[8] + m[12];
    res.y = x * m[1] + y * m[5] + z * m[9] + m[13];
    res.z = x * m[2] + y * m[6] + z * m[10] + m[14];
    return res;
  }, transformVector:function(vec, res) {
    var x, y, z, m;
    m = this.data;
    x = vec.x;
    y = vec.y;
    z = vec.z;
    res = res === undefined ? new ape.Vec3 : res;
    res.x = x * m[0] + y * m[4] + z * m[8];
    res.y = x * m[1] + y * m[5] + z * m[9];
    res.z = x * m[2] + y * m[6] + z * m[10];
    return res;
  }, transformVec4:function(vec, res) {
    var x, y, z, w, m;
    m = this.data;
    x = vec.x;
    y = vec.y;
    z = vec.z;
    w = vec.w;
    res = res === undefined ? new ape.Vec4 : res;
    res.x = x * m[0] + y * m[4] + z * m[8] + w * m[12];
    res.y = x * m[1] + y * m[5] + z * m[9] + w * m[13];
    res.z = x * m[2] + y * m[6] + z * m[10] + w * m[14];
    res.w = x * m[3] + y * m[7] + z * m[11] + w * m[15];
    return res;
  }, setLookAt:function() {
    var x, y, z;
    x = new ape.Vec3;
    y = new ape.Vec3;
    z = new ape.Vec3;
    return function(position, target, up) {
      z.sub2(position, target).normalize();
      y.copy(up).normalize();
      x.cross(y, z).normalize();
      y.cross(z, x);
      var r = this.data;
      r[0] = x.x;
      r[1] = x.y;
      r[2] = x.z;
      r[3] = 0;
      r[4] = y.x;
      r[5] = y.y;
      r[6] = y.z;
      r[7] = 0;
      r[8] = z.x;
      r[9] = z.y;
      r[10] = z.z;
      r[11] = 0;
      r[12] = position.x;
      r[13] = position.y;
      r[14] = position.z;
      r[15] = 1;
      return this;
    };
  }(), setFrustum:function(left, right, bottom, top, znear, zfar) {
    var temp1, temp2, temp3, temp4, r;
    temp1 = 2 * znear;
    temp2 = right - left;
    temp3 = top - bottom;
    temp4 = zfar - znear;
    r = this.data;
    r[0] = temp1 / temp2;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = temp1 / temp3;
    r[6] = 0;
    r[7] = 0;
    r[8] = (right + left) / temp2;
    r[9] = (top + bottom) / temp3;
    r[10] = (-zfar - znear) / temp4;
    r[11] = -1;
    r[12] = 0;
    r[13] = 0;
    r[14] = -temp1 * zfar / temp4;
    r[15] = 0;
    return this;
  }, setPerspective:function(fov, aspect, znear, zfar, fovIsHorizontal) {
    var xmax, ymax;
    if (!fovIsHorizontal) {
      ymax = znear * Math.tan(fov * Math.PI / 360);
      xmax = ymax * aspect;
    } else {
      xmax = znear * Math.tan(fov * Math.PI / 360);
      ymax = xmax / aspect;
    }
    return this.setFrustum(-xmax, xmax, -ymax, ymax, znear, zfar);
  }, setOrtho:function(left, right, bottom, top, near, far) {
    var r = this.data;
    r[0] = 2 / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = -2 / (far - near);
    r[11] = 0;
    r[12] = -(right + left) / (right - left);
    r[13] = -(top + bottom) / (top - bottom);
    r[14] = -(far + near) / (far - near);
    r[15] = 1;
    return this;
  }, setFromAxisAngle:function(axis, angle) {
    var x, y, z, c, s, t, tx, ty, m;
    angle *= ape.math.DEG_TO_RAD;
    x = axis.x;
    y = axis.y;
    z = axis.z;
    c = Math.cos(angle);
    s = Math.sin(angle);
    t = 1 - c;
    tx = t * x;
    ty = t * y;
    m = this.data;
    m[0] = tx * x + c;
    m[1] = tx * y + s * z;
    m[2] = tx * z - s * y;
    m[3] = 0;
    m[4] = tx * y - s * z;
    m[5] = ty * y + c;
    m[6] = ty * z + s * x;
    m[7] = 0;
    m[8] = tx * z + s * y;
    m[9] = ty * z - x * s;
    m[10] = t * z * z + c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this;
  }, setTranslate:function(x, y, z) {
    var m = this.data;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = x;
    m[13] = y;
    m[14] = z;
    m[15] = 1;
    return this;
  }, setScale:function(x, y, z) {
    var m = this.data;
    m[0] = x;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = y;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = z;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this;
  }, invert:function() {
    var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, det, invDet, m;
    m = this.data;
    a00 = m[0];
    a01 = m[1];
    a02 = m[2];
    a03 = m[3];
    a10 = m[4];
    a11 = m[5];
    a12 = m[6];
    a13 = m[7];
    a20 = m[8];
    a21 = m[9];
    a22 = m[10];
    a23 = m[11];
    a30 = m[12];
    a31 = m[13];
    a32 = m[14];
    a33 = m[15];
    b00 = a00 * a11 - a01 * a10;
    b01 = a00 * a12 - a02 * a10;
    b02 = a00 * a13 - a03 * a10;
    b03 = a01 * a12 - a02 * a11;
    b04 = a01 * a13 - a03 * a11;
    b05 = a02 * a13 - a03 * a12;
    b06 = a20 * a31 - a21 * a30;
    b07 = a20 * a32 - a22 * a30;
    b08 = a20 * a33 - a23 * a30;
    b09 = a21 * a32 - a22 * a31;
    b10 = a21 * a33 - a23 * a31;
    b11 = a22 * a33 - a23 * a32;
    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (det === 0) {
      this.setIdentity();
    } else {
      invDet = 1 / det;
      m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
      m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
      m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
      m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
      m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
      m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
      m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
      m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
      m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
      m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
      m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
      m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
      m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
      m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
      m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
      m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    }
    return this;
  }, set:function(src) {
    var dst = this.data;
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = src[5];
    dst[6] = src[6];
    dst[7] = src[7];
    dst[8] = src[8];
    dst[9] = src[9];
    dst[10] = src[10];
    dst[11] = src[11];
    dst[12] = src[12];
    dst[13] = src[13];
    dst[14] = src[14];
    dst[15] = src[15];
    return this;
  }, setIdentity:function() {
    var m = this.data;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this;
  }, setTRS:function(t, r, s) {
    var tx, ty, tz, qx, qy, qz, qw, sx, sy, sz, x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz, m;
    tx = t.x;
    ty = t.y;
    tz = t.z;
    qx = r.x;
    qy = r.y;
    qz = r.z;
    qw = r.w;
    sx = s.x;
    sy = s.y;
    sz = s.z;
    x2 = qx + qx;
    y2 = qy + qy;
    z2 = qz + qz;
    xx = qx * x2;
    xy = qx * y2;
    xz = qx * z2;
    yy = qy * y2;
    yz = qy * z2;
    zz = qz * z2;
    wx = qw * x2;
    wy = qw * y2;
    wz = qw * z2;
    m = this.data;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = tx;
    m[13] = ty;
    m[14] = tz;
    m[15] = 1;
    return this;
  }, transpose:function() {
    var tmp, m = this.data;
    tmp = m[1];
    m[1] = m[4];
    m[4] = tmp;
    tmp = m[2];
    m[2] = m[8];
    m[8] = tmp;
    tmp = m[3];
    m[3] = m[12];
    m[12] = tmp;
    tmp = m[6];
    m[6] = m[9];
    m[9] = tmp;
    tmp = m[7];
    m[7] = m[13];
    m[13] = tmp;
    tmp = m[11];
    m[11] = m[14];
    m[14] = tmp;
    return this;
  }, invertTo3x3:function(res) {
    var a11, a21, a31, a12, a22, a32, a13, a23, a33, m, r, det, idet;
    m = this.data;
    r = res.data;
    var m0 = m[0];
    var m1 = m[1];
    var m2 = m[2];
    var m4 = m[4];
    var m5 = m[5];
    var m6 = m[6];
    var m8 = m[8];
    var m9 = m[9];
    var m10 = m[10];
    a11 = m10 * m5 - m6 * m9;
    a21 = -m10 * m1 + m2 * m9;
    a31 = m6 * m1 - m2 * m5;
    a12 = -m10 * m4 + m6 * m8;
    a22 = m10 * m0 - m2 * m8;
    a32 = -m6 * m0 + m2 * m4;
    a13 = m9 * m4 - m5 * m8;
    a23 = -m9 * m0 + m1 * m8;
    a33 = m5 * m0 - m1 * m4;
    det = m0 * a11 + m1 * a12 + m2 * a13;
    if (det === 0) {
      return this;
    }
    idet = 1 / det;
    r[0] = idet * a11;
    r[1] = idet * a21;
    r[2] = idet * a31;
    r[3] = idet * a12;
    r[4] = idet * a22;
    r[5] = idet * a32;
    r[6] = idet * a13;
    r[7] = idet * a23;
    r[8] = idet * a33;
    return this;
  }, getTranslation:function(t) {
    t = t === undefined ? new ape.Vec3 : t;
    return t.set(this.data[12], this.data[13], this.data[14]);
  }, getX:function(x) {
    x = x === undefined ? new ape.Vec3 : x;
    return x.set(this.data[0], this.data[1], this.data[2]);
  }, getY:function(y) {
    y = y === undefined ? new ape.Vec3 : y;
    return y.set(this.data[4], this.data[5], this.data[6]);
  }, getZ:function(z) {
    z = z === undefined ? new ape.Vec3 : z;
    return z.set(this.data[8], this.data[9], this.data[10]);
  }, getScale:function() {
    var x, y, z;
    x = new ape.Vec3;
    y = new ape.Vec3;
    z = new ape.Vec3;
    return function(scale) {
      scale = scale === undefined ? new ape.Vec3 : scale;
      this.getX(x);
      this.getY(y);
      this.getZ(z);
      scale.set(x.length(), y.length(), z.length());
      return scale;
    };
  }(), setFromEulerAngles:function(ex, ey, ez) {
    var s1, c1, s2, c2, s3, c3, m;
    ex *= ape.math.DEG_TO_RAD;
    ey *= ape.math.DEG_TO_RAD;
    ez *= ape.math.DEG_TO_RAD;
    s1 = Math.sin(-ex);
    c1 = Math.cos(-ex);
    s2 = Math.sin(-ey);
    c2 = Math.cos(-ey);
    s3 = Math.sin(-ez);
    c3 = Math.cos(-ez);
    m = this.data;
    m[0] = c2 * c3;
    m[1] = -c2 * s3;
    m[2] = s2;
    m[3] = 0;
    m[4] = c1 * s3 + c3 * s1 * s2;
    m[5] = c1 * c3 - s1 * s2 * s3;
    m[6] = -c2 * s1;
    m[7] = 0;
    m[8] = s1 * s3 - c1 * c3 * s2;
    m[9] = c3 * s1 + c1 * s2 * s3;
    m[10] = c1 * c2;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this;
  }, getEulerAngles:function() {
    var scale = new ape.Vec3;
    return function(eulers) {
      var x, y, z, sx, sy, sz, m, halfPi;
      eulers = eulers === undefined ? new ape.Vec3 : eulers;
      this.getScale(scale);
      sx = scale.x;
      sy = scale.y;
      sz = scale.z;
      m = this.data;
      y = Math.asin(-m[2] / sx);
      halfPi = Math.PI * 0.5;
      if (y < halfPi) {
        if (y > -halfPi) {
          x = Math.atan2(m[6] / sy, m[10] / sz);
          z = Math.atan2(m[1] / sx, m[0] / sx);
        } else {
          z = 0;
          x = -Math.atan2(m[4] / sy, m[5] / sy);
        }
      } else {
        z = 0;
        x = Math.atan2(m[4] / sy, m[5] / sy);
      }
      return eulers.set(x, y, z).scale(ape.math.RAD_TO_DEG);
    };
  }(), toString:function() {
    var i, t;
    t = "[";
    for (i = 0; i < 16; i += 1) {
      t += this.data[i];
      t += i !== 15 ? ", " : "";
    }
    t += "]";
    return t;
  }});
  Object.defineProperty(Mat4, "IDENTITY", {get:function() {
    var identity = new Mat4;
    return function() {
      return identity;
    };
  }()});
  Object.defineProperty(Mat4, "ZERO", {get:function() {
    var zero = (new Mat4).set([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return function() {
      return zero;
    };
  }()});
  return {Mat4:Mat4};
}());
Object.assign(ape, function() {
  var Quat = function(x, y, z, w) {
    if (x && x.length === 4) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
      this.w = x[3];
    } else {
      this.x = x === undefined ? 0 : x;
      this.y = y === undefined ? 0 : y;
      this.z = z === undefined ? 0 : z;
      this.w = w === undefined ? 1 : w;
    }
  };
  Object.assign(Quat.prototype, {clone:function() {
    return new ape.Quat(this.x, this.y, this.z, this.w);
  }, conjugate:function() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }, copy:function(rhs) {
    this.x = rhs.x;
    this.y = rhs.y;
    this.z = rhs.z;
    this.w = rhs.w;
    return this;
  }, equals:function(rhs) {
    return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
  }, getAxisAngle:function(axis) {
    var rad = Math.acos(this.w) * 2;
    var s = Math.sin(rad / 2);
    if (s !== 0) {
      axis.x = this.x / s;
      axis.y = this.y / s;
      axis.z = this.z / s;
      if (axis.x < 0 || axis.y < 0 || axis.z < 0) {
        axis.x *= -1;
        axis.y *= -1;
        axis.z *= -1;
        rad *= -1;
      }
    } else {
      axis.x = 1;
      axis.y = 0;
      axis.z = 0;
    }
    return rad * ape.math.RAD_TO_DEG;
  }, getEulerAngles:function(eulers) {
    var x, y, z, qx, qy, qz, qw, a2;
    eulers = eulers === undefined ? new ape.Vec3 : eulers;
    qx = this.x;
    qy = this.y;
    qz = this.z;
    qw = this.w;
    a2 = 2 * (qw * qy - qx * qz);
    if (a2 <= -0.99999) {
      x = 2 * Math.atan2(qx, qw);
      y = -Math.PI / 2;
      z = 0;
    } else {
      if (a2 >= 0.99999) {
        x = 2 * Math.atan2(qx, qw);
        y = Math.PI / 2;
        z = 0;
      } else {
        x = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));
        y = Math.asin(a2);
        z = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz));
      }
    }
    return eulers.set(x, y, z).scale(ape.math.RAD_TO_DEG);
  }, invert:function() {
    return this.conjugate().normalize();
  }, length:function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }, lengthSq:function() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }, mul:function(rhs) {
    var q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;
    q1x = this.x;
    q1y = this.y;
    q1z = this.z;
    q1w = this.w;
    q2x = rhs.x;
    q2y = rhs.y;
    q2z = rhs.z;
    q2w = rhs.w;
    this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
    this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
    this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
    this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
    return this;
  }, mul2:function(lhs, rhs) {
    var q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;
    q1x = lhs.x;
    q1y = lhs.y;
    q1z = lhs.z;
    q1w = lhs.w;
    q2x = rhs.x;
    q2y = rhs.y;
    q2z = rhs.z;
    q2w = rhs.w;
    this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
    this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
    this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
    this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
    return this;
  }, normalize:function() {
    var len = this.length();
    if (len === 0) {
      this.x = this.y = this.z = 0;
      this.w = 1;
    } else {
      len = 1 / len;
      this.x *= len;
      this.y *= len;
      this.z *= len;
      this.w *= len;
    }
    return this;
  }, set:function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }, setFromAxisAngle:function(axis, angle) {
    var sa, ca;
    angle *= 0.5 * ape.math.DEG_TO_RAD;
    sa = Math.sin(angle);
    ca = Math.cos(angle);
    this.x = sa * axis.x;
    this.y = sa * axis.y;
    this.z = sa * axis.z;
    this.w = ca;
    return this;
  }, setFromEulerAngles:function(ex, ey, ez) {
    var sx, cx, sy, cy, sz, cz, halfToRad;
    halfToRad = 0.5 * ape.math.DEG_TO_RAD;
    ex *= halfToRad;
    ey *= halfToRad;
    ez *= halfToRad;
    sx = Math.sin(ex);
    cx = Math.cos(ex);
    sy = Math.sin(ey);
    cy = Math.cos(ey);
    sz = Math.sin(ez);
    cz = Math.cos(ez);
    this.x = sx * cy * cz - cx * sy * sz;
    this.y = cx * sy * cz + sx * cy * sz;
    this.z = cx * cy * sz - sx * sy * cz;
    this.w = cx * cy * cz + sx * sy * sz;
    return this;
  }, setFromMat4:function(m) {
    var m00, m01, m02, m10, m11, m12, m20, m21, m22, tr, s, rs, lx, ly, lz;
    m = m.data;
    m00 = m[0];
    m01 = m[1];
    m02 = m[2];
    m10 = m[4];
    m11 = m[5];
    m12 = m[6];
    m20 = m[8];
    m21 = m[9];
    m22 = m[10];
    lx = 1 / Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
    ly = 1 / Math.sqrt(m10 * m10 + m11 * m11 + m12 * m12);
    lz = 1 / Math.sqrt(m20 * m20 + m21 * m21 + m22 * m22);
    m00 *= lx;
    m01 *= lx;
    m02 *= lx;
    m10 *= ly;
    m11 *= ly;
    m12 *= ly;
    m20 *= lz;
    m21 *= lz;
    m22 *= lz;
    tr = m00 + m11 + m22;
    if (tr >= 0) {
      s = Math.sqrt(tr + 1);
      this.w = s * 0.5;
      s = 0.5 / s;
      this.x = (m12 - m21) * s;
      this.y = (m20 - m02) * s;
      this.z = (m01 - m10) * s;
    } else {
      if (m00 > m11) {
        if (m00 > m22) {
          rs = m00 - (m11 + m22) + 1;
          rs = Math.sqrt(rs);
          this.x = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m12 - m21) * rs;
          this.y = (m01 + m10) * rs;
          this.z = (m02 + m20) * rs;
        } else {
          rs = m22 - (m00 + m11) + 1;
          rs = Math.sqrt(rs);
          this.z = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m01 - m10) * rs;
          this.x = (m20 + m02) * rs;
          this.y = (m21 + m12) * rs;
        }
      } else {
        if (m11 > m22) {
          rs = m11 - (m22 + m00) + 1;
          rs = Math.sqrt(rs);
          this.y = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m20 - m02) * rs;
          this.z = (m12 + m21) * rs;
          this.x = (m10 + m01) * rs;
        } else {
          rs = m22 - (m00 + m11) + 1;
          rs = Math.sqrt(rs);
          this.z = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m01 - m10) * rs;
          this.x = (m20 + m02) * rs;
          this.y = (m21 + m12) * rs;
        }
      }
    }
    return this;
  }, slerp:function(lhs, rhs, alpha) {
    var lx, ly, lz, lw, rx, ry, rz, rw;
    lx = lhs.x;
    ly = lhs.y;
    lz = lhs.z;
    lw = lhs.w;
    rx = rhs.x;
    ry = rhs.y;
    rz = rhs.z;
    rw = rhs.w;
    var cosHalfTheta = lw * rw + lx * rx + ly * ry + lz * rz;
    if (cosHalfTheta < 0) {
      rw = -rw;
      rx = -rx;
      ry = -ry;
      rz = -rz;
      cosHalfTheta = -cosHalfTheta;
    }
    if (Math.abs(cosHalfTheta) >= 1) {
      this.w = lw;
      this.x = lx;
      this.y = ly;
      this.z = lz;
      return this;
    }
    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < 0.001) {
      this.w = lw * 0.5 + rw * 0.5;
      this.x = lx * 0.5 + rx * 0.5;
      this.y = ly * 0.5 + ry * 0.5;
      this.z = lz * 0.5 + rz * 0.5;
      return this;
    }
    var ratioA = Math.sin((1 - alpha) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(alpha * halfTheta) / sinHalfTheta;
    this.w = lw * ratioA + rw * ratioB;
    this.x = lx * ratioA + rx * ratioB;
    this.y = ly * ratioA + ry * ratioB;
    this.z = lz * ratioA + rz * ratioB;
    return this;
  }, transformVector:function(vec, res) {
    if (res === undefined) {
      res = new ape.Vec3;
    }
    var x = vec.x, y = vec.y, z = vec.z;
    var qx = this.x, qy = this.y, qz = this.z, qw = this.w;
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;
    res.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    res.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    res.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return res;
  }, toString:function() {
    return "[" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + "]";
  }});
  Object.defineProperty(Quat, "IDENTITY", {get:function() {
    var identity = new Quat;
    return function() {
      return identity;
    };
  }()});
  Object.defineProperty(Quat, "ZERO", {get:function() {
    var zero = new Quat(0, 0, 0, 0);
    return function() {
      return zero;
    };
  }()});
  return {Quat:Quat};
}());
Object.assign(ape, function() {
  var CURVE_LINEAR = 0;
  var CURVE_SMOOTHSTEP = 1;
  var CURVE_CATMULL = 2;
  var CURVE_CARDINAL = 3;
  var Curve = function(data) {
    this.keys = [];
    this.type = CURVE_SMOOTHSTEP;
    this.tension = 0.5;
    if (data) {
      for (var i = 0; i < data.length - 1; i += 2) {
        this.keys.push([data[i], data[i + 1]]);
      }
    }
    this.sort();
  };
  Object.assign(Curve.prototype, {add:function(time, value) {
    var keys = this.keys;
    var len = keys.length;
    var i = 0;
    for (; i < len; i++) {
      if (keys[i][0] > time) {
        break;
      }
    }
    var key = [time, value];
    this.keys.splice(i, 0, key);
    return key;
  }, get:function(index) {
    return this.keys[index];
  }, sort:function() {
    this.keys.sort(function(a, b) {
      return a[0] - b[0];
    });
  }, value:function(time) {
    var i, len;
    var keys = this.keys;
    if (!keys.length) {
      return 0;
    }
    if (time < keys[0][0]) {
      return keys[0][1];
    } else {
      if (time > keys[keys.length - 1][0]) {
        return keys[keys.length - 1][1];
      }
    }
    var leftTime = 0;
    var leftValue = keys.length ? keys[0][1] : 0;
    var rightTime = 1;
    var rightValue = 0;
    for (i = 0, len = keys.length; i < len; i++) {
      if (keys[i][0] === time) {
        return keys[i][1];
      }
      rightValue = keys[i][1];
      if (time < keys[i][0]) {
        rightTime = keys[i][0];
        break;
      }
      leftTime = keys[i][0];
      leftValue = keys[i][1];
    }
    var div = rightTime - leftTime;
    var interpolation = div === 0 ? 0 : (time - leftTime) / div;
    if (this.type === CURVE_SMOOTHSTEP) {
      interpolation *= interpolation * (3 - 2 * interpolation);
    } else {
      if (this.type === CURVE_CATMULL || this.type === CURVE_CARDINAL) {
        var p1 = leftValue;
        var p2 = rightValue;
        var p0 = p1 + (p1 - p2);
        var p3 = p2 + (p2 - p1);
        var dt1 = rightTime - leftTime;
        var dt0 = dt1;
        var dt2 = dt1;
        if (i > 0) {
          i--;
        }
        if (i > 0) {
          p0 = keys[i - 1][1];
          dt0 = keys[i][0] - keys[i - 1][0];
        }
        if (keys.length > i + 1) {
          dt1 = keys[i + 1][0] - keys[i][0];
        }
        if (keys.length > i + 2) {
          dt2 = keys[i + 2][0] - keys[i + 1][0];
          p3 = keys[i + 2][1];
        }
        p0 = p1 + (p0 - p1) * dt1 / dt0;
        p3 = p2 + (p3 - p2) * dt1 / dt2;
        if (this.type === CURVE_CATMULL) {
          return this._interpolateCatmullRom(p0, p1, p2, p3, interpolation);
        }
        return this._interpolateCardinal(p0, p1, p2, p3, interpolation, this.tension);
      }
    }
    return ape.math.lerp(leftValue, rightValue, interpolation);
  }, _interpolateHermite:function(p0, p1, t0, t1, s) {
    var s2 = s * s;
    var s3 = s * s * s;
    var h0 = 2 * s3 - 3 * s2 + 1;
    var h1 = -2 * s3 + 3 * s2;
    var h2 = s3 - 2 * s2 + s;
    var h3 = s3 - s2;
    return p0 * h0 + p1 * h1 + t0 * h2 + t1 * h3;
  }, _interpolateCardinal:function(p0, p1, p2, p3, s, t) {
    var t0 = t * (p2 - p0);
    var t1 = t * (p3 - p1);
    return this._interpolateHermite(p1, p2, t0, t1, s);
  }, _interpolateCatmullRom:function(p0, p1, p2, p3, s) {
    return this._interpolateCardinal(p0, p1, p2, p3, s, 0.5);
  }, closest:function(time) {
    var keys = this.keys;
    var length = keys.length;
    var min = 2;
    var result = null;
    for (var i = 0; i < length; i++) {
      var diff = Math.abs(time - keys[i][0]);
      if (min >= diff) {
        min = diff;
        result = keys[i];
      } else {
        break;
      }
    }
    return result;
  }, clone:function() {
    var result = new ape.Curve;
    result.keys = ape.extend(result.keys, this.keys);
    result.type = this.type;
    return result;
  }, quantize:function(precision) {
    precision = Math.max(precision, 2);
    var values = new Float32Array(precision);
    var step = 1.0 / (precision - 1);
    for (var i = 0; i < precision; i++) {
      var value = this.value(step * i);
      values[i] = value;
    }
    return values;
  }});
  Object.defineProperty(Curve.prototype, "length", {get:function() {
    return this.keys.length;
  }});
  return {Curve:Curve, CURVE_LINEAR:CURVE_LINEAR, CURVE_SMOOTHSTEP:CURVE_SMOOTHSTEP, CURVE_CATMULL:CURVE_CATMULL, CURVE_CARDINAL:CURVE_CARDINAL};
}());
Object.assign(ape, function() {
  var CurveSet = function() {
    var i;
    this.curves = [];
    this._type = ape.CURVE_SMOOTHSTEP;
    if (arguments.length > 1) {
      for (i = 0; i < arguments.length; i++) {
        this.curves.push(new ape.Curve(arguments[i]));
      }
    } else {
      if (arguments.length === 0) {
        this.curves.push(new ape.Curve);
      } else {
        var arg = arguments[0];
        if (ape.type(arg) === "number") {
          for (i = 0; i < arg; i++) {
            this.curves.push(new ape.Curve);
          }
        } else {
          for (i = 0; i < arg.length; i++) {
            this.curves.push(new ape.Curve(arg[i]));
          }
        }
      }
    }
  };
  Object.assign(CurveSet.prototype, {get:function(index) {
    return this.curves[index];
  }, value:function(time, result) {
    var length = this.curves.length;
    result = result || [];
    result.length = length;
    for (var i = 0; i < length; i++) {
      result[i] = this.curves[i].value(time);
    }
    return result;
  }, clone:function() {
    var result = new ape.CurveSet;
    result.curves = [];
    for (var i = 0; i < this.curves.length; i++) {
      result.curves.push(this.curves[i].clone());
    }
    result._type = this._type;
    return result;
  }, quantize:function(precision) {
    precision = Math.max(precision, 2);
    var numCurves = this.curves.length;
    var values = new Float32Array(precision * numCurves);
    var step = 1.0 / (precision - 1);
    var temp = [];
    for (var i = 0; i < precision; i++) {
      var value = this.value(step * i, temp);
      if (numCurves == 1) {
        values[i] = value[0];
      } else {
        for (var j = 0; j < numCurves; j++) {
          values[i * numCurves + j] = value[j];
        }
      }
    }
    return values;
  }});
  Object.defineProperty(CurveSet.prototype, "length", {get:function() {
    return this.curves.length;
  }});
  Object.defineProperty(CurveSet.prototype, "type", {get:function() {
    return this._type;
  }, set:function(value) {
    this._type = value;
    for (var i = 0; i < this.curves.length; i++) {
      this.curves[i].type = value;
    }
  }});
  return {CurveSet:CurveSet};
}());
Object.assign(ape, function() {
  var Http = function Http() {
  };
  Http.ContentType = {FORM_URLENCODED:"application/x-www-form-urlencoded", GIF:"image/gif", JPEG:"image/jpeg", DDS:"image/dds", JSON:"application/json", PNG:"image/png", TEXT:"text/plain", XML:"application/xml", WAV:"audio/x-wav", OGG:"audio/ogg", MP3:"audio/mpeg", MP4:"audio/mp4", AAC:"audio/aac", BIN:"application/octet-stream"};
  Http.ResponseType = {TEXT:"text", ARRAY_BUFFER:"arraybuffer", BLOB:"blob", DOCUMENT:"document", JSON:"json"};
  Http.binaryExtension = [".model", ".wav", ".ogg", ".mp3", ".mp4", ".m4a", ".acc", ".dds"];
  Object.assign(Http.prototype, {ContentType:Http.ContentType, ResponseType:Http.ResponseType, binaryExtension:Http.binaryExtensions, get:function(url, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    return this.request("GET", url, options, callback);
  }, post:function(url, data, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options.postdata = data;
    return this.request("POST", url, options, callback);
  }, put:function(url, data, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options.postdata = data;
    return this.request("PUT", url, options, callback);
  }, del:function(url, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    return this.request("DELETE", url, options, callback);
  }, request:function(method, url, options, callback) {
    var uri, query, timestamp, postdata, xhr;
    var errored = false;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options.callback = callback;
    if (options.async == null) {
      options.async = true;
    }
    if (options.headers == null) {
      options.headers = {};
    }
    if (optoins.postdata != null) {
      if (options.postdata instanceof Document) {
        postdata = options.postdata;
      } else {
        if (options.postdata instanceof FormData) {
          postdata = options.postdata;
        } else {
          if (options.postdata instanceof Object) {
            var contentType = options.headers["Content-Type"];
            if (contentType === undefined) {
              options.headers["Content-Type"] = Http.ContentType.FORM_URLENCODED;
              contentType = options.headers["Content-Type"];
            }
            switch(contentType) {
              case Http.ContentType.FORM_URLENCODED:
                postdata = "";
                var bFirstItem = true;
                for (var key in options.postdata) {
                  if (options.postdata.hasOwnProperty(key)) {
                    if (bFirstItem) {
                      bFirstItem = false;
                    } else {
                      postdata += "&";
                    }
                    postdata += escape(key) + "=" + escape(options.postdata[key]);
                  }
                }
                break;
              default:
              case Http.ContentType.JSON:
                if (contentType == null) {
                  options.headers["Content-Type"] = Http.ContentType.JSON;
                }
                postdata = JSON.stringify(options.postdata);
                break;
            }
          } else {
            postdata = options.postdata;
          }
        }
      }
    }
    if (!xhr) {
      xhr = new XMLHttpRequest;
    }
    if (options.cache === false) {
      timestamp = ape.time.now();
      uri = new ape.URI(url);
      if (!uri.query) {
        uri.query = "ts=" + timestamp;
      } else {
        uri.query = uri.query + "&ts=" + timestamp;
      }
      url = uri.toString();
    }
    if (options.query) {
      uri = new ape.URI(url);
      query = ape.extend(uri.getQuery(), options.query);
      uri.setQuery(query);
      url = uri.toString();
    }
    xhr.open(method, url, options.async);
    xhr.withCredentials = options.withCredentials !== undefined ? options.withCredentials : false;
    xhr.responseType = options.responseType || this._guessResponseType(url);
    for (var header in options.headers) {
      if (options.headers.hasOwnProperty(header)) {
        xhr.setRequestHeader(header, options.headers[header]);
      }
    }
    xhr.onreadystatechange = function() {
      this._onReadyStateChange(methond, url, options, xhr);
    }.bind(this);
    xhr.onerror = function() {
      this._onError(method, url, options, xhr);
      errored = true;
    }.bind(this);
    try {
      xhr.send(postdata);
    } catch (e) {
      if (!errored) {
        options.error(xhr.status, xhr, e);
      }
    }
    return xhr;
  }, _guessResponseType:function(url) {
    var rui = new ape.URI(url);
    var ext = ape.path.getExtension(uri.path);
    if (Http.binaryExtensions.indexOf(ext) >= 0) {
      return Http.ResponseType.ARRAY_BUFFER;
    }
    if (ext === ".xml") {
      return Http.ResponseType.DOCUMENT;
    }
    return Http.ResponseType.TEXT;
  }, _isBinaryContentType:function(contentType) {
    var binType = [Http.ContentType.MP4, Http.ContentType.WAV, Http.ContentType.OGG, Http.ContentType.MP3, Http.ContentType.BIN, Http.ContentType.DDS];
    if (binType.indexOf(contentType) >= 0) {
      return true;
    }
    return false;
  }, _onReadyStateChange:function(method, url, options, xhr) {
    if (xhr.readyState === 4) {
      switch(xhr.status) {
        case 0:
          {
            if (url[0] != "/") {
              this._onSuccess(method, rul, options, xhr);
            }
            break;
          }
        case 200:
        case 201:
        case 206:
        case 304:
          {
            this._onSuccess(method, url, options, xhr);
            break;
          }
        default:
          {
            this._onError(method, url, options, xhr);
            break;
          }
      }
    }
  }, _onSuccess:function(method, url, options, xhr) {
    var response;
    var header;
    var contentType;
    var parts;
    header = xhr.getResponseHeader("Content-Type");
    if (header) {
      parts = header.split(";");
      contentType = parts[0].trim();
    }
    try {
      if (contentType === this.ContentType.JSON || url.split("?")[0].endWith(".json")) {
        response = JSON.parse(xhr.responseText);
      } else {
        if (this._isBinaryContentType(contentType)) {
          response = xhr.response;
        } else {
          if (contentType) {
            logWARNING(ape.string.format("responseType: {0} being served with Content-Type: {1}", xhr.responseType, contentType));
          }
          if (xhr.responseType === Http.ResponseType.ARRAY_BUFFER) {
            response = xhr.response;
          } else {
            if (xhr.responseType === Http.ResponseType.BLOB || xhr.responseType === Http.ResponseType.JSON) {
              response = xhr.response;
            } else {
              if (xhr.responseType === Http.ResponseType.DOCUMENT || contentType === this.ContentType.XML) {
                response = xhr.responseXML;
              } else {
                response = xhr.responseText;
              }
            }
          }
        }
      }
      options.callback(null, response);
    } catch (err) {
      options.callback(err);
    }
  }, _onError:function(method, url, options, xhr) {
    options.callback(xhr.status, null);
  }});
  return {Http:Http, http:new Http};
}());
Object.assign(ape, function() {
  var Bundle = function(files) {
    this._blobUrls = {};
    for (var i = 0, len = files.length; i < len; i++) {
      if (files[i].url) {
        this._blobUrls[files[i].name] = files[i].url;
      }
    }
  };
  Bundle.prototype.hasBlobUrl = function(url) {
    return !!this._blobUrls[url];
  };
  Bundle.prototype.getBlobUrl = function(url) {
    return this._blobUrls[url];
  };
  Bundle.prototype.destroy = function() {
    for (var key in this._blobUrls) {
      URL.revokeObjectURL(this._blobUrls[key]);
    }
    this._blobUrls = null;
  };
  return {Bundle:Bundle};
}());
Object.assign(ape, function() {
  var BundleRegistry = function(assets) {
    this._assets = assets;
    this._bundleAssets = {};
    this._assetsInBundles = {};
    this._urlsInBundles = {};
    this._fileRequests = {};
    this._assets.on("add", this._onAssetAdded, this);
    this._assets.on("remove", this._onAssetRemoved, this);
  };
  Object.assign(BundleRegistry.prototype, {_onAssetAdded:function(asset) {
    if (asset.type === "bundle") {
      this._bundleAssets[asset.id] = asset;
      this._registerBundleEventListeners(asset.id);
      for (var i = 0, len = asset.data.assets.length; i < len; i++) {
        this._indexAssetInBundle(asset.data.assets[i], asset);
      }
    } else {
      if (this._assetsInBundles[asset.id]) {
        this._indexAssetFileUrls(asset);
      }
    }
  }, _registerBundleEventListeners:function(bundleAssetId) {
    this._assets.on("load:" + bundleAssetId, this._onBundleLoaded, this);
    this._assets.on("error:" + bundleAssetId, this._onBundleError, this);
  }, _unregisterBundleEventListeners:function(bundleAssetId) {
    this._assets.off("load:" + bundleAssetId, this._onBundleLoaded, this);
    this._assets.off("error:" + bundleAssetId, this._onBundleError, this);
  }, _indexAssetInBundle:function(assetId, bundleAsset) {
    if (!this._assetsInBundles[assetId]) {
      this._assetsInBundles[assetId] = [bundleAsset];
    } else {
      var bundles = this._assetsInBundles[assetId];
      var idx = bundles.indexOf(bundleAsset);
      if (idx === -1) {
        bundles.push(bundleAsset);
      }
    }
    var asset = this._assets.get(assetId);
    if (asset) {
      this._indexAssetFileUrls(asset);
    }
  }, _indexAssetFileUrls:function(asset) {
    var urls = this._getAssetFileUrls(asset);
    if (!urls) {
      return;
    }
    for (var i = 0, len = urls.length; i < len; i++) {
      var url = urls[i];
      this._urlsInBundles[url] = this._assetsInBundles[asset.id];
    }
  }, _getAssetFileUrls:function(asset) {
    var url = asset.getFileUrl();
    if (!url) {
      return null;
    }
    url = this._normalizeUrl(url);
    var urls = [url];
    if (asset.type === "font") {
      var numFiles = asset.data.info.maps.length;
      for (var i = 1; i < numFiles; i++) {
        urls.push(url.replace(".png", i + ".png"));
      }
    }
    return urls;
  }, _normalizeUrl:function(url) {
    return url && url.split("?")[0];
  }, _onAssetRemoved:function(asset) {
    if (asset.type === "bundle") {
      delete this._bundleAssets[asset.id];
      this._unregisterBundleEventListeners(asset.id);
      var idx, id;
      for (id in this._assetsInBundles) {
        var array = this._assetsInBundles[id];
        idx = array.indexOf(asset);
        if (idx !== -1) {
          array.splice(idx, 1);
          if (!array.length) {
            delete this._assetsInBundles[id];
            for (var url in this._urlsInBundles) {
              if (this._urlsInBundles[url] === array) {
                delete this._urlsInBundles[url];
              }
            }
          }
        }
      }
      this._onBundleError("Bundle " + asset.id + " was removed", asset);
    } else {
      if (this._assetsInBundles[asset.id]) {
        delete this._assetsInBundles[asset.id];
        var urls = this._getAssetFileUrls(asset);
        for (var i = 0, len = urls.length; i < len; i++) {
          delete this._urlsInBundles[urls[i]];
        }
      }
    }
  }, _onBundleLoaded:function(bundleAsset) {
    if (!bundleAsset.resource) {
      this._onBundleError("Bundle " + bundleAsset.id + " failed to load", bundleAsset);
      return;
    }
    requestAnimationFrame(function() {
      if (!this._fileRequests) {
        return;
      }
      for (var url in this._fileRequests) {
        var bundles = this._urlsInBundles[url];
        if (!bundles || bundles.indexOf(bundleAsset) === -1) {
          continue;
        }
        var decodedUrl = decodeURIComponent(url);
        var err = null;
        if (!bundleAsset.resource.hasBlobUrl(decodedUrl)) {
          err = "Bundle " + bundleAsset.id + " does not contain URL " + url;
        }
        var requests = this._fileRequests[url];
        for (var i = 0, len = requests.length; i < len; i++) {
          if (err) {
            requests[i](err);
          } else {
            requests[i](null, bundleAsset.resource.getBlobUrl(decodedUrl));
          }
        }
        delete this._fileRequests[url];
      }
    }.bind(this));
  }, _onBundleError:function(err, bundleAsset) {
    for (var url in this._fileRequests) {
      var bundle = this._findLoadedOrLoadingBundleForUrl(url);
      if (!bundle) {
        var requests = this._fileRequests[url];
        for (var i = 0, len = requests.length; i < len; i++) {
          requests[i](err);
        }
        delete this._fileRequests[url];
      }
    }
  }, _findLoadedOrLoadingBundleForUrl:function(url) {
    var bundles = this._urlsInBundles[url];
    if (!bundles) {
      return null;
    }
    var len = bundles.length;
    var i;
    for (i = 0; i < len; i++) {
      if (bundles[i].loaded && bundles[i].resource) {
        return bundles[i];
      }
    }
    for (i = 0; i < len; i++) {
      if (bundles[i].loading) {
        return bundles[i];
      }
    }
    return null;
  }, listBundlesForAsset:function(asset) {
    return this._assetsInBundles[asset.id] || null;
  }, list:function() {
    var result = [];
    for (var id in this._bundleAssets) {
      result.push(this._bundleAssets[id]);
    }
    return result;
  }, hasUrl:function(url) {
    return !!this._urlsInBundles[url];
  }, canLoadUrl:function(url) {
    return !!this._findLoadedOrLoadingBundleForUrl(url);
  }, loadUrl:function(url, callback) {
    var bundle = this._findLoadedOrLoadingBundleForUrl(url);
    if (!bundle) {
      callback("URL" + url + "not found in any bundles");
      return;
    }
    if (bundle.loaded) {
      var decodedUrl = decodeURIComponent(url);
      if (!bundle.resource.hasBlobUrl(decodedUrl)) {
        callback("Bundle" + bundle.id + "does not contain URL" + url);
        return;
      }
      callback(null, bundle.resource.getBlobUrl(decodedUrl));
    } else {
      if (this._fileRequests.hasOwnProperty(url)) {
        this._fileRequests[url].push(callback);
      } else {
        this._fileRequests[url] = [callback];
      }
    }
  }, destroy:function() {
    this._assets.off("add", this._onAssetAdded, this);
    this._assets.off("remove", this._onAssetRemoved, this);
    for (var id in this._bundleAssets) {
      this._unregisterBundleEventListeners(id);
    }
    this._assets = null;
    this._bundleAssets = null;
    this._assetsInBundles = null;
    this._urlsInBundles = null;
    this._fileRequests = null;
  }});
  return {BundleRegistry:BundleRegistry};
}());
Object.assign(ape, function() {
  var I18nParser = function() {
  };
  I18nParser.prototype._validate = function(data) {
    if (!data.header) {
      throw new Error('ape.I18n#addData: Missing "header" field');
    }
    if (!data.header.version) {
      throw new Error('ape.I18n#addData: Missing "header.version" field');
    }
    if (data.header.version !== 1) {
      throw new Error('ape.I18n#addData: Invalid "header.version" field');
    }
    if (!data.data) {
      throw new Error('ape.I18n#addData: Missing "data" field');
    } else {
      if (!Array.isArray(data.data)) {
        throw new Error('ape.I18n#addData: "data" field must be an array');
      }
    }
    for (var i = 0, len = data.data.length; i < len; i++) {
      var entry = data.data[i];
      if (!entry.info) {
        throw new Error('ape.I18n#addData: missing "data[' + i + '].info" field');
      }
      if (!entry.info.locale) {
        throw new Error('ape.I18n#addData: missing "data[' + i + '].info.locale" field');
      }
      if (typeof entry.info.locale !== "string") {
        throw new Error('ape.I18n#addData: "data[' + i + '].info.locale" must be a string');
      }
      if (!entry.messages) {
        throw new Error('ape.I18n#addData: missing "data[' + i + '].messages" field');
      }
    }
  };
  I18nParser.prototype.parse = function(data) {
    this._validate(data);
    return data.data;
  };
  return {I18nParser:I18nParser};
}());
Object.assign(ape, function() {
  var PLURALS = {};
  var definePluralFn = function(locales, fn) {
    for (var i = 0, len = locales.length; i < len; i++) {
      PLURALS[locales[i]] = fn;
    }
  };
  var getLang = function(locale) {
    var idx = locale.indexOf("-");
    if (idx !== -1) {
      return locale.substring(0, idx);
    }
    return locale;
  };
  var DEFAULT_LOCALE = "en-US";
  var DEFAULT_PLURAL_FN = PLURALS[getLang(DEFAULT_LOCALE)];
  var DEFAULT_LOCALE_FALLBACKS = {"en":"en-US", "es":"en-ES", "zh":"zh-CN", "fr":"fr-FR", "de":"de-DE", "it":"it-IT", "ru":"ru-RU", "ja":"ja-JP"};
  var getPluralFn = function(lang) {
    return PLURALS[lang] || DEFAULT_PLURAL_FN;
  };
  definePluralFn(["ja", "ko", "th", "vi", "zh"], function(n) {
    return 0;
  });
  definePluralFn(["fa", "hi"], function(n) {
    if (n >= 0 && n <= 1) {
      return 0;
    }
    return 1;
  });
  definePluralFn(["fr"], function(n) {
    if (n >= 0 && n < 2) {
      return 0;
    }
    return 1;
  });
  definePluralFn(["de", "en", "it", "el", "es", "tr"], function(n) {
    if (n === 1) {
      return 0;
    }
    return 1;
  });
  definePluralFn(["ru", "uk"], function(n) {
    if (Number.isInteger(n)) {
      var mod10 = n % 10;
      var mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) {
        return 0;
      } else {
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
          return 1;
        } else {
          if (mod10 === 0 || mod10 >= 5 && mod10 <= 9 || mod100 >= 11 && mod100 <= 14) {
            return 2;
          }
        }
      }
    }
    return 3;
  });
  definePluralFn(["ar"], function(n) {
    if (n === 0) {
      return 0;
    } else {
      if (n === 1) {
        return 1;
      } else {
        if (n === 2) {
          return 2;
        }
      }
    }
    if (Number.isInteger(n)) {
      var mod100 = n % 100;
      if (mod100 >= 3 && mod100 <= 10) {
        return 3;
      } else {
        if (mod100 >= 11 && mod100 <= 99) {
          return 4;
        }
      }
    }
    return 5;
  });
  var I18n = function(app) {
    ape.events.attach(this);
    this.locale = DEFAULT_LOCALE;
    this._translations = {};
    this._availableLangs = {};
    this._app = app;
    this._assets = [];
    this._parser = new ape.I18nParser;
  };
  I18n.prototype.getText = function(key, locale) {
    var result = key;
    var lang;
    if (!locale) {
      locale = this._locale;
      lang = this._lang;
    }
    var translations = this._translations[locale];
    if (!translations) {
      if (!lang) {
        lang = getLang(locale);
      }
      locale = this._findFallbackLocale(lang);
      translations = this._translations[locale];
    }
    if (translations) {
      result = translations[key];
      if (result) {
        if (Array.isArray(result)) {
          result = result[0] || "";
        }
      } else {
        result = key;
      }
    }
    return result;
  };
  I18n.prototype.getPluralText = function(key, n, locale) {
    var result = key;
    var pluralFn;
    var lang;
    if (!locale) {
      locale = this._locale;
      lang = this._lang;
      pluralFn = this._pluralFn;
    } else {
      lang = getLang(locale);
      pluralFn = getPluralFn(lang);
    }
    var translations = this._translations[locale];
    if (!translations) {
      locale = this._findFallbackLocale(lang);
      pluralFn = getPluralFn(lang);
      translations = this._translations[locale];
    }
    if (translations && translations[key]) {
      var index = pluralFn(n);
      result = translations[key][index] || key;
    }
    return result;
  };
  I18n.prototype.addData = function(data) {
    var parsed;
    try {
      parsed = this._parser.parse(data);
    } catch (err) {
      console.error(err);
      return;
    }
    for (var i = 0, len = parsed.length; i < len; i++) {
      var entry = parsed[i];
      var locale = entry.info.locale;
      var messages = entry.messages;
      if (!this._translations[locale]) {
        this._translations[locale] = {};
        var lang = getLang(locale);
        if (!this._availableLangs[lang]) {
          this._availableLangs[lang] = locale;
        }
      }
      Object.assign(this._translations[locale], messages);
      this.fire("data:add", locale, messages);
    }
  };
  I18n.prototype.removeData = function(data) {
    var parsed;
    var key;
    try {
      parsed = this._parser.parse(data);
    } catch (err) {
      console.error(err);
      return;
    }
    for (var i = 0, len = parsed.length; i < len; i++) {
      var entry = parsed[i];
      var locale = entry.info.locale;
      var translations = this._translations[locale];
      if (!translations) {
        continue;
      }
      var messages = entry.messages;
      for (key in messages) {
        delete translations[key];
      }
      var hasAny = false;
      for (key in translations) {
        hasAny = true;
        break;
      }
      if (!hasAny) {
        delete this._translations[locale];
        delete this._availableLangs[getLang(locale)];
      }
      this.fire("data:remove", locale, messages);
    }
  };
  I18n.prototype.destroy = function() {
    this._translations = null;
    this._availableLangs = null;
    this._assets = null;
    this._parser = null;
    this.off();
  };
  Object.defineProperty(I18n.prototype, "locale", {get:function() {
    return this._locale;
  }, set:function(value) {
    if (this._locale === value) {
      return;
    }
    var old = this._locale;
    this._locale = value;
    this._lang = getLang(value);
    this._pluralFn = getPluralFn(this._lang);
    this.fire("set:locale", value, old);
  }});
  Object.defineProperty(I18n.prototype, "assets", {get:function() {
    return this._assets;
  }, set:function(value) {
    var i;
    var len;
    var id;
    var asset;
    var index = {};
    for (i = 0, len = value.length; i < len; i++) {
      id = value[i] instanceof ape.Asset ? value[i].id : value[i];
      index[id] = true;
    }
    i = this._assets.length;
    while (i--) {
      id = this._assets[i];
      if (!index[id]) {
        this._app.assets.off("add:" + id, this._onAssetAdd, this);
        asset = this._app.assets.get(id);
        if (asset) {
          this._onAssetRemove(asset);
        }
        this._assets.splice(i, 1);
      }
    }
    for (id in index) {
      id = parseInt(id, 10);
      if (this._assets.indexOf(id) !== -1) {
        continue;
      }
      this._assets.push(id);
      asset = this._app.assets.get(id);
      if (!asset) {
        this._app.assets.once("add:" + id, this._onAssetAdd, this);
      } else {
        this._onAssetAdd(asset);
      }
    }
  }});
  I18n.prototype._findFallbackLocale = function(lang) {
    var result = DEFAULT_LOCALE_FALLBACKS[lang];
    if (result && this._translations[result]) {
      return result;
    }
    result = this._availableLangs[lang];
    if (result && this._translations[result]) {
      return result;
    }
    return DEFAULT_LOCALE;
  };
  I18n.prototype._onAssetAdd = function(asset) {
    asset.on("load", this._onAssetLoad, this);
    asset.on("change", this._onAssetChange, this);
    asset.on("remove", this._onAssetRemove, this);
    asset.on("unload", this._onAssetUnload, this);
    if (asset.resource) {
      this._onAssetLoad(asset);
    }
  };
  I18n.prototype._onAssetLoad = function(asset) {
    this.addData(asset.resource);
  };
  I18n.prototype._onAssetChange = function(asset) {
    if (asset.resource) {
      this.addData(asset.resource);
    }
  };
  I18n.prototype._onAssetRemove = function(asset) {
    asset.off("load", this._onAssetLoad, this);
    asset.off("change", this._onAssetChange, this);
    asset.off("remove", this._onAssetRemove, this);
    asset.off("unload", this._onAssetUnload, this);
    if (asset.resource) {
      this.removeData(asset.resource);
    }
    this._app.assets.once("add:" + asset.id, this._onAssetAdd, this);
  };
  I18n.prototype._onAssetUnload = function(asset) {
    if (asset.resource) {
      this.removeData(asset.resource);
    }
  };
  return {I18n:I18n};
}());
var Device = null;
ape.gfx = {};
ape.post = {};
ape.post.initialize = function() {
  for (var effect in ape.post) {
    if (typeof ape.post[effect] === "object") {
      ape.post[effect].initialize();
    }
  }
};
ape.post.bloom = function() {
  var targets = [];
  var programs = {};
  var vertexBuffer = null;
  var getBlurValues = function(dx, dy, blurAmount) {
    var _computeGaussian = function(n, theta) {
      return 1.0 / Math.sqrt(2 * Math.PI * theta) * Math.exp(-(n * n) / (2 * theta * theta));
    };
    var sampleCount = 15;
    var sampleWeights = [_computeGaussian(0, blurAmount)];
    var sampleOffsets = [0, 0];
    var totalWeights = sampleWeights[0];
    var i, len;
    for (i = 0, len = Math.floor(sampleCount / 2); i < len; i++) {
      var weight = _computeGaussian(i + 1, blurAmount);
      sampleWeights.push(weight, weight);
      totalWeights += weight * 2;
      var sampleOffset = i * 2 + 1.5;
      sampleOffsets.push(dx * sampleOffset, dy * sampleOffset, -dx * sampleOffset, -dy * sampleOffset);
    }
    for (i = 0, len = sampleWeights.length; i < len; i++) {
      sampleWeights[i] /= totalWeights;
    }
    return {weights:sampleWeights, offsets:sampleOffsets};
  };
  return {initialize:function() {
    var passThroughVert = ["attribute vec3 vertex_position;", "attribute vec2 vertex_texCoord0;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(vertex_position, 1.0);", "    vUv0 = vertex_texCoord0;", "}"].join("\n");
    var bloomExtractFrag = ["#ifdef GL_ES\n", "precision highp float;", "#endif\n\n", "", "varying vec2 vUv0;", "", "uniform sampler2D base_texture;", "uniform float bloom_threshold;", "", "void main(void)", "{", "    vec4 color = texture2D(base_texture, vUv0);", "", "    gl_FragColor = clamp((color - bloom_threshold) / (1.0 - bloom_threshold), 0.0, 1.0);", "}"].join("\n");
    var gaussianBlurFrag = ["#ifdef GL_ES\n", "precision highp float;", "#endif\n\n", "", "#define SAMPLE_COUNT 15", "", "varying vec2 vUv0;", "", "uniform sampler2D bloom_texture;", "uniform vec2 blur_offsets[SAMPLE_COUNT];", "uniform float blur_weights[SAMPLE_COUNT];", "", "void main(void)", "{", "    vec4 color = vec4(0.0);", "    for (int i = 0; i < SAMPLE_COUNT; i++)", "    {", "        color += texture2D(bloom_texture, vUv0 + blur_offsets[i]) * blur_weights[i];", "    }", "", "    gl_FragColor = color;", 
    "}"].join("\n");
    var bloomCombineFrag = ["#ifdef GL_ES\n", "precision highp float;", "#endif\n\n", "", "varying vec2 vUv0;", "", "uniform sampler2D base_texture;", "uniform sampler2D bloom_texture;", "uniform float bloom_intensity;", "uniform float base_intensity;", "uniform float bloom_saturation;", "uniform float base_saturation;", "", "vec4 adjust_saturation(vec4 color, float saturation)", "{", "    float grey = dot(color.rgb, vec3(0.3, 0.59, 0.11));", "", "    return mix(vec4(grey), color, saturation);", 
    "}", "", "void main(void)", "{", "    vec4 bloom = texture2D(bloom_texture, vUv0);", "    vec4 base = texture2D(base_texture, vUv0);", "", "    bloom = adjust_saturation(bloom, bloom_saturation) * bloom_intensity;", "    base = adjust_saturation(base, base_saturation) * base_intensity;", "", "    base *= (1.0 - clamp(bloom, 0.0, 1.0));", "", "    gl_FragColor = base + bloom;", "}"].join("\n");
    var passThroughShader = new ape.gfx.Shader(ape.gfx.ShaderType.VERTEX, passThroughVert);
    var extractShader = new ape.gfx.Shader(ape.gfx.ShaderType.FRAGMENT, bloomExtractFrag);
    var blurShader = new ape.gfx.Shader(ape.gfx.ShaderType.FRAGMENT, gaussianBlurFrag);
    var combineShader = new ape.gfx.Shader(ape.gfx.ShaderType.FRAGMENT, bloomCombineFrag);
    programs["extract"] = new ape.gfx.Program(passThroughShader, extractShader);
    programs["blur"] = new ape.gfx.Program(passThroughShader, blurShader);
    programs["combine"] = new ape.gfx.Program(passThroughShader, combineShader);
    var backBuffer = ape.gfx.FrameBuffer.getBackBuffer();
    width = backBuffer.getWidth();
    height = backBuffer.getHeight();
    var vertexFormat = new ape.gfx.VertexFormat;
    vertexFormat.begin();
    vertexFormat.addElement(new ape.gfx.VertexElement("vertex_position", 3, ape.gfx.VertexElementType.FLOAT32));
    vertexFormat.addElement(new ape.gfx.VertexElement("vertex_texCoord0", 2, ape.gfx.VertexElementType.FLOAT32));
    vertexFormat.end();
    vertexBuffer = new ape.gfx.VertexBuffer(vertexFormat, 4);
    var iterator = new ape.gfx.VertexIterator(vertexBuffer);
    iterator.element.vertex_position.set(-1.0, -1.0, 0.0);
    iterator.element.vertex_texCoord0.set(0.0, 0.0);
    iterator.next();
    iterator.element.vertex_position.set(1.0, -1.0, 0.0);
    iterator.element.vertex_texCoord0.set(1.0, 0.0);
    iterator.next();
    iterator.element.vertex_position.set(-1.0, 1.0, 0.0);
    iterator.element.vertex_texCoord0.set(0.0, 1.0);
    iterator.next();
    iterator.element.vertex_position.set(1.0, 1.0, 0.0);
    iterator.element.vertex_texCoord0.set(1.0, 1.0);
    iterator.end();
  }, render:function(inputTarget, outputTarget, options) {
    var defaults = {bloomThreshold:0.25, blurAmount:4, bloomIntensity:1.25, baseIntensity:1, bloomSaturation:1, baseSaturation:1};
    if (options === undefined) {
      options = options || defaults;
    } else {
      for (var index in defaults) {
        if (typeof options[index] == "undefined") {
          options[index] = defaults[index];
        }
      }
    }
    var device = ape.gfx.GraphicsDevice.getCurrent();
    var scope = device.scope;
    var _drawFullscreenQuad = function(dst, program) {
      device.setRenderTarget(dst);
      device.updateBegin();
      device.updateLocalState({depthTest:false, depthWrite:false});
      device.setVertexBuffer(vertexBuffer, 0);
      device.setProgram(program);
      device.draw({primitiveType:ape.gfx.PrimType.TRIANGLE_STRIP, numVertices:4, useIndexBuffer:false});
      device.clearLocalState();
      device.updateEnd();
    };
    scope.resolve("bloom_threshold").setValue(options.bloomThreshold);
    scope.resolve("base_texture").setValue(inputTarget.getFrameBuffer().getTexture());
    _drawFullscreenQuad(targets[0], programs["extract"]);
    var blurValues;
    blurValues = getBlurValues(1.0 / targets[1].getFrameBuffer().getWidth(), 0, options.blurAmount);
    scope.resolve("blur_weights[0]").setValue(blurValues.weights);
    scope.resolve("blur_offsets[0]").setValue(blurValues.offsets);
    scope.resolve("bloom_texture").setValue(targets[0].getFrameBuffer().getTexture());
    _drawFullscreenQuad(targets[1], programs["blur"]);
    blurValues = getBlurValues(0, 1.0 / targets[0].getFrameBuffer().getHeight(), options.blurAmount);
    scope.resolve("blur_weights[0]").setValue(blurValues.weights);
    scope.resolve("blur_offsets[0]").setValue(blurValues.offsets);
    scope.resolve("bloom_texture").setValue(targets[1].getFrameBuffer().getTexture());
    _drawFullscreenQuad(targets[0], programs["blur"]);
    scope.resolve("bloom_intensity").setValue(options.bloomIntensity);
    scope.resolve("base_intensity").setValue(options.baseIntensity);
    scope.resolve("bloom_saturation").setValue(options.bloomSaturation);
    scope.resolve("base_saturation").setValue(options.baseSaturation);
    scope.resolve("bloom_texture").setValue(targets[0].getFrameBuffer().getTexture());
    scope.resolve("base_texture").setValue(inputTarget.getFrameBuffer().getTexture());
    _drawFullscreenQuad(outputTarget, programs["combine"]);
  }};
}();
ape.gfx.programlib = {};
ape.gfx.programlib.basic = {};
ape.gfx.programlib.basic.generateKey = function(options) {
  var key = "basic";
  if (options.fog) {
    key += "_fog";
  }
  if (options.alphaTest) {
    key += "_atst";
  }
  if (options.vertexColors) {
    key += "_vcol";
  }
  if (options.diffuseMap) {
    key += "_diff";
  }
  return key;
};
ape.gfx.programlib.basic.generateVertexShader = function(options) {
  var code = "";
  code += "attribute vec3 vertex_position;\n";
  if (options.vertexColors) {
    code += "attribute vec4 vertex_color;\n";
  }
  if (options.diffuseMap) {
    code += "attribute vec2 vertex_texCoord0;\n";
  }
  code += "uniform mat4 matrix_viewProjection;\n";
  code += "uniform mat4 matrix_model;\n";
  if (options.vertexColors) {
    code += "varying vec4 vColor;\n";
  }
  if (options.diffuseMap) {
    code += "varying vec2 vUv0;\n";
  }
  code += "\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    gl_Position = matrix_viewProjection * matrix_model * vec4(vertex_position, 1.0);\n";
  if (options.vertexColors) {
    code += "    vColor = vertex_color;\n";
  }
  if (options.diffuseMap) {
    code += "    vUv0 = vertex_texCoord0;\n";
  }
  code += "}";
  return code;
};
ape.gfx.programlib.basic.generateFragmentShader = function(options) {
  var code = "";
  code += "#ifdef GL_ES\n";
  code += "precision highp float;\n";
  code += "#endif\n\n";
  if (options.vertexColors) {
    code += "varying vec4 vColor;\n";
  }
  if (options.diffuseMap) {
    code += "varying vec2 vUv0;\n";
  }
  if (!options.vertexColors) {
    code += "uniform vec4 constant_color;\n";
  }
  if (options.diffuseMap) {
    code += "uniform sampler2D texture_diffuseMap;\n";
  }
  if (options.fog) {
    code += "uniform vec4 fog_color;\n";
    code += "uniform float fog_density;\n\n";
  }
  if (options.alphatest) {
    code += "uniform float alpha_ref;\n";
  }
  code += "\n";
  code += "void main(void)\n";
  code += "{\n";
  if (options.vertexColors) {
    code += "    vec4 color = vColor;\n";
  } else {
    code += "    vec4 color = constant_color;\n";
  }
  if (options.diffuseMap) {
    code += "    color *= texture2D(texture_diffuseMap, vUv0);\n";
  }
  if (options.alphatest) {
    code += "    if (color.a <= alpha_ref)\n";
    code += "    {\n";
    code += "        discard;\n";
    code += "    }\n";
  }
  code += "    gl_FragColor = clamp(color, 0.0, 1.0);\n\n";
  if (options.fog) {
    code += "    const float LOG2 = 1.442695;\n";
    code += "    float z = gl_FragCoord.z / gl_FragCoord.w;\n";
    code += "    float fogFactor = exp2(-fog_density * fog_density * z * z * LOG2);\n";
    code += "    fogFactor = clamp(fogFactor, 0.0, 1.0);\n";
    code += "    gl_FragColor = mix(fog_color, gl_FragColor, fogFactor );\n";
  }
  code += "}";
  return code;
};
ape.gfx.programlib.particle = {};
ape.gfx.programlib.particle.generateKey = function(options) {
  var key = "particle";
  return key;
};
ape.gfx.programlib.particle.generateVertexShader = function(options) {
  var code = "";
  code += "attribute vec4 particle_uvLifeTimeFrameStart;\n";
  code += "attribute vec4 particle_positionStartTime;\n";
  code += "attribute vec4 particle_velocityStartSize;\n";
  code += "attribute vec4 particle_accelerationEndSize;\n";
  code += "attribute vec4 particle_spinStartSpinSpeed;\n";
  code += "attribute vec4 particle_colorMult;\n";
  code += "uniform mat4 matrix_viewProjection;\n";
  code += "uniform mat4 matrix_model;\n";
  code += "uniform mat4 matrix_viewInverse;\n";
  code += "uniform vec3 worldVelocity;\n";
  code += "uniform vec3 worldAcceleration;\n";
  code += "uniform float timeRange;\n";
  code += "uniform float time;\n";
  code += "uniform float timeOffset;\n";
  code += "uniform float frameDuration;\n";
  code += "uniform float numFrames;\n\n";
  code += "varying vec2 vUv0;\n";
  code += "varying vec2 vAge;\n";
  code += "varying vec4 vColor;\n\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    vec2 uv = uvLifeTimeFrameStart.xy;\n";
  code += "    float lifeTime = uvLifeTimeFrameStart.z;\n";
  code += "    float frameStart = uvLifeTimeFrameStart.w;\n";
  code += "    vec3 position = positionStartTime.xyz;\n";
  code += "    float startTime = positionStartTime.w;\n";
  code += "    vec3 velocity = (matrix_model * vec4(velocityStartSize.xyz, 0.0)).xyz + worldVelocity;\n";
  code += "    float startSize = velocityStartSize.w;\n";
  code += "    vec3 acceleration = (matrix_model * vec4(accelerationEndSize.xyz, 0.0)).xyz + worldAcceleration;\n";
  code += "    float endSize = accelerationEndSize.w;\n";
  code += "    float spinStart = spinStartSpinSpeed.x;\n";
  code += "    float spinSpeed = spinStartSpinSpeed.y;\n";
  code += "    float localTime = mod((time - timeOffset - startTime), timeRange);\n";
  code += "    float percentLife = localTime / lifeTime;\n";
  code += "    float frame = mod(floor(localTime / frameDuration + frameStart), numFrames);\n";
  code += "    float uOffset = frame / numFrames;\n";
  code += "    float u = uOffset + (uv.x + 0.5) * (1.0 / numFrames);\n";
  code += "    vUv0 = vec2(u, uv.y + 0.5);\n";
  code += "    vColor = colorMult;\n";
  code += "    vec3 basisX = matrix_viewInverse[0].xyz;\n";
  code += "    vec3 basisZ = matrix_viewInverse[1].xyz;\n";
  code += "    float size = mix(startSize, endSize, percentLife);\n";
  code += "    size = (percentLife < 0.0 || percentLife > 1.0) ? 0.0 : size;\n";
  code += "    float s = sin(spinStart + spinSpeed * localTime);\n";
  code += "    float c = cos(spinStart + spinSpeed * localTime);\n";
  code += "    vec2 rotatedPoint = vec2(uv.x * c + uv.y * s, \n";
  code += "                             -uv.x * s + uv.y * c);\n";
  code += "    vec3 localPosition = vec3(basisX * rotatedPoint.x +\n";
  code += "                              basisZ * rotatedPoint.y) * size +\n";
  code += "                              velocity * localTime +\n";
  code += "                              acceleration * localTime * localTime + \n";
  code += "                              position;\n";
  code += "    vAge = percentLife;\n";
  code += "    gl_Position = matrix_viewProjection * vec4(localPosition + matrix_model[3].xyz, 1.0);\n";
  code += "}";
  return code;
};
ape.gfx.programlib.particle.generateFragmentShader = function(options) {
  var code = "";
  code += "#ifdef GL_ES\n";
  code += "precision mediump float;\n";
  code += "#endif\n\n";
  code += "varying vec2 vUv0;\n";
  code += "varying vec2 vAge;\n";
  code += "varying vec4 vColor;\n";
  code += "uniform sampler2D texture_diffuseMap;\n";
  code += "uniform sampler2D texture_rampMap;\n\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    vec4 colorMult = texture2D(texture_rampMap, vec2(vAge, 0.5)) * vColor;\n";
  code += "    gl_FragColor = texture2D(colorSampler, vUv0) * colorMult;\n";
  code += "}";
  return code;
};
ape.gfx.programlib.phong = {};
ape.gfx.programlib.phong.generateKey = function(options) {
  var key = "phong";
  if (options.skin) {
    key += "_skin";
  }
  if (options.fog) {
    key += "_fog";
  }
  if (options.alphaTest) {
    key += "_atst";
  }
  if (options.numDirectionals > 0) {
    key += "_" + options.numDirectionals + "dir";
  }
  if (options.numPoints > 0) {
    key += "_" + options.numPoints + "pnt";
  }
  if (options.vertexColors) {
    key += "_vcol";
  }
  if (options.diffuseMap) {
    key += "_diff";
  }
  if (options.specularMap) {
    key += "_spec";
  }
  if (options.emissiveMap) {
    key += "_emis";
  }
  if (options.opacityMap) {
    key += "_opac";
  }
  if (options.sphereMap) {
    key += "_sphr";
  }
  if (options.cubeMap) {
    key += "_cube";
  }
  if (options.bumpMap) {
    key += "_bump";
  }
  if (options.normalMap) {
    key += "_norm";
  }
  if (options.parallaxMap) {
    key += "_prlx";
  }
  if (options.lightMap) {
    key += "_lght";
  }
  if (options.shadowMap) {
    key += "_shdw";
  }
  return key;
};
ape.gfx.programlib.phong.generateVertexShader = function(options) {
  var code = "";
  var lighting = options.numDirectionals > 0 || options.numPoints > 0;
  code += "attribute vec3 vertex_position;\n";
  if (lighting || options.cubeMap || options.sphereMap) {
    code += "attribute vec3 vertex_normal;\n";
    if (options.bumpMap || options.normalMap || options.parallaxMap) {
      code += "attribute vec4 vertex_tangent;\n";
    }
  }
  if (options.diffuseMap || options.specularMap || options.emissiveMap || options.bumpMap || options.normalMap || options.parallaxMap || options.opacityMap) {
    code += "attribute vec2 vertex_texCoord0;\n";
  }
  if (options.lightMap) {
    code += "attribute vec2 vertex_texCoord1;\n";
  }
  if (options.vertexColors) {
    code += "attribute vec4 vertex_color;\n";
  }
  if (options.skin) {
    code += "attribute vec4 vertex_boneWeights;\n";
    code += "attribute vec4 vertex_boneIndices;\n";
  }
  code += "\n";
  code += "uniform mat4 matrix_view;\n";
  code += "uniform mat4 matrix_viewProjection;\n";
  code += "uniform mat4 matrix_model;\n";
  if (options.skin) {
    var numBones = ape.GraphicsDevice.getCurrent().getBoneLimit();
    code += "uniform mat4 matrix_pose[" + numBones + "];\n";
  }
  if (options.shadowMap) {
    code += "uniform mat4 matrix_shadow;\n";
  }
  for (var i = 0; i < options.numDirectionals + options.numPoints; i++) {
    code += "uniform vec3 light" + i + "_position;\n";
  }
  if (options.cubeMap || options.sphereMap) {
    code += "uniform vec3 view_position;\n";
  }
  if (options.diffuseMap) {
    code += "uniform mat4 texture_diffuseMapTransform;\n";
  }
  if (options.bumpMap) {
    code += "uniform mat4 texture_bumpMapTransform;\n";
  } else {
    if (options.normalMap) {
      code += "uniform mat4 texture_normalMapTransform;\n";
    } else {
      if (options.parallaxMap) {
        code += "uniform mat4 texture_parallaxMapTransform;\n";
      }
    }
  }
  if (options.opacityMap) {
    code += "uniform mat4 texture_opacityMapTransform;\n";
  }
  if (options.specularMap) {
    code += "uniform mat4 texture_specularMapTransform;\n";
  }
  if (options.emissiveMap) {
    code += "uniform mat4 texture_emissiveMapTransform;\n";
  }
  code += "\n";
  if (lighting) {
    code += "varying vec3 vViewDir;\n";
    for (var i = 0; i < options.numDirectionals + options.numPoints; i++) {
      code += "varying vec3 vLight" + i + "Dir;\n";
    }
    if (!(options.bumpMap || options.normalMap || options.parallaxMap)) {
      code += "varying vec3 vNormalE;\n";
    }
  }
  if (options.diffuseMap) {
    code += "varying vec2 vUvDiffuseMap;\n";
  }
  if (options.specularMap) {
    code += "varying vec2 vUvSpecularMap;\n";
  }
  if (options.emissiveMap) {
    code += "varying vec2 vUvEmissiveMap;\n";
  }
  if (options.opacityMap) {
    code += "varying vec2 vUvOpacityMap;\n";
  }
  if (options.bumpMap || options.normalMap || options.parallaxMap) {
    code += "varying vec2 vUvBumpMap;\n";
  }
  if (options.lightMap) {
    code += "varying vec2 vUvLightMap;\n";
  }
  if (options.cubeMap || options.sphereMap) {
    code += "varying vec3 vNormalW;\n";
    code += "varying vec3 vVertToEyeW;\n";
  }
  if (options.vertexColors) {
    code += "varying vec4 vVertexColor;\n";
  }
  if (options.shadowMap) {
    code += "varying vec4 vShadowCoord;\n";
  }
  code += "\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    vec4 positionW = matrix_model * vec4(vertex_position, 1.0);\n";
  if (lighting || options.cubeMap || options.sphereMap) {
    code += "    vec4 normalW   = matrix_model * vec4(vertex_normal, 0.0);\n";
    if (options.bumpMap || options.normalMap || options.parallaxMap) {
      code += "    vec4 tangentW  = matrix_model * vec4(vertex_tangent.xyz, 0.0);\n";
    }
  }
  code += "\n";
  if (options.skin) {
    code += "    vec4 skinned_position;\n";
    code += "    skinned_position  = vertex_boneWeights[0] * matrix_pose[int(vertex_boneIndices[0])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[1] * matrix_pose[int(vertex_boneIndices[1])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[2] * matrix_pose[int(vertex_boneIndices[2])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[3] * matrix_pose[int(vertex_boneIndices[3])] * positionW;\n";
    code += "    positionW = skinned_position;\n\n";
    if (lighting || options.cubeMap || options.sphereMap) {
      code += "    vec4 skinned_normal;\n";
      code += "    skinned_normal  = vertex_boneWeights[0] * matrix_pose[int(vertex_boneIndices[0])] * normalW;\n";
      code += "    skinned_normal += vertex_boneWeights[1] * matrix_pose[int(vertex_boneIndices[1])] * normalW;\n";
      code += "    skinned_normal += vertex_boneWeights[2] * matrix_pose[int(vertex_boneIndices[2])] * normalW;\n";
      code += "    skinned_normal += vertex_boneWeights[3] * matrix_pose[int(vertex_boneIndices[3])] * normalW;\n";
      code += "    normalW = skinned_normal;\n\n";
      if (options.bumpMap || options.normalMap || options.parallaxMap) {
        code += "    vec4 skinned_tangent;\n";
        code += "    skinned_tangent  = vertex_boneWeights[0] * matrix_pose[int(vertex_boneIndices[0])] * tangentW;\n";
        code += "    skinned_tangent += vertex_boneWeights[1] * matrix_pose[int(vertex_boneIndices[1])] * tangentW;\n";
        code += "    skinned_tangent += vertex_boneWeights[2] * matrix_pose[int(vertex_boneIndices[2])] * tangentW;\n";
        code += "    skinned_tangent += vertex_boneWeights[3] * matrix_pose[int(vertex_boneIndices[3])] * tangentW;\n";
        code += "    tangentW = skinned_tangent;\n\n";
      }
    }
  }
  code += "    gl_Position = matrix_viewProjection * positionW;\n\n";
  if (options.shadowMap) {
    code += "    vShadowCoord = matrix_shadow * positionW;\n";
  }
  if (lighting) {
    if (options.bumpMap || options.normalMap || options.parallaxMap) {
      code += "    vec3 normalE   = normalize((matrix_view * normalW).xyz);\n";
      code += "    vec3 tangentE  = normalize((matrix_view * tangentW).xyz);\n";
      code += "    vec3 binormalE = cross(normalE, tangentE) * vertex_tangent.w;\n";
      code += "    mat3 tbnMatrix = mat3(tangentE.x, binormalE.x, normalE.x,\n";
      code += "                          tangentE.y, binormalE.y, normalE.y,\n";
      code += "                          tangentE.z, binormalE.z, normalE.z);\n";
      code += "    vec3 positionE = vec3(matrix_view * positionW);\n";
      code += "    vViewDir = tbnMatrix * -positionE;\n";
      for (var i = 0; i < options.numDirectionals; i++) {
        code += "    vec3 light" + i + "DirE = vec3(matrix_view * vec4(-light" + i + "_position, 0.0));\n";
        code += "    vLight" + i + "Dir = tbnMatrix * light" + i + "DirE;\n";
      }
      for (var i = options.numDirectionals; i < options.numDirectionals + options.numPoints; i++) {
        code += "    vec3 light" + i + "DirE = vec3(matrix_view * vec4(light" + i + "_position - positionW.xyz, 0.0));\n";
        code += "    vLight" + i + "Dir = tbnMatrix * light" + i + "DirE;\n";
      }
    } else {
      code += "    vNormalE   = normalize((matrix_view * normalW).xyz);\n";
      code += "    vec3 positionE = vec3(matrix_view * positionW);\n";
      code += "    vViewDir = -positionE;\n";
      for (var i = 0; i < options.numDirectionals; i++) {
        code += "    vLight" + i + "Dir = vec3(matrix_view * vec4(-light" + i + "_position, 0.0));\n";
      }
      for (var i = options.numDirectionals; i < options.numDirectionals + options.numPoints; i++) {
        code += "    vLight" + i + "Dir = vec3(matrix_view * vec4(light" + i + "_position - positionW.xyz, 0.0));\n";
      }
    }
    code += "\n";
  }
  if (options.cubeMap || options.sphereMap) {
    code += "    vNormalW    = normalW.xyz;\n";
    code += "    vVertToEyeW = view_position - positionW.xyz;\n";
  }
  if (options.diffuseMap) {
    code += "    vUvDiffuseMap  = (texture_diffuseMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n";
  }
  if (options.bumpMap) {
    code += "    vUvBumpMap     = (texture_bumpMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n";
  } else {
    if (options.normalMap) {
      code += "    vUvBumpMap     = (texture_normalMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n";
    } else {
      if (options.parallaxMap) {
        code += "    vUvBumpMap     = (texture_parallaxMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n";
      }
    }
  }
  if (options.opacityMap) {
    code += "    vUvOpacityMap  = (texture_opacityMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n";
  }
  if (options.specularMap) {
    code += "    vUvSpecularMap = (texture_specularMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n";
  }
  if (options.emissiveMap) {
    code += "    vUvEmissiveMap = (texture_emissiveMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n";
  }
  if (options.lightMap) {
    code += "    vUvLightMap    = vertex_texCoord1;\n";
  }
  code += "}";
  return code;
};
ape.gfx.programlib.phong.generateFragmentShader = function(options) {
  var code = "";
  var lighting = options.numDirectionals > 0 || options.numPoints > 0;
  code += "#ifdef GL_ES\n";
  code += "precision highp float;\n";
  code += "#endif\n\n";
  if (lighting) {
    code += "varying vec3 vViewDir;\n";
    for (var i = 0; i < options.numDirectionals + options.numPoints; i++) {
      code += "varying vec3 vLight" + i + "Dir;\n";
    }
    if (!(options.bumpMap || options.normalMap)) {
      code += "varying vec3 vNormalE;\n";
    }
  }
  if (options.diffuseMap) {
    code += "varying vec2 vUvDiffuseMap;\n";
  }
  if (options.specularMap) {
    code += "varying vec2 vUvSpecularMap;\n";
  }
  if (options.emissiveMap) {
    code += "varying vec2 vUvEmissiveMap;\n";
  }
  if (options.opacityMap) {
    code += "varying vec2 vUvOpacityMap;\n";
  }
  if (options.bumpMap || options.normalMap || options.parallaxMap) {
    code += "varying vec2 vUvBumpMap;\n";
  }
  if (options.lightMap) {
    code += "varying vec2 vUvLightMap;\n";
  }
  if (options.cubeMap || options.sphereMap) {
    code += "varying vec3 vNormalW;\n";
    code += "varying vec3 vVertToEyeW;\n";
  }
  if (options.vertexColors) {
    code += "varying vec4 vVertexColor;\n";
  }
  if (options.shadowMap) {
    code += "varying vec4 vShadowCoord;\n";
  }
  code += "\n";
  if (lighting) {
    code += "uniform vec3 material_ambient;\n";
    code += "uniform vec3 material_diffuse;\n";
    if (options.specularMap) {
      code += "uniform sampler2D texture_specularMap;\n";
    } else {
      code += "uniform vec3 material_specular;\n";
    }
    code += "uniform float material_shininess;\n";
  }
  if (options.emissiveMap) {
    code += "uniform sampler2D texture_emissiveMap;\n";
  } else {
    code += "uniform vec3 material_emissive;\n";
  }
  if (options.diffuseMap) {
    code += "uniform sampler2D texture_diffuseMap;\n";
  }
  if (options.lightMap) {
    code += "uniform sampler2D texture_lightMap;\n";
  }
  if (options.bumpMap) {
    code += "uniform sampler2D texture_bumpMap;\n";
  } else {
    if (options.normalMap) {
      code += "uniform sampler2D texture_normalMap;\n";
    } else {
      if (options.parallaxMap) {
        code += "uniform sampler2D texture_parallaxMap;\n";
      }
    }
  }
  if (options.cubeMap || options.sphereMap) {
    code += "uniform float material_reflectionFactor;\n";
    if (options.sphereMap) {
      code += "uniform sampler2D texture_sphereMap;\n";
    } else {
      code += "uniform mat4 matrix_view;\n";
      code += "uniform samplerCube texture_cubeMap;\n";
    }
  }
  if (options.opacityMap) {
    code += "uniform sampler2D texture_opacityMap;\n";
  } else {
    code += "uniform float material_opacity;\n";
  }
  if (options.shadowMap) {
    code += "uniform sampler2D texture_shadowMap;\n";
  }
  code += "uniform vec3 light_globalAmbient;\n";
  for (var i = 0; i < options.numDirectionals + options.numPoints; i++) {
    code += "uniform vec3 light" + i + "_color;\n";
  }
  if (options.fog) {
    code += "uniform vec4 fog_color;\n";
    code += "uniform float fog_density;\n";
  }
  if (options.alphatest) {
    code += "uniform float alpha_ref;\n";
  }
  if (options.shadowMap) {
    code += "\n";
    code += "float unpack_depth(const in vec4 rgba_depth)\n";
    code += "{\n";
    code += "    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);\n";
    code += "    float depth = dot(rgba_depth, bit_shift);\n";
    code += "    return depth;\n";
    code += "}\n";
  }
  code += "\n";
  code += "void main(void)\n";
  code += "{\n";
  if (lighting) {
    code += "    vec3 viewDir = normalize(vViewDir);\n";
  }
  if (options.diffuseMap) {
    code += "    vec2 uvDiffuseMap = vUvDiffuseMap;\n";
  }
  if (options.specularMap) {
    code += "    vec2 uvSpecularMap = vUvSpecularMap;\n";
  }
  if (options.bumpMap) {
    code += "    float hghtMapPixel = texture2D(texture_bumpMap, vUvBumpMap).r;\n";
  } else {
    if (options.normalMap) {
      code += "    vec3 normMapPixel = texture2D(texture_normalMap, vUvBumpMap).rgb;\n";
    } else {
      if (options.parallaxMap) {
        code += "    float height = texture2D(texture_parallaxMap, vUvBumpMap).a;\n";
        code += "    float offset = height * 0.025 - 0.02;\n";
        code += "    vec3 normMapPixel = texture2D(texture_parallaxMap, vUvBumpMap + offset * viewDir.xy).rgb;\n";
        if (options.diffuseMap) {
          code += "    uvDiffuseMap += offset * viewDir.xy;\n";
        }
        if (options.specularMap) {
          code += "    uvSpecularMap += offset * viewDir.xy;\n";
        }
      }
    }
  }
  if (options.diffuseMap) {
    code += "    vec4 diffMapPixel = texture2D(texture_diffuseMap, uvDiffuseMap);\n";
  }
  if (options.specularMap && lighting) {
    code += "    vec4 specMapPixel = texture2D(texture_specularMap, uvSpecularMap);\n";
  }
  if (options.lightMap) {
    code += "    vec4 lghtMapPixel = texture2D(texture_lightMap, vUvLightMap);\n";
  }
  if (options.opacityMap) {
    code += "    gl_FragColor.a = texture2D(texture_opacityMap, vUvOpacityMap).r;\n";
  } else {
    if (options.diffuseMap) {
      code += "    gl_FragColor.a = material_opacity * diffMapPixel.a;\n";
    } else {
      code += "    gl_FragColor.a = material_opacity;\n";
    }
  }
  if (options.alphatest) {
    code += "    if (gl_FragColor.a <= alpha_ref)\n";
    code += "    {\n";
    code += "        discard;\n";
    code += "    }\n";
  }
  if (lighting) {
    code += "    vec3 lightDir, halfVec;\n";
    code += "    vec3 ambient, diffuse, specular;\n";
    code += "    vec3 diffuseContrib = vec3(0.0);\n";
    code += "    float specularContrib = 0.0;\n";
    code += "    float nDotL, nDotH;\n";
    if (options.cubeMap || options.sphereMap) {
      code += "    float lambertContrib = 0.0;\n";
    }
    if (options.normalMap || options.parallaxMap) {
      code += "    vec3 N = normalize(normMapPixel * 2.0 - 1.0);\n";
    } else {
      if (options.bumpMap) {
        code += "    vec2 offset = vec2(1.0/64.0, 1.0/64.0);\n";
        code += "    float xPlusOne  = texture2D(texture_bumpMap, vUvBumpMap + vec2( offset.x, 0)).r;\n";
        code += "    float xMinusOne = texture2D(texture_bumpMap, vUvBumpMap + vec2(-offset.x, 0)).r;\n";
        code += "    float yPlusOne  = texture2D(texture_bumpMap, vUvBumpMap + vec2(0,  offset.y)).r;\n";
        code += "    float yMinusOne = texture2D(texture_bumpMap, vUvBumpMap + vec2(0, -offset.y)).r;\n";
        code += "    vec3 tangent  = vec3(1, 0, xPlusOne - xMinusOne);\n";
        code += "    vec3 binormal = vec3(0, 1, yPlusOne - yMinusOne);\n";
        code += "    vec3 N = normalize(cross(tangent, binormal));\n";
      } else {
        code += "    vec3 N = vNormalE;\n";
      }
    }
    for (var i = 0; i < options.numDirectionals + options.numPoints; i++) {
      code += "    lightDir = normalize(vLight" + i + "Dir);\n";
      code += "    halfVec = normalize(lightDir + viewDir);\n";
      code += "    nDotL = max(0.0, dot(N, lightDir));\n";
      code += "    if (nDotL > 0.0)\n";
      code += "    {\n";
      code += "        diffuseContrib  += light" + i + "_color * nDotL;\n";
      if (options.cubeMap || options.sphereMap) {
        code += "        lambertContrib  += nDotL;\n";
      } else {
        code += "        nDotH = max(0.0, dot(N, halfVec));\n";
        if (options.specularMap) {
          code += "        specularContrib += pow(nDotH, specMapPixel.a * 100.0);\n";
        } else {
          code += "        specularContrib += pow(nDotH, material_shininess);\n";
        }
      }
      code += "    }\n";
    }
    if (options.diffuseMap) {
      code += "    ambient = diffMapPixel.rgb;\n";
      code += "    diffuse = diffMapPixel.rgb;\n";
    } else {
      code += "    ambient = material_ambient;\n";
      code += "    diffuse = material_diffuse;\n";
    }
    if (options.cubeMap) {
      if (options.normalMap) {
        code += "    vec3 normalW = (vec4(N, 0.0) * matrix_view).xyz;\n";
      } else {
        code += "    vec3 normalW = normalize(vNormalW);\n";
      }
      code += "    vec3 reflectW = -reflect(normalize(vVertToEyeW), normalW);\n";
      code += "    specular = textureCube(texture_cubeMap, reflectW).rgb * material_reflectionFactor;\n";
      code += "    specularContrib = 1.0;\n";
    } else {
      if (options.sphereMap) {
        code += "    vec3 R = normalize(-reflect(lightDir, N));\n";
        code += "    float m = 2.0 * sqrt( R.x*R.x + R.y*R.y + (R.z+1.0)*(R.z+1.0) );\n";
        code += "    vec2 sphereMapUv = vec2(R.x/m + 0.5, R.y/m + 0.5);\n";
        code += "    specular = texture2D(texture_sphereMap, sphereMapUv).rgb * lambertContrib * material_reflectionFactor;\n";
        code += "    specularContrib = 1.0;\n";
      } else {
        if (options.specularMap) {
          code += "    specular = specMapPixel.rgb;\n";
        } else {
          code += "    specular = material_specular;\n";
        }
      }
    }
    if (options.shadowMap) {
      code += "    vec3 shadow_coord = vShadowCoord.xyz / vShadowCoord.w;\n";
      code += "    vec4 rgba_depth   = texture2D(texture_shadowMap, shadow_coord.xy);\n";
      code += "    float depth       = unpack_depth(rgba_depth);\n";
      code += "    float visibility  = ((depth - shadow_coord.z) > -0.01) ? (1.0) : (0.3);\n";
      code += "    diffuse           = diffuse * visibility;\n";
      code += "    specular          = specular * visibility;\n";
    }
    code += "    gl_FragColor.rgb  = ambient * light_globalAmbient;\n";
    if (options.lightMap) {
      code += "    diffuseContrib += lghtMapPixel.rgb;\n";
    }
    code += "    gl_FragColor.rgb += diffuse * diffuseContrib;\n";
    code += "    gl_FragColor.rgb += specular * specularContrib;\n";
  } else {
    if (options.lightMap) {
      if (options.diffuseMap) {
        code += "    gl_FragColor.rgb += diffMapPixel.rgb * lghtMapPixel.rgb;\n";
      } else {
        code += "    gl_FragColor.rgb += lghtMapPixel.rgb;\n";
      }
    }
  }
  if (options.emissiveMap) {
    code += "    gl_FragColor.rgb += texture2D(texture_emissiveMap, vUvEmissiveMap).rgb;\n";
  } else {
    code += "    gl_FragColor.rgb += material_emissive;\n";
  }
  code += "    gl_FragColor = clamp(gl_FragColor, 0.0, 1.0);\n";
  if (options.fog) {
    code += "    const float LOG2 = 1.442695;\n";
    code += "    float z = gl_FragCoord.z / gl_FragCoord.w;\n";
    code += "    float fogFactor = exp2(-fog_density * fog_density * z * z * LOG2);\n";
    code += "    fogFactor = clamp(fogFactor, 0.0, 1.0);\n";
    code += "    gl_FragColor = mix(fog_color, gl_FragColor, fogFactor );\n";
  }
  code += "}";
  return code;
};
ape.gfx.programlib.pick = {};
ape.gfx.programlib.pick.generateKey = function(options) {
  var key = "pick";
  if (options.skinning) {
    key += "_skin";
  }
  return key;
};
ape.gfx.programlib.pick.generateVertexShader = function(options) {
  var code = "";
  code += "attribute vec3 vertex_position;\n";
  if (options.skinning) {
    code += "attribute vec4 vertex_boneWeights;\n";
    code += "attribute vec4 vertex_boneIndices;\n";
  }
  code += "\n";
  code += "uniform mat4 matrix_projection;\n";
  code += "uniform mat4 matrix_view;\n";
  code += "uniform mat4 matrix_model;\n";
  if (options.skinning) {
    var numBones = ape.GraphicsDevice.getCurrent().getBoneLimit();
    code += "uniform mat4 matrix_pose[" + numBones + "];\n";
  }
  code += "\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    vec4 positionW = matrix_model * vec4(vertex_position, 1.0);\n";
  code += "\n";
  if (options.skinning) {
    code += "    vec4 skinned_position;\n";
    code += "    skinned_position  = vertex_boneWeights[0] * matrix_pose[int(vertex_boneIndices[0])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[1] * matrix_pose[int(vertex_boneIndices[1])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[2] * matrix_pose[int(vertex_boneIndices[2])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[3] * matrix_pose[int(vertex_boneIndices[3])] * positionW;\n";
    code += "    positionW = skinned_position;\n\n";
  }
  code += "    gl_Position = matrix_projection * matrix_view * positionW;\n";
  code += "}";
  return code;
};
ape.gfx.programlib.pick.generateFragmentShader = function(options) {
  var code = "";
  code += "#ifdef GL_ES\n";
  code += "precision highp float;\n";
  code += "#endif\n\n";
  code += "uniform vec4 pick_color;\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    gl_FragColor = pick_color;\n";
  code += "}";
  return code;
};
ape.gfx.programlib.shadowmap = {};
ape.gfx.programlib.shadowmap.generateKey = function(options) {
  var key = "shadowmap";
  if (options.skinning) {
    key += "_skin";
  }
  return key;
};
ape.gfx.programlib.shadowmap.generateVertexShader = function(options) {
  var code = "";
  code += "attribute vec3 vertex_position;\n";
  if (options.skinning) {
    code += "attribute vec4 vertex_boneWeights;\n";
    code += "attribute vec4 vertex_boneIndices;\n";
  }
  code += "\n";
  code += "uniform mat4 matrix_viewProjection;\n";
  code += "uniform mat4 matrix_model;\n";
  if (options.skinning) {
    var numBones = ape.GraphicsDevice.getCurrent().getBoneLimit();
    code += "uniform mat4 matrix_pose[" + numBones + "];\n";
  }
  code += "\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    vec4 positionW = matrix_model * vec4(vertex_position, 1.0);\n";
  code += "\n";
  if (options.skinning) {
    code += "    vec4 skinned_position;\n";
    code += "    skinned_position  = vertex_boneWeights[0] * matrix_pose[int(vertex_boneIndices[0])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[1] * matrix_pose[int(vertex_boneIndices[1])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[2] * matrix_pose[int(vertex_boneIndices[2])] * positionW;\n";
    code += "    skinned_position += vertex_boneWeights[3] * matrix_pose[int(vertex_boneIndices[3])] * positionW;\n";
    code += "    positionW = skinned_position;\n\n";
  }
  code += "    gl_Position = matrix_viewProjection * positionW;\n";
  code += "}";
  return code;
};
ape.gfx.programlib.shadowmap.generateFragmentShader = function(options) {
  var code = "";
  code += "#ifdef GL_ES\n";
  code += "precision highp float;\n";
  code += "#endif\n\n";
  code += "vec4 pack_depth(const in float depth)\n";
  code += "{\n";
  code += "    const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);\n";
  code += "    const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);\n";
  code += "    vec4 res = fract(depth * bit_shift);\n";
  code += "    res -= res.xxyz * bit_mask;\n";
  code += "    return res;\n";
  code += "}\n\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    gl_FragData[0] = pack_depth(gl_FragCoord.z);\n";
  code += "}";
  return code;
};
ape.gfx.ClearFlag = {COLOR:1, DEPTH:2, STENCIL:4};
ape.gfx.PrimType = {POINTS:0, LINES:1, LINE_STRIP:2, TRIANGLES:3, TRIANGLE_STRIP:4};
ape.gfx.BlendMode = {ZERO:0, ONE:1, SRC_COLOR:2, ONE_MINUS_SRC_COLOR:3, DST_COLOR:4, ONE_MINUS_DST_COLOR:5, SRC_ALPHA:6, SRC_ALPHA_SATURATE:7, ONE_MINUS_SRC_ALPHA:8, DST_ALPHA:9, ONE_MINUS_DST_ALPHA:10};
ape.gfx.DepthFunc = {LEQUAL:0};
ape.gfx.FrontFace = {CW:0, CCW:1};
Object.assign(ape.gfx, function() {
  var _defaultClearOptions = {color:[0, 0, 0, 1], depth:1, flags:ape.gfx.ClearFlag.COLOR | ape.gfx.ClearFlag.DEPTH};
  var _createContext = function(canvas, options) {
    var i;
    var preferWebGl2 = options && options.preferWebGl2 !== undefined ? options.preferWebGl2 : true;
    var names = preferWebGl2 ? ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl"] : ["webgl", "experimental-webgl"];
    var gl = null;
    options = options || {};
    options.stencil = true;
    for (i = 0; i < names.length; i++) {
      try {
        gl = canvas.getContext(names[i], options);
      } catch (e) {
      }
      if (gl) {
        this.webgl2 = preferWebGl2 && i < 2;
        break;
      }
    }
    if (!gl) {
      throw new Error("WebGL not supported");
    }
    return gl;
  };
  var _contextLostHandler = function() {
    logWARNING("Context lost.");
  };
  var _contextRestoredHandler = function() {
    logINFO("Context restored.");
  };
  var GraphicsDevice = function(canvas, options) {
    canvas.addEventListener("webglcontextlost", _contextLostHandler, false);
    canvas.addEventListener("webglcontextrestored", _contextRestoredHandler, false);
    this.gl = _createContext(canvas, options);
    this.canvas = canvas;
    this.program = null;
    this.indexBuffer = null;
    this.vertexBuffer = [];
    var gl = this.gl;
    logINFO("Device started");
    logINFO("WebGL version:             " + gl.getParameter(gl.VERSION));
    logINFO("WebGL shader version:      " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    logINFO("WebGL vendor:              " + gl.getParameter(gl.VENDOR));
    logINFO("WebGL renderer:            " + gl.getParameter(gl.RENDERER));
    try {
      logINFO("WebGL extensions:          " + gl.getSupportedExtensions());
    } catch (e) {
      logINFO("WebGL extensions:          Extensions unavailable");
    }
    logINFO("WebGL num texture units:   " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
    logINFO("WebGL max texture size:    " + gl.getParameter(gl.MAX_TEXTURE_SIZE));
    logINFO("WebGL max cubemap size:    " + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
    logINFO("WebGL max vertex attribs:  " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
    logINFO("WebGL max vshader vectors: " + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
    logINFO("WebGL max fshader vectors: " + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
    logINFO("WebGL max varying vectors: " + gl.getParameter(gl.MAX_VARYING_VECTORS));
    this.lookup = {prim:[gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.TRIANGLES, gl.TRIANGLE_STRIP], blendMode:[gl.ZERO, gl.ONE, gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR, gl.DST_COLOR, gl.ONE_MINUS_DST_COLOR, gl.SRC_ALPHA, gl.SRC_ALPHA_SATURATE, gl.ONE_MINUS_SRC_ALPHA, gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA], clear:[0, gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, gl.STENCIL_BUFFER_BIT, gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT, gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, 
    gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT], elementType:[gl.BYTE, gl.UNSIGNED_BYTE, gl.SHORT, gl.UNSIGNED_SHORT, gl.INT, gl.UNSIGNED_INT, gl.FLOAT], frontFace:[gl.CW, gl.CCW]};
    this.extTextureFloat = null;
    this.extStandardDerivatives = gl.getExtension("OES_standard_derivatives");
    var backBuffer = ape.gfx.FrameBuffer.getBackBuffer();
    var viewport = {x:0, y:0, width:canvas.width, height:canvas.height};
    this.renderTarget = new ape.gfx.RenderTarget(backBuffer, viewport);
    this.scope = new ape.gfx.ScopeSpace("Device");
    var self = this;
    this.commitFunction = {};
    this.commitFunction[ape.gfx.ShaderInputType.BOOL] = function(locationId, value) {
      self.gl.uniform1i(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.INT] = function(locationId, value) {
      self.gl.uniform1i(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.FLOAT] = function(locationId, value) {
      if (typeof value == "number") {
        self.gl.uniform1f(locationId, value);
      } else {
        self.gl.uniform1fv(locationId, value);
      }
    };
    this.commitFunction[ape.gfx.ShaderInputType.VEC2] = function(locationId, value) {
      self.gl.uniform2fv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.VEC3] = function(locationId, value) {
      self.gl.uniform3fv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.VEC4] = function(locationId, value) {
      self.gl.uniform4fv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.IVEC2] = function(locationId, value) {
      self.gl.uniform2iv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.BVEC2] = function(locationId, value) {
      self.gl.uniform2iv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.IVEC3] = function(locationId, value) {
      self.gl.uniform3iv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.BVEC3] = function(locationId, value) {
      self.gl.uniform3iv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.IVEC4] = function(locationId, value) {
      self.gl.uniform4iv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.BVEC4] = function(locationId, value) {
      self.gl.uniform4iv(locationId, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.MAT2] = function(locationId, value) {
      self.gl.uniformMatrix2fv(locationId, self.gl.FALSE, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.MAT3] = function(locationId, value) {
      self.gl.uniformMatrix3fv(locationId, self.gl.FALSE, value);
    };
    this.commitFunction[ape.gfx.ShaderInputType.MAT4] = function(locationId, value) {
      self.gl.uniformMatrix4fv(locationId, self.gl.FALSE, value);
    };
    var gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.depthFunc(gl.LEQUAL);
    gl.depthRange(0.0, 1.0);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.SCISSOR_TEST);
    this.scope.resolve("fog_color").setValue([0.0, 0.0, 0.0, 1.0]);
    this.scope.resolve("fog_density").setValue(0.0);
    this.scope.resolve("alpha_ref").setValue(0.0);
    var _getStartupState = function() {
      return {alphaTest:false, alphaRef:0.0, blend:true, blendModes:{}, colorWrite:{}, cull:true, depthTest:true, depthWrite:true, depthFunc:ape.gfx.DepthFunc.LEQUAL, fog:false, fogColor:[0, 0, 0], fogDensity:0, frontFace:ape.gfx.FrontFace.CCW};
    };
    this._globalState = _getStartupState();
    this._currentState = _getStartupState();
    this._localState = {};
    this._stateFuncs = {};
    this._stateFuncs["blend"] = function(value) {
      if (self._currentState.blend !== value) {
        if (value) {
          self.gl.enable(gl.BLEND);
        } else {
          self.gl.disable(gl.BLEND);
        }
        self._currentState.blend = value;
      }
    };
    this._stateFuncs["blendModes"] = function(value) {
      if (self._currentState.blendModes.srcBlend !== value.srcBlend || self._currentState.blendModes.dstBlend !== value.dstBlend) {
        self.gl.blendFunc(self.lookup.blendMode[value.srcBlend], self.lookup.blendMode[value.dstBlend]);
        self._currentState.blendModes.srcBlend = value.srcBlend;
        self._currentState.blendModes.dstBlend = value.dstBlend;
      }
    };
    this._stateFuncs["colorWrite"] = function(value) {
      self.gl.colorMask(value.red, value.green, value.blue, value.alpha);
      self._currentState.culling = value;
    };
    this._stateFuncs["cull"] = function(value) {
      if (self._currentState.cull !== value) {
        if (value) {
          self.gl.enable(gl.CULL_FACE);
        } else {
          self.gl.disable(gl.CULL_FACE);
        }
        self._currentState.cull = value;
      }
    };
    this._stateFuncs["depthTest"] = function(value) {
      if (self._currentState.depthTest !== value) {
        if (value) {
          self.gl.enable(gl.DEPTH_TEST);
        } else {
          self.gl.disable(gl.DEPTH_TEST);
        }
        self._currentState.depthTest = value;
      }
    };
    this._stateFuncs["depthWrite"] = function(value) {
      if (self._currentState.depthWrite !== value) {
        self.gl.depthMask(value);
        self._currentState.depthWrite = value;
      }
    };
    this._stateFuncs["fog"] = function(value) {
      self._currentState.fog = value;
    };
    this._stateFuncs["fogColor"] = function(value) {
      self.scope.resolve("fog_color").setValue(value);
      self._currentState.fogColor = value;
    };
    this._stateFuncs["fogDensity"] = function(value) {
      if (self._currentState.fogDensity !== value) {
        self.scope.resolve("fog_density").setValue(value);
        self._currentState.fogDensity = value;
      }
    };
    this._stateFuncs["frontFace"] = function(value) {
      if (self._currentState.frontFace !== value) {
        self.gl.frontFace(self.lookup.frontFace[value]);
        self._currentState.frontFace = value;
      }
    };
    this.programLib = null;
    var numUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    numUniforms -= 4 * 4;
    numUniforms -= 8;
    numUniforms -= 1;
    numUniforms -= 4 * 4;
    this.boneLimit = Math.floor(numUniforms / 4);
    ape.extend(this, ape.events);
    this.boundBuffer = null;
    this._current = null;
  };
  GraphicsDevice.prototype.setCurrent = function() {
    Device = this;
  };
  GraphicsDevice.prototype.getCurrent = function() {
    return Device;
  };
  GraphicsDevice.prototype.getProgramLibrary = function() {
    return this.programLib;
  };
  GraphicsDevice.prototype.setProgramLibrary = function(programLib) {
    this.programLib = programLib;
  };
  GraphicsDevice.prototype.updateBegin = function() {
    logASSERT(this.canvas != null, "Device has not been started");
    this.renderTarget.bind();
  };
  GraphicsDevice.prototype.updateEnd = function() {
  };
  GraphicsDevice.prototype.draw = function() {
    if (options.numVertices > 0) {
      this.commitAttributes(options.startVertex || 0);
      this.commitUniforms();
      var gl = this.gl;
      if (options.useIndexBuffer) {
        var glFormat = this.indexBuffer.getFormat() === ape.gfx.IndexFormat.UINT8 ? gl.UNSIGNED_BYTE : gl.UNSIGNED_SHORT;
        gl.drawElements(this.lookup.prim[options.primitiveType], options.numVertices, glFormat, 0);
      } else {
        gl.drawArrays(this.lookup.prim[options.primitiveType], 0, options.numVertices);
      }
    }
  };
  GraphicsDevice.prototype.clear = function(options) {
    logASSERT(this.canvas != null, "Device has not been started");
    options = options || _defaultClearOptions;
    options.color = options.color || _defaultClearOptions.color;
    options.depth = options.depth || _defaultClearOptions.depth;
    options.flags = options.flags || _defaultClearOptions.flags;
    var gl = this.gl;
    if (options.flags & ape.gfx.ClearFlag.COLOR) {
      gl.clearColor(options.color[0], options.color[1], options.color[2], options.color[3]);
    }
    if (options.flags & ape.gfx.ClearFlag.DEPTH) {
      gl.clearDepth(options.depth);
    }
    gl.clear(this.lookup.clear[options.flags]);
  };
  GraphicsDevice.prototype.getGlobalState = function(state) {
    return this._globalState;
  };
  GraphicsDevice.prototype.updateGlobalState = function(delta) {
    for (var key in delta) {
      if (this._localState[key] === undefined) {
        this._stateFuncs[key](delta[key]);
      }
      this._globalState[key] = delta[key];
    }
  };
  GraphicsDevice.prototype.getLocalState = function(state) {
    return this._localState;
  };
  GraphicsDevice.prototype.updateLocalState = function(localState) {
    for (var key in localState) {
      this._stateFuncs[key](localState[key]);
      this._localState[key] = localState[key];
    }
  };
  GraphicsDevice.prototype.clearLocalState = function() {
    for (var key in this._localState) {
      this._stateFuncs[key](this._globalState[key]);
    }
    this._localState = {};
  };
  GraphicsDevice.prototype.getCurrentState = function() {
    return this._currentState;
  };
  GraphicsDevice.prototype.setRenderTarget = function() {
    this.renderTarget = renderTarget;
  };
  GraphicsDevice.prototype.getRenderTarget = function() {
    return this.renderTarget;
  };
  GraphicsDevice.prototype.setIndexBuffer = function() {
    this.indexBuffer = indexBuffer;
    var gl = this.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer ? indexBuffer.bufferId : null);
  };
  GraphicsDevice.prototype.setVertexBuffer = function() {
    this.vertexBuffers[stream] = vertexBuffer;
    var vertexFormat = vertexBuffer.getFormat();
    var i = 0;
    var elements = vertexFormat.elements;
    var numElements = vertexFormat.numElements;
    while (i < numElements) {
      var vertexElement = elements[i++];
      vertexElement.stream = stream;
      vertexElement.scopeId.setValue(vertexElement);
    }
  };
  GraphicsDevice.prototype.setProgram = function(program) {
    if (program !== this.program) {
      this.program = program;
      var gl = this.gl;
      gl.useProgram(program.program.Id);
    }
  };
  GraphicsDevice.prototype.commitAttributes = function(startVertex) {
    var i, len, attribute, element, vertexBuffer;
    var attributes = this.program.attributes;
    var gl = this.gl;
    for (i = 0, len = attributes.length; i < len; i++) {
      attribute = attributes[i];
      element = attribute.scopeId.value;
      if (element !== null) {
        vertexBuffer = this.vertexBuffers[element.stream];
        if (this.boundBuffer !== vertexBuffer.bufferId) {
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.bufferId);
          this.boundBuffer = vertexBuffer.bufferId;
        }
        gl.enableVertexAttribArray(attribute.locationId);
        gl.vertexAttribPointer(attribute.locationId, element.numComponents, this.lookup.elementType[element.dataType], gl.FALSE, element.stride, startVertex * element.stride + element.offset);
      }
    }
  };
  GraphicsDevice.prototype.commitUniforms = function() {
    var textureUnit = 0;
    var i, len, uniform;
    var uniforms = this.program.uniforms;
    var gl = this.gl;
    for (i = 0, len = uniforms.length; i < len; i++) {
      uniform = uniforms[i];
      if (uniform.scopeId.value != null) {
        if (uniform.dataType === ape.ShaderInputType.TEXTURE2D || uniform.dataType === ape.ShaderInputType.TEXTURECUBE) {
          var texture = uniform.scopeId.value;
          gl.activeTexture(gl.TEXTURE0 + textureUnit);
          texture.bind();
          gl.uniform1i(uniform.locationId, textureUnit);
          textureUnit++;
        } else {
          if (uniform.version.notequals(uniform.scopeId.versionObject.version)) {
            uniform.version.copy(uniform.scopeId.versionObject.version);
            var value = uniform.scopeId.value;
            this.commitFunction[uniform.dataType](uniform.locationId, value);
          }
        }
      }
    }
  };
  GraphicsDevice.prototype.getBoneLimit = function() {
    return this.boneLimit;
  };
  GraphicsDevice.prototype.setBoneLimit = function(maxBones) {
    this.boneLiit = maxBones;
  };
  GraphicsDevice.prototype.enableValidation = function(enable) {
    if (enable === true) {
      if (this.gl instanceof WebGLRenderingContext) {
        this.gl = new WebGLValidator(this.gl);
      }
    } else {
      if (this.gl instanceof WebGLValidator) {
        this.gl = Context.gl;
      }
    }
  };
  GraphicsDevice.prototype.validate = function() {
    var gl = this.gl;
    var error = gl.getError();
    if (error !== gl.NO_ERROR) {
      Log.error("WebGL error: " + WebGLValidator.ErrorString[error]);
      return false;
    }
    return true;
  };
  return {GraphicsDevice:GraphicsDevice};
}());
Object.assign(ape.gfx, function() {
  var FrameBuffer = function(width, height, depth, isCube) {
    if (width !== undefined && height !== undefined) {
      this._width = width || 1;
      this._height = height || 1;
      this._colorBuffers = [];
      if (depth) {
        this._depthBuffers = [];
      }
      this._activeBuffer = 0;
      var device = Device;
      var gl = device.gl;
      if (isCube) {
        this._texture = new ape.gfx.TextureCube(width, height, ape.gfx.TextureFormat.RGBA);
      } else {
        this._texture = new ape.gfx.Texture2D(width, height, ape.gfx.TextureFormat.RGBA);
      }
      var numBuffers = isCube ? 6 : 1;
      for (var i = 0; i < numBuffers; i++) {
        this._colorBuffers[i] = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._colorBuffers[i]);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, isCube ? gl.TEXTURE_CUBE_MAP_POSITIVE_X + i : gl.TEXTURE_2D, this._texture._textureId, 0);
        if (depth) {
          this._depthBuffers[i] = gl.createRenderbuffer();
          gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffers[i]);
          gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthBuffers[i]);
        }
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        switch(status) {
          case gl.FRAMEBUFFER_COMPLETE:
            logINFO("FrameBuffer status OK");
            break;
          case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            logERROR("FrameBuffer error: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            break;
          case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            logERROR("FrameBuffer error: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            break;
          case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            logERROR("FrameBuffer error: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            break;
          case gl.FRAMEBUFFER_UNSUPPORTED:
            logERROR("FrameBuffer error: FRAMEBUFFER_UNSUPPORTED");
            break;
        }
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  };
  FrameBuffer.getBackBuffer = function() {
    return new ape.gfx.FrameBuffer;
  };
  FrameBuffer.prototype.bind = function() {
    var gl = Device.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._colorBuffers ? this._colorBuffers[this._activeBuffer] : null);
  };
  FrameBuffer.prototype.setActiveBuffer = function(index) {
    this._activeBuffer = index;
  };
  FrameBuffer.prototype.getWidth = function() {
    var gl = Device.gl;
    return this._colorBuffers ? this._width : gl.canvas.width;
  };
  FrameBuffer.prototype.getHeight = function() {
    var gl = Device.gl;
    return this._colorBuffers ? this._height : gl.canvas.height;
  };
  FrameBuffer.prototype.getTexture = function() {
    return this._colorBuffers ? this._texture : null;
  };
  return {FrameBuffer:FrameBuffer};
}());
ape.gfx.IndexFormat = {UINT8:0, UINT16:1};
Object.assign(ape.gfx, function() {
  var IndexBuffer = function(format, numIndices) {
    this.format = format;
    this.numIndices = numIndices;
    var bytesPerIndex = format === ape.gfx.IndexFormat.UINT8 ? 1 : 2;
    this.numBytes = this.numIndices * bytesPerIndex;
    var gl = Device.gl;
    this.bufferId = gl.createBuffer();
    this.storage = new ArrayBuffer(this.numBytes);
    this.typedStorage = format === ape.gfx.IndexFormat.UINT8 ? new Uint8Array(this.storage) : new Uint16Array(this.storage);
  };
  Object.assign(IndexBuffer.prototype, {getFormat:function() {
    return this.format;
  }, getNumIndices:function() {
    return this.numIndices;
  }, lock:function() {
    return this.storage;
  }, unlock:function() {
    var gl = Device.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.typedStorage, gl.STATIC_DRAW);
  }});
  return {IndexBuffer:IndexBuffer};
}());
Object.assign(ape.gfx, function() {
  var ProgramLibrary = function() {
    this._cache = [];
    this._generators = [];
  };
  ProgramLibrary.prototype.register = function(name, vsFunc, fsFunc, keyFunc) {
    this._generators[name] = {generateVert:vsFunc, generateFrag:fsFunc, generateKey:keyFunc};
  };
  ProgramLibrary.prototype.unregister = function(name) {
    this._generators[name] = undefined;
  };
  ProgramLibrary.prototype.isRegistered = function(name) {
    var generator = this._generators[name];
    return generator !== undefined;
  };
  ProgramLibrary.prototype.getProgram = function(name, options) {
    var generator = this._generators[name];
    if (generator === undefined) {
      console.log("No program library functions registered for : " + name);
      return null;
    }
    var key = generator.generateKey(options);
    var program = this._cache[key];
    if (program === undefined) {
      var vsCode = generator.generateVert(options);
      var fsCode = generator.generateFrag(options);
      var vs = new ape.gfx.Shader(ape.gfx.ShaderType.VERTEX, vsCode);
      var fs = new ape.gfx.Shader(ape.gfx.ShaderType.FRAGMENT, fsCode);
      program = this._cache[key] = new ape.gfx.Program(vs, fs);
    }
    return program;
  };
  return {ProgramLibrary:ProgramLibrary};
}());
Object.assign(ape.gfx, function() {
  var Program = function(vertexShader, fragmentShader) {
    this.attributes = [];
    this.uniforms = [];
    var gl = Device.gl;
    this.programId = gl.createProgram();
    gl.attachShader(this.programId, vertexShader.shaderId);
    gl.attachShader(this.programId, fragmentShader.shaderId);
    gl.linkProgram(this.programId);
    var ok = gl.getProgramParameter(this.programId, gl.LINK_STATUS);
    if (!ok) {
      var error = gl.getProgramInfoLog(this.programId);
      logERROR("Failed to link shader program. Error: " + error);
    }
  };
  return {Program:Program};
}());
Object.assign(ape.gfx, function() {
  var RenderTarget = function(framebuffer, viewport) {
    this._framebuffer = framebuffer || ape.gfx.FrameBuffer.getBackBuffer();
    this._viewport = viewport || {x:0, y:0, width:this._framebuffer.getWidth(), height:this._framebuffer.getHeight()};
  };
  RenderTarget.prototype.setViewport = function(viewport) {
    this._viewport = viewport;
  };
  RenderTarget.prototype.getViewport = function() {
    return this._viewport;
  };
  RenderTarget.prototype.setFrameBuffer = function(framebuffer) {
    this._framebuffer = framebuffer;
  };
  RenderTarget.prototype.getFrameBuffer = function() {
    return this._framebuffer;
  };
  RenderTarget.prototype.bind = function() {
    var gl = ape.gfx.GraphicsDevice.getCurrent().gl;
    gl.viewport(this._viewport.x, this._viewport.y, this._viewport.width, this._viewport.height);
    gl.scissor(this._viewport.x, this._viewport.y, this._viewport.width, this._viewport.height);
    this._framebuffer.bind();
  };
  return {RenderTarget:RenderTarget};
}());
Object.assign(ape.gfx, function() {
  var ScopeId = function(name) {
    this.name = name;
    this.value = null;
    this.versionObject = new ape.gfx.VersionObject;
  };
  Object.assign(ScopeId.prototype, {setValue:function(value) {
    this.value = value;
    this.versionObject.increment();
  }, getValue:function(value) {
    return this.value;
  }});
  return {ScopeId:ScopeId};
}());
Object.assign(ape.gfx, function() {
  var ScopeSpace = function(name) {
    this.name = name;
    this.variables = {};
    this.namespaces = {};
  };
  Object.assign(ScopeSpace.prototype, {resolve:function(name) {
    if (this.variables.hasOwnProperty(name) == false) {
      this.variables[name] = new ape.gfx.ScopeId(name);
    }
    return this.variables[name];
  }, getSubSpace:function(name) {
    if (this.namespaces.hasOwnProperty(name) == false) {
      this.namespaces[name] = new ape.gfx.ScopeSpace(name);
    }
    return this.namespaces[name];
  }});
  return {ScopeSpace:ScopeSpace};
}());
ape.gfx.ShaderInputType = {BOOL:0, INT:1, FLOAT:2, VEC2:3, VEC3:4, VEC4:5, IVEC2:6, IVEC3:7, IVEC4:8, BVEC2:9, BVEC3:10, BVEC4:11, MAT2:12, MAT3:13, MAT4:14, TEXTURE2D:15, TEXTURECUBE:16};
ape.gfx.ShaderInput = function(name, type, locationId) {
  this.locationId = locationId;
  var device = Device;
  this.scopeId = device.scope.resolve(name);
  this.version = new ape.gfx.Version;
  this.dateType = type;
};
ape.gfx.ShaderType = {VERTEX:0, FRAGMENT:1};
Object.assign(ape.gfx, function() {
  var Shader = function(type, src) {
    this.type = type;
    this.src = src;
    var gl = Device.gl;
    var glType = this.type === ape.gfx.ShaderType.VERTEX ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    this.shaderId = gl.createShader(glType);
    gl.shaderSource(this.shaderId, this.src);
    gl.compileShader(this.shaderId);
    var ok = gl.getShaderParameter(this.shaderId, gl.COMPILE_STATUS);
    if (!ok) {
      var error = gl.getShaderInfoLog(this.shaderId);
      var typeName = this.type === pc.gfx.ShaderType.VERTEX ? "vertex" : "fragment";
      logERROR("Failed to compile " + typeName + " shader:\n" + src + "\n" + error);
    }
  };
  Shader.prototype.getType = function() {
    return this.type;
  };
  Shader.prototype.getSource = function() {
    return this.src;
  };
  return {Shader:Shader};
}());
ape.gfx.TextureLock = {READ:1, WRITE:2};
ape.gfx.TextureFormat = {RGB:0, RGBA:1, LUMINANCE:2};
ape.gfx.TextureAddress = {REPEAT:0, CLAMP_TO_EDGE:1, MIRRORED_REPEAT:2};
ape.gfx.TextureFilter = {NEAREST:0, LINEAR:1, NEAREST_MIPMAP_NEAREST:2, NEAREST_MIPMAP_LINEAR:3, LINEAR_MIPMAP_NEAREST:4, LINEAR_MIPMAP_LINEAR:5};
Object.assign(ape.gfx, function() {
  var _formatSize = [];
  _formatSize[ape.gfx.TextureFormat.RGB] = 3;
  _formatSize[ape.gfx.TextureFormat.RGBA] = 4;
  _formatSize[ape.gfx.TextureFormat.LUMINANCE] = 1;
  var _addressLookup = [];
  _addressLookup[ape.gfx.TextureAddress.REPEAT] = WebGLRenderingContext.REPEAT;
  _addressLookup[ape.gfx.TextureAddress.CLAMP_TO_EDGE] = WebGLRenderingContext.CLAMP_TO_EDGE;
  _addressLookup[ape.gfx.TextureAddress.MIRRORED_REPEAT] = WebGLRenderingContext.MIRRORED_REPEAT;
  var _filterLookup = [];
  _filterLookup[ape.gfx.TextureFilter.NEAREST] = WebGLRenderingContext.NEAREST;
  _filterLookup[ape.gfx.TextureFilter.LINEAR] = WebGLRenderingContext.LINEAR;
  _filterLookup[ape.gfx.TextureFilter.NEAREST_MIPMAP_NEAREST] = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
  _filterLookup[ape.gfx.TextureFilter.NEAREST_MIPMAP_LINEAR] = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
  _filterLookup[ape.gfx.TextureFilter.LINEAR_MIPMAP_NEAREST] = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
  _filterLookup[ape.gfx.TextureFilter.LINEAR_MIPMAP_LINEAR] = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
  var Texture = function() {
    var gl = Device.gl;
    this._textureId = gl.createTexture();
    this._addressu = ape.gfx.TextureAddress.REPEAT;
    this._addressv = ape.gfx.TextureAddress.REPEAT;
    this._minFilter = ape.gfx.TextureFilter.NEAREST_MIPMAP_LINEAR;
    this._magFilter = ape.gfx.TextureFilter.LINEAR;
  };
  Object.assign(Texture.prototype, {bind:function() {
    var gl = Device.gl;
    gl.bindTexture(this._target, this._textureId);
  }, allocate:function() {
    if (this._source !== undefined) {
      delete this._source;
    }
    this._levels = [];
    var numBytes = this._width * this._height * _formatSize[this._format];
    this._levels[0] = new ArrayBuffer(numBytes);
  }, isPowerOfTwo:function() {
    var w = this._width;
    var h = this._height;
    return !(w === 0) && !(w & w - 1) && (!(h === 0) && !(h & h - 1));
  }, lock:function(options) {
    options = options || {level:0, face:0, mode:ape.gfx.TextureLock.WRITE};
    if (options.level === undefined) {
      options.level = 0;
    }
    if (options.face === undefined) {
      options.face = 0;
    }
    if (options.mode === undefined) {
      options.mode = ape.gfx.TextureLock.WRITE;
    }
    logASSERT(this._levels !== undefined, "ape.gfx.Texture: lock: Texture has not been allocated");
    logASSERT(options.level >= 0 || options.level < this._levels.length, "ape.gfx.Texture: lock: Supplied mip level out of range");
    this._lockedLevel = options.level;
    if (this._levels[options.level] === undefined) {
      var numBytes = this._width * this._height * _formatSize[this._format];
      this._levels[options.level] = new ArrayBuffer(numBytes);
    }
    return this._levels[options.level];
  }, unlock:function() {
    logASSERT(this._lockedLevel !== undefined, "Attempting to unlock a texture that is not locked");
    this.upload();
    delete this._lockedLevel;
  }, recover:function() {
    var gl = Device.gl;
    this._textureId = gl.createTexture();
    this.setAddressMode(this._addressu, this._addressv);
    this.setFilterMode(this._minFilter, this._magFilter);
    this.upload();
  }, setAddressMode:function(addressu, addressv) {
    if (!this.isPowerOfTwo()) {
      if (addressu !== ape.gfx.TextureAddress.CLAMP_TO_EDGE) {
        logWARNING("Invalid address mode in U set on non power of two texture. Forcing clamp to edge addressing.");
        addressu = ape.gfx.TextureAddress.CLAMP_TO_EDGE;
      }
      if (addressv !== ape.gfx.TextureAddress.CLAMP_TO_EDGE) {
        logWARNING("Invalid address mode in V set on non power of two texture. Forcing clamp to edge addressing.");
        addressv = ape.gfx.TextureAddress.CLAMP_TO_EDGE;
      }
    }
    this.bind();
    var gl = Device.gl;
    gl.texParameteri(this._target, gl.TEXTURE_WRAP_S, _addressLookup[addressu]);
    gl.texParameteri(this._target, gl.TEXTURE_WRAP_T, _addressLookup[addressv]);
    this._addressu = addressu;
    this._addressv = addressv;
  }, setFilterMode:function(minFilter, magFilter) {
    if (!this.isPowerOfTwo()) {
      if (!(minFilter === ape.gfx.TextureFilter.NEAREST || minFilter === ape.gfx.TextureFilter.LINEAR)) {
        logWARNING("Invalid filter mode set on non power of two texture. Forcing linear addressing.");
        minFilter = ape.gfx.TextureFilter.LINEAR;
      }
    }
    this.bind();
    var gl = Device.gl;
    gl.texParameteri(this._target, gl.TEXTURE_MIN_FILTER, _filterLookup[minFilter]);
    gl.texParameteri(this._target, gl.TEXTURE_MAG_FILTER, _filterLookup[magFilter]);
    this._minFilter = minFilter;
    this._magFilter = magFilter;
  }, getFormat:function() {
    return this._format;
  }, getHeight:function() {
    return this._height;
  }, getWidth:function() {
    return this._width;
  }});
  return {Texture:Texture};
}());
Object.assign(ape.gfx, function() {
  var _formatLookup = [];
  _formatLookup[ape.gfx.TextureFormat.RGB] = WebGLRenderingContext.RGB;
  _formatLookup[ape.gfx.TextureFormat.RGBA] = WebGLRenderingContext.RGBA;
  _formatLookup[ape.gfx.TextureFormat.LUMINANCE] = WebGLRenderingContext.LUMINANCE;
  var Texture2D = function(width, height, format) {
    var gl = Device.gl;
    this._target = gl.TEXTURE_2D;
    this._width = width || 1;
    this._height = height || 1;
    this._format = format || ape.gfx.TextureFormat.RGB;
    this.upload();
  };
  Texture2D.prototype = Object.create(ape.gfx.Texture.prototype);
  Texture2D.prototype.constructor = Texture2D;
  Texture2D.prototype.load = function(url, loader, batch) {
    var options = {batch:batch};
    loader.request(new ape.gfx.resources.ImageRequest(url), function(resources) {
      this.setSource(resources[url]);
    }.bind(this));
  };
  Texture2D.prototype.setSource = function(source) {
    logASSERT(source instanceof HTMLCanvasElement || source instanceof HTMLImageElement || source instanceof HTMLVideoElement, "ape.gfx.Texture2D: setSource: supplied source is not an instance of HTMLCanvasElement, HTMLImageElement or HTMLVideoElement.");
    if (this._levels !== undefined) {
      delete this._levels;
    }
    this._width = source.width;
    this._height = source.height;
    this._format = ape.gfx.TextureFormat.RGBA;
    this._source = source;
    this.upload();
  };
  Texture2D.prototype.upload = function() {
    var gl = Device.gl;
    var glFormat = _formatLookup[this._format];
    this.bind();
    if (this._source !== undefined) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, glFormat, gl.UNSIGNED_BYTE, this._source);
    } else {
      if (this._levels !== undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, new Uint8Array(this._levels[0]));
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, null);
      }
    }
    if (this.isPowerOfTwo()) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }
  };
  return {Texture2D:Texture2D};
}());
Object.assign(ape.gfx, function() {
  var _formatLookup = [];
  _formatLookup[ape.gfx.TextureFormat.RGB] = WebGLRenderingContext.RGB;
  _formatLookup[ape.gfx.TextureFormat.RGBA] = WebGLRenderingContext.RGBA;
  _formatLookup[ape.gfx.TextureFormat.LUMINANCE] = WebGLRenderingContext.LUMINANCE;
  var TextureCube = function(width, height, format) {
    var gl = Device.gl;
    this._target = gl.TEXTURE_CUBE_MAP;
    this._width = width || 1;
    this._height = height || 1;
    this._format = format || ape.gfx.TextureFormat.RGB;
    this.upload();
  };
  TextureCube.prototype = Object.create(ape.gfx.Texture.prototype);
  TextureCube.prototype.constructor = TextureCube;
  TextureCube.prototype.load = function(urls, loader, requestBatch) {
    var options = {batch:requestBatch};
    var requests = urls.map(function(url) {
      return new ape.resources.ImageRequest(url);
    });
    loader.request(requests, function(resources) {
      var images = urls.map(function(url) {
        return resources[url];
      });
      this.setSource(images);
    }.bind(this), function(errors) {
      logERROR(errors);
    }, function(progress) {
    }, options);
  };
  TextureCube.prototype.setSource = function(source) {
    logASSERT(Object.prototype.toString.apply(source) === "[object Array]", "ape.TextureCube: setSource: supplied source is not an array");
    logASSERT(source.length === 6, "ape.gfx.TextureCube: setSource: supplied source does not have 6 entries.");
    var validTypes = 0;
    var validDimensions = true;
    var width = source[0].width;
    var height = source[0].height;
    for (var i = 0; i < 6; i++) {
      if (source[i] instanceof HTMLCanvasElement || source[i] instanceof HTMLImageElement || source[i] instanceof HTMLVideoElement) {
        validTypes++;
      }
      if (source[i].width !== width) {
        validDimensions = false;
      }
      if (source[i].height !== height) {
        validDimensions = false;
      }
    }
    logASSERT(validTypes === 6, "ape.gfx.TextureCube: setSource: Not all supplied source elements are of required type (canvas, image or video).");
    logASSERT(validDimensions, "ape.gfx.TextureCube: setSource: Not all supplied source elements share the same dimensions.");
    if (this._levels !== undefined) {
      delete this._levels;
    }
    this._width = source[0].width;
    this._height = source[0].height;
    this._format = ape.gfx.TextureFormat.RGBA;
    this._source = source;
    this.upload();
  };
  TextureCube.prototype.upload = function() {
    var gl = Device.gl;
    var glFormat = _formatLookup[this._format];
    this.bind();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (this._source !== undefined) {
      for (var face = 0; face < 6; face++) {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, glFormat, glFormat, gl.UNSIGNED_BYTE, this._source[face]);
      }
    } else {
      if (this._levels !== undefined) {
        for (var face = 0; face < 6; face++) {
          gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, new Uint8Array(this._levels[face][0]));
        }
      } else {
        for (var face = 0; face < 6; face++) {
          gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, glFormat, this._width, this._height, 0, glFormat, gl.UNSIGNED_BYTE, null);
        }
      }
    }
    if (this.isPowerOfTwo()) {
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }
  };
  return {TextureCube:TextureCube};
}());
WebGLValidator.ErrorString = {};
WebGLValidator.ErrorString[WebGLRenderingContext.NO_ERROR] = "NO_ERROR";
WebGLValidator.ErrorString[WebGLRenderingContext.INVALID_ENUM] = "INVALID_ENUM";
WebGLValidator.ErrorString[WebGLRenderingContext.INVALID_VALUE] = "INVALID_VALUE";
WebGLValidator.ErrorString[WebGLRenderingContext.INVALID_OPERATION] = "INVALID_OPERATION";
WebGLValidator.ErrorString[WebGLRenderingContext.OUT_OF_MEMORY] = "OUT_OF_MEMORY";
WebGLValidator.ErrorString[WebGLRenderingContext.INVALID_FRAMEBUFFER_OPERATION] = "INVALID_FRAMEBUFFER_OPERATION";
function WebGLValidator(gl) {
  this.gl = gl;
  var self = this;
  function makeWrapper(member) {
    return function() {
      var result = self.gl[member].apply(self.gl, arguments);
      self.validate(member);
      return result;
    };
  }
  var self = this;
  for (var member in gl) {
    if (typeof gl[member] === "function") {
      this[member] = makeWrapper(member);
    } else {
      this[member] = gl[member];
    }
  }
}
WebGLValidator.prototype.validate = function(functionName) {
  var error = this.gl.getError();
  if (error !== WebGLValidator.NO_ERROR) {
    log.error("WebGL error from " + functionName + ":" + WebGLValidator.ErrorString[error]);
    return false;
  }
  return true;
};
Object.assign(ape.gfx, function() {
  var idCounter = 0;
  var VersionObject = function() {
    idCounter++;
    this.version = new ape.gfx.Version;
    this.version.globalId = idCounter;
  };
  Object.assign(VersionObject.prototype, {increment:function() {
    this.version.revision++;
  }});
  return {VersionObject:VersionObject};
}());
Object.assign(ape.gfx, function() {
  var Version = function() {
    this.globalId = 0;
    this.revision = 0;
  };
  Object.assign(Version.prototype, {equals:function(other) {
    return this.golbalId === other.golbalId && this.revisoin === other.revision;
  }, notequals:function(other) {
    return this.globalId !== other.globalId || this.revision !== other.revision;
  }, copy:function(other) {
    this.globalId = other.globalId;
    this.revision = other.revision;
  }, reset:function() {
    this.globalId = 0;
    this.revision = 0;
  }});
  return {Version:Version};
}());
ape.gfx.VertexBufferUsage = {DYNAMIC:0, STATIC:1};
Object.assign(ape.gfx, function() {
  var VertexBuffer = function(format, numVertices, usage) {
    usage = usage || ape.gfx.VertexBufferUsage.STATIC;
    var gl = Device.gl;
    this.usage = usage === ape.gfx.VertexBufferUsage.DYNAMIC ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
    this.format = format;
    this.numVertices = numVertices;
    this.bufferId = gl.createBuffer();
    this.numBytes = format.size * numVertices;
    this.storage = new ArrayBuffer(this.numBytes);
  };
  Object.assign(VertexBuffer.prototype, {getFormat:function() {
    return this.format;
  }, getUsage:function() {
    return this.usage;
  }, getNumVertices:function() {
    return this.numVertices;
  }, lock:function() {
    return this.storage;
  }, unlock:function() {
    var gl = Device.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.storage), this.usage);
  }});
  return {VertexBuffer:VertexBuffer};
}());
ape.gfx.VertexElementType = {INT8:0, UINT8:1, INT16:2, UINT16:3, INT32:4, UINT32:5, FLOAT32:6};
Object.assign(ape.gfx, function() {
  var _typeSize = [];
  _typeSize[ape.gfx.VertexElementType.INT8] = 1;
  _typeSize[ape.gfx.VertexElementType.UINT8] = 1;
  _typeSize[ape.gfx.VertexElementType.INT16] = 2;
  _typeSize[ape.gfx.VertexElementType.UINT16] = 2;
  _typeSize[ape.gfx.VertexElementType.INT32] = 4;
  _typeSize[ape.gfx.VertexElementType.UINT32] = 4;
  _typeSize[ape.gfx.VertexElementType.FLOAT32] = 4;
  var VertexElement = function(name, numComponents, dataType) {
    this.offset = 0;
    this.stride = 0;
    this.stream = -1;
    var device = Device;
    this.scopeId = device.scope.resolve(name);
    this.dataType = dataType;
    this.numComponents = numComponents;
    this.size = this.numComponents * _typeSize[this.dataType];
  };
  return {VertexElement:VertexElement};
}());
Object.assign(ape.gfx, function() {
  var VertexFormat = function() {
    this.size = 0;
    this.numElements = 0;
    this.elements = [];
  };
  Object.assign(VertexFormat.prototype, {begin:function() {
    this.size = 0;
    this.numElements = 0;
    this.elements = [];
  }, end:function() {
    var offset = 0;
    var i = 0;
    var elements = this.elements;
    var numElements = this.numElements;
    while (i < numElements) {
      var vertexElement = elements[i++];
      vertexElement.offset = offset;
      vertexElement.stride = this.size;
      offset += vertexElement.size;
    }
  }, addElement:function(vertexElement) {
    this.size += vertexElement.size;
    this.numElements++;
    this.elements.push(vertexElement);
  }});
  return {VertexFormat:VertexFormat};
}());
function VertexIteratorSetter(buffer, vertexElement) {
  this.index = 0;
  switch(vertexElement.dataType) {
    case ape.gfx.VertexElementType.INT8:
      this.array = new Int8Array(buffer, vertexElement.offset);
      break;
    case ape.gfx.VertexElementType.UINT8:
      this.array = new Uint8Array(buffer, vertexElement.offset);
      break;
    case ape.gfx.VertexElementType.INT16:
      this.array = new Int16Array(buffer, vertexElement.offset);
      break;
    case ape.gfx.VertexElementType.UINT16:
      this.array = new Uint16Array(buffer, vertexElement.offset);
      break;
    case ape.gfx.VertexElementType.INT32:
      this.array = new Int32Array(buffer, vertexElement.offset);
      break;
    case ape.gfx.VertexElementType.UINT32:
      this.array = new Uint32Array(buffer, vertexElement.offset);
      break;
    case ape.gfx.VertexElementType.FLOAT32:
      this.array = new Float32Array(buffer, vertexElement.offset);
      break;
  }
  switch(vertexElement.numComponents) {
    case 1:
      this.set = VertexIteratorSetter_set1;
      break;
    case 2:
      this.set = VertexIteratorSetter_set2;
      break;
    case 3:
      this.set = VertexIteratorSetter_set3;
      break;
    case 4:
      this.set = VertexIteratorSetter_set4;
      break;
  }
}
function VertexIteratorSetter_set1(a) {
  this.array[this.index] = a;
}
function VertexIteratorSetter_set2(a, b) {
  this.array[this.index] = a;
  this.array[this.index + 1] = b;
}
function VertexIteratorSetter_set3(a, b, c) {
  this.array[this.index] = a;
  this.array[this.index + 1] = b;
  this.array[this.index + 2] = c;
}
function VertexIteratorSetter_set4(a, b, c, d) {
  this.array[this.index] = a;
  this.array[this.index + 1] = b;
  this.array[this.index + 2] = c;
  this.array[this.index + 3] = d;
}
ape.gfx.VertexIterator = function VertexIterator(vertexBuffer) {
  this.vertexBuffer = vertexBuffer;
  this.buffer = this.vertexBuffer.lock();
  this.setters = [];
  this.element = {};
  var vertexFormat = this.vertexBuffer.getFormat();
  for (var i = 0; i < vertexFormat.numElements; i++) {
    var vertexElement = vertexFormat.elements[i];
    this.setters[i] = new VertexIteratorSetter(this.buffer, vertexElement);
    this.element[vertexElement.scopeId.name] = this.setters[i];
  }
};
ape.gfx.VertexIterator.prototype.next = function() {
  var i = 0;
  var setters = this.setters;
  var numSetters = this.setters.length;
  var vertexFormat = this.vertexBuffer.getFormat();
  while (i < numSetters) {
    var setter = setters[i++];
    setter.index += vertexFormat.size / setter.array.BYTES_PER_ELEMENT;
  }
};
ape.gfx.VertexIterator.prototype.end = function() {
  this.vertexBuffer.unlock();
};
ape.fw = {};
ape.scene = {};
Object.assign(ape.scene, function() {
  var Scene = function Scene() {
    this._models = [];
    this._tempVec = new ape.Vec3;
    this._queues = {};
    this._priorities = [];
    this.addQueue({name:"first", priority:1.0});
    this.addQueue({name:"opaque", priority:2.0});
    this.addQueue({name:"transparent", priority:3.0});
    this.addQueue({name:"last", priority:4.0});
    this.addQueue({name:"post", priority:5.0});
    this.addQueue({name:"overlay", priority:6.0});
  };
  Scene.prototype.addQueue = function(queue) {
    var sortQueuesOnPriority = function(queueA, queueB) {
      var priorityA = queueA.priority;
      var priorityB = queueB.priority;
      return priorityA > priorityB;
    };
    this._queues[queue.name] = {renderFuncs:[], priority:queue.priority};
    this._priorities.push(queue);
    this._priorities.sort(sortQueuesOnPriority);
  };
  Scene.prototype.getQueuePriority = function(queueName) {
    return this._queues[queueName].priority;
  };
  Scene.prototype.addModel = function(model) {
    this._models.push(model);
  };
  Scene.prototype.removeModel = function(model) {
    var index = this._models.indexOf(model);
    if (index !== -1) {
      this._models.splice(index, 1);
    }
  };
  Scene.prototype.update = function(dt) {
    for (var i = 0, len = this._models.length; i < len; i++) {
      this._models[i].getGraph().syncHierarchy();
    }
  };
  Scene.prototype.dispatch = function(camera) {
    var i, j, model, numModels, mesh, numMeshes;
    var sphereWorld = new ape.shape.Sphere;
    var alphaMeshes = [];
    var opaqueMeshes = [];
    var frustum = camera.getFrustum();
    for (i = 0, numModels = this._models.length; i < numModels; i++) {
      model = this._models[i];
      meshes = model.getMeshes();
      for (j = 0, numMeshes = meshes.length; j < numMeshes; j++) {
        var visible = true;
        mesh = meshes[j];
        var volume = mesh.getVolume();
        if (volume) {
          if (volume instanceof ape.shape.Sphere) {
            visible = frustum.containsSphere(volume) !== 0;
          }
        }
        if (true) {
          if (!mesh.getGeometry().hasAlpha()) {
            opaqueMeshes.push(mesh);
          } else {
            alphaMeshes.push(mesh);
          }
        }
      }
    }
    var self = this;
    var sortBackToFront = function(meshA, meshB) {
      var wtmA = meshA.getWorldTransform();
      var wtmB = meshB.getWorldTransform();
      var camMat = camera.getWorldTransform();
      self._tempVec[0] = wtmA[12] - camMat[12];
      self._tempVec[1] = wtmA[13] - camMat[13];
      self._tempVec[2] = wtmA[14] - camMat[14];
      var distSqrA = ape.Vec3.dot(self._tempVec, self._tempVec);
      self._tempVec[0] = wtmB[12] - camMat[12];
      self._tempVec[1] = wtmB[13] - camMat[13];
      self._tempVec[2] = wtmB[14] - camMat[14];
      var distSqrB = ape.Vec3.dot(self._tempVec, self._tempVec);
      return distSqrA < distSqrB;
    };
    alphaMeshes.sort(sortBackToFront);
    opaqueMeshes.sort(sortBackToFront);
    for (i = 0, numMeshes = alphaMeshes.length; i < numMeshes; i++) {
      this.enqueue("transparent", function(m) {
        return function() {
          m.dispatch();
        };
      }(alphaMeshes[i]));
    }
    for (i = opaqueMeshes.length - 1; i >= 0; i--) {
      this.enqueue("opaque", function(m) {
        return function() {
          m.dispatch();
        };
      }(opaqueMeshes[i]));
    }
  };
  Scene.prototype.enqueue = function(queueName, renderFunc) {
    this._queues[queueName].renderFuncs.push(renderFunc);
  };
  Scene.prototype.flush = function() {
    ape.scene.LightNode.dispatch();
    for (var i = 0; i < this._priorities.length; i++) {
      var queueName = this._priorities[i].name;
      var queue = this._queues[queueName];
      var funcs = queue.renderFuncs;
      for (var j = 0; j < funcs.length; j++) {
        var func = funcs[j];
        func();
      }
      queue.renderFuncs = [];
    }
  };
  return {Scene:Scene, RenderOrder:{ANY:0, BACK_TO_FRONT:1, FRONT_TO_BACK:2}};
}());
Object.assign(ape.scene, function() {
  var GraphNode = function GraphNode(name) {
    this._name = name || "";
    this._ltm = new ape.Mat4;
    this._wtm = new ape.Mat4;
    this._parent = null;
    this._children = [];
    this._labels = {};
    this._graphId = -1;
  };
  GraphNode.prototype.clone = function() {
    var clone = new ape.scene.GraphNode;
    clone.setName(this.getName());
    clone.setLocalTransform(ape.Mat4.clone(this.getLocalTransform()));
    clone._graphId = this._graphId;
    return clone;
  };
  GraphNode.prototype.addGraphId = function(id) {
    this._graphId = id;
  };
  GraphNode.prototype.removeGraphId = function() {
    delete this._graphId;
  };
  GraphNode.prototype.find = function(attr, value) {
    var i;
    var children = this.getChildren();
    var length = children.length;
    var results = [];
    if (this[attr]) {
      if (this[attr] instanceof Function) {
        testValue = this[attr]();
      } else {
        testValue = this[attr];
      }
      if (testValue === value) {
        results.push(this);
      }
    }
    for (i = 0; i < length; ++i) {
      results = results.concat(children[i].find(attr, value));
    }
    return results;
  };
  GraphNode.prototype.findOne = function(attr, value) {
    var i;
    var children = this.getChildren();
    var length = children.length;
    var result = null;
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
    for (i = 0; i < length; ++i) {
      result = children[i].findOne(attr, value);
      if (result !== null) {
        return result;
      }
    }
    return null;
  };
  GraphNode.prototype.findByName = function(name) {
    if (this._name === name) {
      return this;
    }
    for (var i = 0; i < this._children.length; i++) {
      var found = this._children[i].findByName(name);
      if (found !== null) {
        return found;
      }
    }
    return null;
  };
  GraphNode.prototype.findByGraphId = function(id) {
    if (this._graphId === id) {
      return this;
    }
    for (var i = 0; i < this._children.length; i++) {
      var found = this._children[i].findByGraphId(id);
      if (found !== null) {
        return found;
      }
    }
    return null;
  };
  GraphNode.prototype.getRoot = function() {
    var parent = this.getParent();
    if (!parent) {
      return this;
    }
    while (parent.getParent()) {
      parent = parent.getParent();
    }
    return parent;
  };
  GraphNode.prototype.getParent = function() {
    return this._parent;
  };
  GraphNode.prototype.getChildren = function() {
    return this._children;
  };
  GraphNode.prototype.getLocalTransform = function() {
    return this._ltm;
  };
  GraphNode.prototype.getName = function() {
    return this._name;
  };
  GraphNode.prototype.getWorldTransform = function() {
    return this._wtm;
  };
  GraphNode.prototype.setParent = function(node) {
    this._parent = node;
  };
  GraphNode.prototype.setChildren = function(children) {
    this._children = children;
  };
  GraphNode.prototype.setLocalTransform = function(ltm) {
    this._ltm = ltm;
  };
  GraphNode.prototype.setName = function(name) {
    this._name = name;
  };
  GraphNode.prototype.addChild = function(node) {
    if (node._parent != null) {
      throw new Error("GraphNode is already parented");
    }
    this._children.push(node);
    node.setParent(this);
  };
  GraphNode.prototype.removeChild = function(child) {
    var i;
    var length = this._children.length;
    child.setParent(null);
    for (i = 0; i < length; ++i) {
      if (this._children[i] === child) {
        this._children.splice(i, 1);
        return;
      }
    }
  };
  GraphNode.prototype.addLabel = function(label) {
    this._labels[label] = true;
  };
  GraphNode.prototype.getLabels = function() {
    return Object.keys(this._labels);
  };
  GraphNode.prototype.hasLabel = function(label) {
    return !!this._labels[label];
  };
  GraphNode.prototype.removeLabel = function(label) {
    delete this._labels[label];
  };
  GraphNode.prototype.findByLabel = function(label, results) {
    var i, length = this._children.length;
    results = results || [];
    if (this.hasLabel(label)) {
      results.push(this);
    }
    for (i = 0; i < length; ++i) {
      results = this._children[i].findByLabel(label, results);
    }
    return results;
  };
  GraphNode.prototype.syncHierarchy = function() {
    function _syncHierarchy(node, parentTransform) {
      for (var i = 0, len = node._children.length; i < len; i++) {
        _syncHierarchy(node._children[i], node._wtm);
      }
    }
    _syncHierarchy(this, ape.Mat4());
  };
  return {GraphNode:GraphNode};
}());
var editor = editor || {};
Object.assign(editor, function() {
  var LinkInterface = function() {
    this.exposed = {};
    this.added = {};
    this.scripts = {};
    this.systems = [];
  };
  LinkInterface.prototype.addComponentType = function(name) {
    if (this.systems.indexOf(name) < 0) {
      this.systems.push(name);
    }
    if (!this.exposed[name]) {
      this.exposed[name] = {};
    }
  };
  LinkInterface.prototype.expose = function(details) {
    if (!details.system) {
      throw new Error("Missing option 'system'");
    }
    if (!details.variable) {
      throw new Error("Missing option 'variable'");
    }
    details.options = details.options || {};
    if (!this.exposed[details.system][details.variable]) {
      this.exposed[details.system][details.variable] = {};
    }
    this.exposed[details.system][details.variable] = details;
  };
  LinkInterface.prototype.add = function(details) {
    logASSERT(details.system, "Missing option: 'system'");
    logASSERT(details.variable, "Missing option: 'variable'");
    if (!this.added[details.system]) {
      this.added[details.system] = {};
    }
    if (!this.added[details.system][details.variable]) {
      this.added[details.system][details.variable] = {};
    }
    this.added[details.system][details.variable] = details;
  };
  LinkInterface.prototype.scriptexpose = function(details) {
    this.scripts[details.script] = details;
  };
  return {LinkInterface:LinkInterface, link:new LinkInterface};
}());
Object.assign(editor, function() {
  var LinkInterface = function() {
    this.exposed = {};
    this.added = {};
    this.scripts = {};
    this.systems = [];
  };
  LinkInterface.prototype = {addComponentType:function() {
  }, expose:function() {
  }, add:function() {
  }, scriptexpose:function() {
  }};
  return {LinkInterface:LinkInterface, link:new LinkInterface};
}());
Object.assign(ape.fw, function() {
  var ApplicationContext = function(loader, scene, registry, controller, keyboard, mouse) {
    this.loader = loader;
    this.scence = scene;
    this.root = new ape.scene.GraphNode;
    this.systems = registry;
    this.controller = controller;
    this.keyboard = keyboard;
    this.mouse = mouse;
  };
  return {ApplicationContext:ApplicationContext};
}());
Object.assign(ape.fw, function() {
  var Entity = function() {
    this._guid = ape.guid.create();
    this._batchHandle = null;
  };
  Entity.prototype = Object.create(ape.scene.GraphNode);
  Entity.prototype.constructor = Entity;
  Entity.prototype.getGuid = function() {
    return this._guid;
  };
  Entity.prototype.setGuid = function(guid) {
    this._guid = guid;
  };
  Entity.prototype.setRequestBatch = function(handle) {
    this._batchHandle = handle;
  };
  Entity.prototype.getRequestBatch = function() {
    return this._batchHandle;
  };
  Entity.prototype.addChild = function(child) {
    if (child instanceof ape.fw.Entity) {
      var _debug = true;
      if (_debug) {
        var root = this.getRoot();
        var dupe = root.findOne("getGuid", child.getGuid());
        if (dupe) {
          throw new Error("GUID already exists in graph");
        }
      }
    }
    ape.scene.GraphNode.prototype.addChild.call(this, child);
  };
  Entity.prototype.findByGuid = function(guid) {
    if (this._guid === guid) {
      return this;
    }
    for (var i = 0; i < this._children.length; i++) {
      if (this._children[i].findByGuid) {
        var found = this._children[i].findByGuid(guid);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  };
  Entity.prototype.reparentByGuid = function(parentGuid, context) {
    if (parentGuid) {
      var parent = context.root.findOne("getGuid", parentGuid);
      if (!parent) {
        throw new Error("Parent Entity doesn't exist");
      }
    }
    var current = this.getParent();
    if (current) {
      current.removeChild(this);
    }
    if (parent) {
      parent.addChild(this);
    }
  };
  Entity.prototype.close = function(registry) {
    var parent = this.getParent();
    var childGuids;
    ape.fw.ComponentSystem.deleteComponents(entity, registry);
    if (parent) {
      parent.removeChild(this);
    }
    this.getChildren().forEach(function(child) {
      if (child.close) {
        child.close(registry);
      }
    }, this);
  };
  Entity.deserialize = function(data) {
    var template = ape.json.parse(data.template);
    var parent = ape.json.parse(data.parent);
    var children = ape.json.parse(data.children);
    var transform = ape.json.parse(data.transform);
    var components = ape.json.parse(data.components);
    var labels = ape.json.parse(data.labels);
    var model = {_id:data._id, resource_id:data.resource_id, _rev:data._rev, name:data.name, labels:labels, template:template, parent:parent, children:children, transform:transform, components:components};
    return model;
  };
  Entity.serialize = function(model) {
    var data = {_id:model._id, resource_id:model.resource_id, name:model.name, labels:ape.json.stringify(model.labels), template:ape.json.stringify(model.template), parent:ape.json.stringify(model.parent), children:ape.json.stringify(model.children), transform:ape.json.stringify(model.transform), components:ape.json.stringify(model.components)};
    if (model._rev) {
      data._rev = model._rev;
    }
    return data;
  };
  return {Entity:Entity};
}());
Object.assign(ape.fw, function() {
  var Picker = function(width, height, model, pick) {
    this._width = width;
    this._height = height;
    this._model = model;
    this._pick = pick;
    var library = ape.GraphicsDevice.getCurrent().getProgramLibrary();
    var pickProgram = library.getProgram("pick", {skinning:false});
    var pickFrameBuffer = new ape.FrameBuffer(this._width, this._height, true);
    this._offscreenRenderTarget = new ape.RenderTarget(pickFrameBuffer);
  };
  Picker.prototype.getWidth = function() {
    return this._width;
  };
  Picker.prototype.getHeight = function() {
    return this._height;
  };
  Picker.prototype.pick = function() {
  };
  return {Picker:Picker};
}());
Object.assign(ape.fw, function() {
  var Asset = function(data) {
    if (data._id) {
      this._guid = data._id;
    } else {
      this._guid = ape.guid.create();
    }
    if (data) {
      ape.extend(this, data);
      delete this._id;
    }
  };
  Asset.prototype.getGuid = function() {
    return this._guid;
  };
  Asset.prototype.setGuid = function(guid) {
    this._guid = guid;
  };
  Asset.prototype.getFileUrl = function() {
    var url = this.file.url;
    var prefix = "";
    if (!this.file.exported) {
      prefix = "/api";
    }
    return ape.path.join(prefix, this.file.url);
  };
  return {Asset:Asset};
}());
Object.assign(ape.fw, function() {
  var AssetLoader = function(api) {
    this._api = api;
    this._cache = {};
  };
  AssetLoader.prototype.load = function(guid, success) {
    function _loaded(data) {
      var asset = this.open(data);
      success(asset);
    }
    if (guid in this._cache) {
      success(this._cache[guid]);
      return;
    }
    if (guid in ape.content.data) {
      _loaded.call(this, ape.content.data[guid]);
    } else {
      this._api.asset.getOne(guid, ape.callback(this, function(asset) {
        _loaded.call(this, asset);
      }));
    }
  };
  AssetLoader.prototype.open = function(data) {
    var asset = new ape.fw.Asset(data);
    this._cache[asset.getGuid()] = asset;
    return asset;
  };
  return {AssetLoader:AssetLoader};
}());
Object.assign(ape.fw, function() {
  var ComponentSystem = function ComponentSystem(context) {
    var _components = {};
    this._name = "";
    this.context = context;
    this.getComponents = function() {
      return _components;
    };
    this._getComponents = this.getComponents;
    this.getComponentData = function(entity) {
      if (_components[entity.getGuid()]) {
        return _components[entity.getGuid()].component;
      } else {
        return null;
      }
    };
    this._getComponentData = this.getComponentData;
  };
  ComponentSystem.update = function(dt, context, inTools) {
    var name;
    var registry = context.systems;
    for (name in registry) {
      if (registry.hasOwnProperty(name)) {
        if (!inTools) {
          if (registry[name].update) {
            registry[name].update(dt);
          }
        } else {
          if (registry[name].toolsUpdate) {
            registry[name].toolsUpdate(dt);
          }
        }
      }
    }
  };
  ComponentSystem.render = function(context, inTools) {
    var name;
    var registry = context.systems;
    for (name in registry) {
      if (registry.hasOwnProperty(name)) {
        if (registry[name].render) {
          registry[name].render();
        }
        if (inTools && registry[name].toolsRender) {
          registry[name].toolsRender();
        }
      }
    }
  };
  ComponentSystem.toolUpdate = function(dt, context) {
  };
  ComponentSystem.toolRender = function(context) {
  };
  ComponentSystem.deleteComponents = function(entity, registry) {
    var name;
    var component;
    for (name in registry) {
      if (registry.hasOwnProperty(name)) {
        if (registry[name]._getComponentData(entity)) {
          registry[name].deleteComponent(entity);
        }
      }
    }
  };
  ComponentSystem.prototype.hasComponent = function(entity) {
    return this._getComponentData(entity) !== null;
  };
  ComponentSystem.prototype.initialiseComponent = function(entity, componentData, data, properties) {
    this.addComponent(entity, componentData);
    data = ape.extend(componentData, data);
    properties.forEach(function(value, index, arr) {
      this.set(entity, value, data[value]);
    }, this);
  };
  ComponentSystem.prototype.createComponent = function(entity, data) {
    throw new Error("createComponent not implemented");
  };
  ComponentSystem.prototype.deleteComponent = function(entity) {
    var component = this._getComponentData(entity);
    this.removeComponent(entity);
  };
  ComponentSystem.prototype.addComponent = function(entity, data) {
    var components = this._getComponents();
    components[entity.getGuid()] = {entity:entity, component:data};
  };
  ComponentSystem.prototype.removeComponent = function(entity) {
    var components = this._getComponents();
    delete components[entity.getGuid()];
  };
  ComponentSystem.prototype.set = function(entity, name, value) {
    var oldValue;
    var componentData = this._getComponentData(entity);
    if (componentData) {
      oldValue = componentData[name];
      if (this["_" + name] && typeof this["_" + name] === "function") {
        this["_" + name](componentData, value);
      } else {
        if (componentData[name] !== undefined) {
          componentData[name] = value;
        }
      }
      this.fire("set", entity, name, oldValue, value);
    }
  };
  ComponentSystem.prototype.get = function(entity, name) {
    var componentData = this._getComponentData(entity);
    if (componentData) {
      if (this["_" + name] && typeof this["_" + name] === "function") {
        return this["_" + name](componentData);
      } else {
        if (componentData[name] !== undefined) {
          return componentData[name];
        }
      }
    }
  };
  return {ComponentSystem:ComponentSystem};
}());
Object.assign(ape.fw, function() {
  var ComponentData = function(entity) {
    this.entity = entity;
  };
  return {ComponentData:ComponentData};
}());
Object.assign(ape.fw, function() {
  var ComponentSystemRegistry = function() {
  };
  ComponentSystemRegistry.prototype.add = function(name, system) {
    if (!this[name]) {
      this[name] = system;
    } else {
      throw new Error(ape.string.format("ComponentSystem name '{0}' already registered or not allowed", name));
    }
  };
  ComponentSystemRegistry.prototype.remove = function(name) {
    if (!this[name]) {
      throw new Error(ape.string.format("No ComponentSystem named '{0}' registered", name));
    }
    delete this[name];
  };
  return {ComponentSystemRegistry:ComponentSystemRegistry};
}());
Object.assign(ape.fw, function() {
  var _createGfxResources = function() {
    var device = Device;
    var library = device.getProgramLibrary();
    var program = library.getProgram("basic", {vertexColors:false, diffuseMapping:false});
    var format = new ape.gfx.VertexFormat;
    format.begin();
    format.addElement(new ape.gfx.VertexElement("vertex_position", 3, ape.gfx.VertexElementType.FLOAT32));
    format.end();
    var vertexBuffer = new ape.gfx.VertexBuffer(format, 8, ape.gfx.VertexBufferUsage.DYNAMIC);
    var indexBuffer = new ape.gfx.IndexBuffer(ape.gfx.IndexFormat.UINT16, 24);
    var indices = new Uint16Array(indexBuffer.lock());
    indices.set([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]);
    indexBuffer.unlock();
    return {program:program, indexBuffer:indexBuffer, vertexBuffer:vertexBuffer};
  };
  var _createOffscreenBuffer = function() {
    var backBuffer = Device;
    var w = backBuffer.getWidth();
    var h = backBuffer.getHeight();
    var offscreenBuffer = new ape.gfx.FrameBuffer(w, h, true);
    var offscreenTexture = offscreenBuffer.getTexture();
    offscreenTexture.setFilterMode(ape.gfx.TextureFilter.LINEAR, ape.gfx.TextureFilter.LINEAR);
    offscreenTexture.setAddressMode(ape.gfx.TextureAddress.CLAMP_TO_EDGE, ape.gfx.TextureAddress.CLAMP_TO_EDGE);
    return offscreenBuffer;
  };
  var CameraComponentSystem = function(context) {
    ape.fw.ComponentSystem.call(this, context);
    context.systems.add("camera", this);
    ape.extend(this, {_cameraStack:[], _camera:null, _current:null, _clearColor:function(componentData, clearColor) {
      if (clearColor) {
        var color = parseInt(clearColor);
        componentData.camera.getClearOptions().color = [(color >> 24 & 255) / 255.0, (color >> 16 & 255) / 255.0, (color >> 8 & 255) / 255.0, (color & 255) / 255.0];
      } else {
        return componentData.camera.getClearOptions().color;
      }
    }, _cam:function(componentData) {
      return componentData.camera;
    }, _fov:function(componentData, fov) {
      if (fov) {
        componentData.fov = fov;
        componentData.camera.setFov(fov);
      } else {
        return componentData.camera.getFov();
      }
    }, _viewWindowX:function(componentData, vwx) {
      if (vwx) {
        componentData.viewWindowX = vwx;
        var vw = componentData.camera.getViewWindow();
        componentData.camera.setViewWindow(ape.Vec2.create(vwx, vw[1]));
      } else {
        return componentData.viewWindowX;
      }
    }, _viewWindowY:function(componentData, vwy) {
      if (vwy) {
        componentData.viewWindowY = vwy;
        var vw = componentData.camera.getViewWindow();
        componentData.camera.setViewWindow(ape.Vec2.create(vw[0], vwy));
      } else {
        return componentData.viewWindowY;
      }
    }, _nearClip:function(componentData, nearClip) {
      if (nearClip) {
        componentData.nearClip = nearClip;
        componentData.camera.setNearClip(nearClip);
      } else {
        return componentData.camera.getNearClip();
      }
    }, _farClip:function(componentData, farClip) {
      if (farClip) {
        componentData.farClip = farClip;
        componentData.camera.setFarClip(farClip);
      } else {
        return componentData.camera.getFarClip();
      }
    }, _offscreen:function(componentData, offscreen) {
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
    }, _projection:function(componentData, projection) {
      if (projection) {
        componentData.projection = projection;
        componentData.camera.setProjection(projection);
      } else {
        return componentData.camera.getProjection();
      }
    }});
    this.renderable = _createGfxResources();
  };
  CameraComponentSystem.prototype = Object.create(ape.fw.ComponentSystem.prototype);
  CameraComponentSystem.prototype.constructor = CameraComponentSystem;
  CameraComponentSystem.prototype.createComponent = function(entity, data) {
    var componentData = new ape.fw.CameraComponentData;
    var properties = ["clearColor", "fov", "viewWindowX", "viewWindowY", "activate", "nearClip", "farClip", "offscreen", "projection"];
    data = data || {};
    componentData.camera = new ape.scene.CameraNode;
    entity.addChild(componentData.camera);
    this.addComponent(entity, componentData);
    properties.forEach(function(value, index, arr) {
      if (ape.isDefined(data[value])) {
        this.set(entity, value, data[value]);
      }
    }, this);
    if (!window.ape.apps.designer && this.get(entity, "activate") && !entity.hasLabel("ape:designer")) {
      this.push(entity);
    }
    return componentData;
  };
  CameraComponentSystem.prototype.deleteComponent = function(entity) {
    var data = this._getComponentData(entity);
    if (data.camera) {
      entity.removeChild(data.camera);
      data.camera = null;
    }
    this.removeComponent(entity);
  };
  CameraComponentSystem.prototype.update = function(dt) {
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
  CameraComponentSystem.prototype.toolsRender = function(fn) {
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
      if (false) {
        entity = components[id].entity;
        componentData = components[id].component;
        var cam = componentData.camera;
        var nearClip = cam.getNearClip();
        var farClip = cam.getFarClip();
        var fov = cam.getFov() * Math.PI / 180.0;
        var viewport = cam.getRenderTarget().getViewport();
        var positions = new Float32Array(vertexBuffer.lock());
        var y = Math.tan(fov / 2.0) * nearClip;
        var x = y * viewport.width / viewport.height;
        positions[0] = x;
        positions[1] = -y;
        positions[2] = -nearClip;
        positions[3] = x;
        positions[4] = y;
        positions[5] = -nearClip;
        positions[6] = -x;
        positions[7] = y;
        positions[8] = -nearClip;
        positions[9] = -x;
        positions[10] = -y;
        positions[11] = -nearClip;
        y = Math.tan(fov / 2.0) * farClip;
        x = y * viewport.width / viewport.height;
        positions[12] = x;
        positions[13] = -y;
        positions[14] = -farClip;
        positions[15] = x;
        positions[16] = y;
        positions[17] = -farClip;
        positions[18] = -x;
        positions[19] = y;
        positions[20] = -farClip;
        positions[21] = -x;
        positions[22] = -y;
        positions[23] = -farClip;
        vertexBuffer.unlock();
        device = ape.gfx.GraphicsDevice.getCurrent();
        device.setProgram(program);
        device.setIndexBuffer(indexBuffer);
        device.setVertexBuffer(vertexBuffer, 0);
        transform = entity.getWorldTransform();
        device.scope.resolve("matrix_model").setValue(transform);
        device.scope.resolve("constant_color").setValue([1, 1, 0, 1]);
        device.draw({primitiveType:ape.gfx.PrimType.LINES, numVertices:indexBuffer.getNumIndices(), useIndexBuffer:true});
      }
    }
  };
  CameraComponentSystem.prototype.getCurrent = function() {
    return this._current;
  };
  CameraComponentSystem.prototype.push = function(entity) {
    this._current = entity;
    this._cameraStack.push(entity);
    this._camera = this._getComponentData(entity).camera;
  };
  CameraComponentSystem.prototype.pop = function() {
    if (!this._cameraStack.length) {
      return null;
    }
    var cam = this._cameraStack.pop();
    this._current = this._cameraStack.length ? this._cameraStack[this._cameraStack.length - 1] : null;
    this._camera = this._current ? this._getComponentData(this._current).camera : null;
    return cam;
  };
  CameraComponentSystem.prototype.frameBegin = function() {
    if (!this._camera) {
      return;
    }
    this._camera.frameBegin();
  };
  CameraComponentSystem.prototype.frameEnd = function() {
    if (!this._camera) {
      return;
    }
    this._camera.frameEnd();
  };
  return {CameraComponentSystem:CameraComponentSystem};
}());
Object.assign(ape.fw, function() {
  CameraComponentData = function() {
    this.camera = null;
    this.clearColor = "0xbabab1ff";
    this.nearClip = 1;
    this.farClip = 100000;
    this.fov = 45;
    this.viewWindowX = 1.0;
    this.viewWindowY = 1.0;
    this.projection = ape.scene.Projection.PERSPECTIVE;
    this.activate = true;
    this.offscreen = false;
  };
  CameraComponentData.prototype = Object.create(ape.fw.ComponentData);
  CameraComponentData.prototype.constructor = CameraComponentData;
  return {CameraComponentData:CameraComponentData};
}());
editor.link.addComponentType("camera");
editor.link.expose({system:"camera", variable:"clearColor", displayName:"Clear Color", description:"Clear Color", type:"string", defaultValue:"0xbabab1ff"});
editor.link.expose({system:"camera", variable:"fov", displayName:"Field of view", description:"Field Of View", type:"number", defaultValue:45, options:{min:0, max:180}});
editor.link.expose({system:"camera", variable:"viewWindowX", displayName:"View Window X", description:"View window half extent of camera in X axis", type:"number", defaultValue:1});
editor.link.expose({system:"camera", variable:"viewWindowY", displayName:"View Window Y", description:"View window half extent of camera in Y axis", type:"number", defaultValue:1});
editor.link.expose({system:"camera", variable:"nearClip", displayName:"Near Clip", description:"Near clipping distance", type:"number", defaultValue:1, options:{min:0}});
editor.link.expose({system:"camera", variable:"farClip", displayName:"Far Clip", description:"Far clipping distance", type:"number", defaultValue:100000, options:{min:0}});
editor.link.expose({system:"camera", variable:"activate", displayName:"Activate", description:"Activate camera when scene loads", type:"boolean", defaultValue:true});
editor.link.expose({system:"camera", variable:"offscreen", displayName:"Offscreen", description:"Render to an offscreen buffer", type:"boolean", defaultValue:false});
editor.link.expose({system:"camera", variable:"projection", displayName:"Projection", description:"Projection type of camera", type:"number", defaultValue:0});
Object.assign(ape.fw, function() {
  var _createGfxResources = function() {
    var device = Device;
    var library = device.getProgramLibrary();
    var program = library.getProgram("basic", {vertexColors:false, diffuseMapping:false});
    var format = new ape.gfx.VertexFormat;
    format.begin();
    format.addElement(new ape.gfx.VertexElement("vertex_position", 3, ape.gfx.VertexElementType.FLOAT32));
    format.end();
    var vertexBuffer = new ape.gfx.VertexBuffer(format, 32, ape.gfx.VertexBufferUsage.DYNAMIC);
    vertexData = [0, 0, 0, 0, -8, 0, -0.5, -8, 0, 0.5, -8, 0, 0.5, -8, 0, 0, -10, 0, 0, -10, 0, -0.5, -8, 0, 0, 0, -2, 0, -8, -2, -0.25, -8, -2, 0.25, -8, -2, 0.25, -8, -2, 0, -10, -2, 0, -10, -2, -0.25, -8, -2];
    var positions = new Float32Array(vertexBuffer.lock());
    for (var i = 0; i < vertexData.length; i++) {
      positions[i] = vertexData[i];
    }
    vertexBuffer.unlock();
    return {program:program, vertexBuffer:vertexBuffer};
  };
  var DirectionalLightComponentSystem = function(context) {
    ape.fw.ComponentSystem.call(this, context);
    context.systems.add("directionallight", this);
    ape.extend(this, {_enable:function(componentData, enable) {
      if (enable !== undefined) {
        componentData.enable = enable;
        componentData.light.enable(enable);
      } else {
        return componentData.enable;
      }
    }, _color:function(componentData, color) {
      if (color) {
        var rgb = parseInt(color);
        componentData.color = [(rgb >> 16 & 255) / 255.0, (rgb >> 8 & 255) / 255.0, (rgb & 255) / 255.0];
        componentData.light.setColor(componentData.color);
      } else {
        return componentData.color;
      }
    }});
    this.renderable = _createGfxResources();
  };
  DirectionalLightComponentSystem.prototype = Object.create(ape.fw.ComponentSystem.prototype);
  DirectionalLightComponentSystem.prototype.constructor = DirectionalLightComponentSystem;
  DirectionalLightComponentSystem.prototype.createComponent = function(entity, data) {
    var componentData = new ape.fw.DirectionalLightComponentData;
    var properties = ["enable", "color"];
    data = data || {};
    componentData.light = new ape.scene.LightNode;
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
  DirectionalLightComponentSystem.prototype.deleteComponent = function(entity) {
    var data = this._getComponentData(entity);
    entity.removeChild(data.light);
    data.light.enable(false);
    delete data.light;
    this.removeComponent(entity);
  };
  DirectionalLightComponentSystem.prototype.update = function(dt) {
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
  DirectionalLightComponentSystem.prototype.toolsRender = function(fn) {
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
        device = ape.gfx.GraphicsDevice.getCurrent();
        device.setProgram(program);
        device.setVertexBuffer(vertexBuffer, 0);
        transform = entity.getWorldTransform();
        device.scope.resolve("matrix_model").setValue(transform);
        device.scope.resolve("constant_color").setValue([1, 1, 0, 1]);
        device.draw({primitiveType:ape.gfx.PrimType.LINES, numVertices:vertexBuffer.getNumVertices(), useIndexBuffer:false});
      }
    }
  };
  return {DirectionalLightComponentSystem:DirectionalLightComponentSystem};
}());
Object(ape.fw, function() {
  DirectionalLightComponentData = function() {
    this.light = null;
    this.enable = true;
    this.color = "0xffffff";
  };
  DirectionalLightComponentData.prototype = Object.create(ape.fw.ComponentData);
  DirectionalLightComponentData.prototype.constructor = DirectionalLightComponentData;
  return {DirectionalLightComponentData:DirectionalLightComponentData};
}());
editor.link.addComponentType("directionallight");
editor.link.expose({system:"directionallight", variable:"enable", displayName:"Enable", description:"Enable or disable the light", type:"boolean", defaultValue:true});
editor.link.expose({system:"directionallight", variable:"color", displayName:"Color", description:"Light color", type:"string", defaultValue:"0xffffff"});
Object.assign(ape.fw, function() {
  var _createGfxResources = function() {
    var device = Device;
    var library = device.getProgramLibrary();
    var program = library.getProgram("basic", {vertexColors:false, diffuseMapping:false});
    var format = new ape.gfx.VertexFormat;
    format.begin();
    format.addElement(new ape.gfx.VertexElement("vertex_position", 3, ape.gfx.VertexElementType.FLOAT32));
    format.end();
    var vertexBuffer = new ape.gfx.VertexBuffer(format, 32, ape.gfx.VertexBufferUsage.DYNAMIC);
    vertexData = [0, 0, 0, 0, -8, 0, -0.5, -8, 0, 0.5, -8, 0, 0.5, -8, 0, 0, -10, 0, 0, -10, 0, -0.5, -8, 0, 0, 0, -2, 0, -8, -2, -0.25, -8, -2, 0.25, -8, -2, 0.25, -8, -2, 0, -10, -2, 0, -10, -2, -0.25, -8, -2];
    var positions = new Float32Array(vertexBuffer.lock());
    for (var i = 0; i < vertexData.length; i++) {
      positions[i] = vertexData[i];
    }
    vertexBuffer.unlock();
    return {program:program, vertexBuffer:vertexBuffer};
  };
  var PointLightComponentSystem = function(context) {
    ape.fw.ComponentSystem.call(this, context);
    context.systems.add("pointlight", this);
    ape.extend(this, {_enable:function(componentData, enable) {
      if (enable !== undefined) {
        componentData.enable = enable;
        componentData.light.enable(enable);
      } else {
        return componentData.enable;
      }
    }, _color:function(componentData, color) {
      if (color) {
        var rgb = parseInt(color);
        componentData.color = [(rgb >> 16 & 255) / 255.0, (rgb >> 8 & 255) / 255.0, (rgb & 255) / 255.0];
        componentData.light.setColor(componentData.color);
      } else {
        return componentData.color;
      }
    }, _radius:function(componentData, radius) {
      if (radius) {
        componentData.radius = radius;
        componentData.light.setRadius(radius);
      } else {
        return componentData.radius;
      }
    }});
    this.renderable = _createGfxResources();
  };
  PointLightComponentSystem.prototype = Object.create(ape.fw.ComponentSystem.prototype);
  PointLightComponentSystem.prototype.constructor = PointLightComponentSystem;
  PointLightComponentSystem.prototype.createComponent = function(entity, data) {
    var componentData = new ape.fw.PointLightComponentData;
    var properties = ["enable", "color", "radius"];
    data = data || {};
    componentData.light = new ape.scene.LightNode;
    componentData.light.setType(ape.scene.LightType.POINT);
    entity.addChild(componentData.light);
    this.addComponent(entity, componentData);
    properties.forEach(function(value, index, arr) {
      if (ape.isDefined(data[value])) {
        this.set(entity, value, data[value]);
      }
    }, this);
    return componentData;
  };
  PointLightComponentSystem.prototype.deleteComponent = function(entity) {
    var data = this._getComponentData(entity);
    entity.removeChild(data.light);
    data.light.enable(false);
    delete data.light;
    this.removeComponent(entity);
  };
  PointLightComponentSystem.prototype.update = function(dt) {
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
  PointLightComponentSystem.prototype.toolsRender = function(fn) {
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
        device = ape.gfx.GraphicsDevice.getCurrent();
        device.setProgram(program);
        device.setVertexBuffer(vertexBuffer, 0);
        transform = entity.getWorldTransform();
        device.scope.resolve("matrix_model").setValue(transform);
        device.scope.resolve("constant_color").setValue([1, 1, 0, 1]);
        device.draw({primitiveType:ape.gfx.PrimType.LINES, numVertices:vertexBuffer.getNumVertices(), useIndexBuffer:false});
      }
    }
  };
  return {PointLightComponentSystem:PointLightComponentSystem};
}());
Object.assign(ape.fw, function() {
  PointLightComponentData = function() {
    this.light = null;
    this.enable = true;
    this.color = "0xffffff";
    this.radius = 1.0;
  };
  PointLightComponentData.prototype = Object.create(ape.fw.ComponentData);
  PointLightComponentData.prototype.constructor = PointLightComponentData;
  return {PointLightComponentData:PointLightComponentData};
}());
editor.link.addComponentType("pointlight");
editor.link.expose({system:"pointlight", variable:"enable", displayName:"Enable", description:"Enable or disable the light", type:"boolean", defaultValue:true});
editor.link.expose({system:"pointlight", variable:"color", displayName:"Color", description:"Light color", type:"string", defaultValue:"0xffffff"});
editor.link.expose({system:"pointlight", variable:"radius", displayName:"Radius", description:"Light radius", type:"number", defaultValue:1.0});
Object.assign(ape.fw, function() {
  var LiveLinkMessage = function(data, source) {
    data = data || {};
    this.type = data.type || ape.fw.LiveLinkMessageType.NO_TYPE;
    this.content = data.content || {};
    this.id = data.id || ape.guid.create();
    this.sendid = data.senderid || null;
    this.source = source || null;
  };
  LiveLinkMessage.prototype.register = function(type) {
    ape.fw.LiveLinkMessage[type] = type;
  };
  LiveLinkMessage.prototype.serialize = function(msg) {
    var o = {type:msg.type, content:msg.content, id:msg.id, senderid:msg.senderid};
    return JSON.stringify(o, function(key, value) {
      if (this[key] instanceof Float32Array) {
        return ape.makeArray(this[key]);
      } else {
        return this[key];
      }
    });
  };
  LiveLinkMessage.prototype.deserialize = function(data) {
    try {
      var o = JSON.parse(data);
      return o;
    } catch (e) {
      return null;
    }
  };
  return {LiveLinkMessage:LiveLinkMessage, LiveLinkMessageRegister:{}, LiveLinkMessageType:{NO_TYPE:"NO_TYPE", RECEIVED:"RECEIVED"}};
}());
Object.assign(ape.fw, function() {
  var LiveLinkCloseEntityMessage = function(id) {
    this.type = ape.fw.LiveLinkMessageType.CLOSE_ENTITY;
    this.content = {id:id};
  };
  LiveLinkCloseEntityMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
  LiveLinkCloseEntityMessage.prototype.constructor = LiveLinkCloseEntityMessage;
  ape.fw.LiveLinkMessage.prototype.register("CLOSE_ENTITY");
  return {LiveLinkCloseEntityMessage:LiveLinkCloseEntityMessage};
}());
Object.assign(ape.fw, function() {
  var LiveLink = function() {
    this._destinations = [];
    this._callbacks = {};
    this._linkid = ape.guid.create();
    this._listener = null;
    this._handler = ape.callback(this, this._handleMessage);
    window.addEventListener("message", this._handler, false);
  };
  LiveLink.prototype.detach = function() {
    this._listener = null;
    window.removeEventListener("message", thie._handler, false);
  };
  LiveLink.prototype.addDestinationWindow = function(_window) {
    this._destinations.push(_window);
  };
  LiveLink.prototype.removeDestinationWindow = function(window) {
    var i;
    for (i = 0; i < this._destinations.length; ++i) {
      if (this._destinations[i] == window) {
        this._destinations.splice(i, 1);
        break;
      }
    }
  };
  LiveLink.prototype.send = function(msg, success) {
    success = success || function() {
    };
    this._destinations.forEach(function(w, index, arr) {
      var origin = w.location.protocol + "//" + w.location.host;
      this._send(msg, success, w, origin);
    }, this);
  };
  LiveLink.prototype._send = function(msg, success, _window, origin) {
    logINFO("Send:" + msg.type);
    msg.senderid = this._linkid;
    if (this._callbacks[msg.id]) {
      this._callbacks[msg.id].count++;
    } else {
      this._callbacks[msg.id] = {count:1, callback:ape.callback(this, success)};
    }
    var data = ape.fw.LiveLinkMessage.serialize(msg);
    _winow.postMessage(data, origin);
  };
  LiveLink.prototype.listen = function(callback, _window) {
    if (this._listener) {
      throw new Error("LiveLink already listening");
    }
    this._listener = callback;
  };
  LiveLink.prototype._handleMessage = function(event) {
    var msg, newmsg;
    var data = ape.fw.LiveLinkMessage.deserialize(event.data);
    if (!data) {
      return;
    }
    msg = new ape.fw.LiveLinkMessage(data, event.source);
    if (msg.type == ape.fw.LiveLinkMessageType.RECEIVED) {
      if (msg.content.received_from == this._linkid) {
        this._callbacks[msg.content.id].count--;
        if (this._callbacks[msg.content.id].count == 0) {
          this._callbacks[msg.content.id].callback();
          delete this._callbacks[msg.content.id];
        }
      }
    } else {
      if (this._listener) {
        this._listener(msg);
        newmsg = new ape.fw.LiveLinkMessage;
        newmsg.type = ape.fw.LiveLinkMessageType.RECEIVED;
        newmsg.content = {id:msg.id, received_from:msg.senderid};
        this._send(newmsg, null, event.source, event.origin);
      } else {
      }
    }
  };
  return {LiveLink:LiveLink};
}());
Object.assign(ape.fw, function() {
  var LiveLinkOpenEntityMessage = function(models) {
    this.type = ape.fw.LiveLinkMessageType.OPEN_ENTITY;
    this.content = {models:models};
  };
  LiveLinkOpenEntityMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
  LiveLinkOpenEntityMessage.prototype.constructor = LiveLinkOpenEntityMessage;
  ape.fw.LiveLinkMessage.prototype.register("OPEN_ENTITY");
  return {LiveLinkOpenEntityMessage:LiveLinkOpenEntityMessage};
}());
Object.assign(ape.fw, function() {
  var LiveLinkUpdateComponentMessage = function(id, component, attribute, value) {
    this.type = ape.fw.LiveLinkMessageType.UPDATE_COMPONENT;
    this.content = {id:id, component:component, attribute:attribute, value:value};
  };
  LiveLinkUpdateComponentMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
  LiveLinkUpdateComponentMessage.prototype.constructor = LiveLinkUpdateComponentMessage;
  ape.fw.LiveLinkMessage.prototype.register("UPDATE_COMPONENT");
  return {LiveLinkUpdateComponentMessage:LiveLinkUpdateComponentMessage};
}());
Object.assign(ape.fw, function() {
  var LiveLinkUpdateEntityMessage = function(id, components) {
    this.type = ape.fw.LiveLinkMessageType.UPDATE_ENTITY;
    this.content = {id:id, components:components};
  };
  LiveLinkUpdateEntityMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
  LiveLinkUpdateEntityMessage.prototype.constructor = LiveLinkUpdateEntityMessage;
  ape.fw.LiveLinkMessage.prototype.register("UPDATE_ENTITY");
  var LiveLinkUpdateEntityAttributeMessage = function(id, accessor, value) {
    this.type = ape.fw.LiveLinkMessageType.UPDATE_ENTITY_ATTRIBUTE;
    this.content = {id:id, accessor:accessor, value:value};
  };
  LiveLinkUpdateEntityAttributeMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
  LiveLinkUpdateEntityAttributeMessage.prototype.constructor = LiveLinkUpdateEntityAttributeMessage;
  ape.fw.LiveLinkMessage.prototype.register("UPDATE_ENTITY_ATTRIBUTE");
  return {LiveLinkUpdateEntityMessage:LiveLinkUpdateEntityMessage, LiveLinkUpdateEntityAttributeMessage:LiveLinkUpdateEntityAttributeMessage};
}());
ape.resources = function() {
  var ResourceLoader = function(options) {
    options = options || {};
    options.maxConcurrentRequests = options.maxConcurrentRequests || 32;
    this._loading = [];
    this._pending = [];
    this._batches = [];
    this._handlers = {};
    this._requests = {};
    this._sequence = 1;
    this._batchId = 1;
    this._maxConcurrentRequests = options.maxConcurrentRequests;
  };
  ResourceLoader.prototype.registerHandler = function(RequestType, handler) {
    var request = new RequestType;
    if (request.constructor.name == "") {
      throw Error("ResourceRequests must not be anonymous functions");
    }
    this._handlers[request.constructor.name] = handler;
    handler.setLoader(this);
  };
  ResourceLoader.prototype.request = function(requests, priority, success, error, progress, options) {
    var batch = null;
    if (typeof priority == "function") {
      options = progress;
      progress = error;
      error = success;
      success = priority;
      priority = 1;
    }
    options = options || {};
    if (!requests.length) {
      requests = [requests];
    }
    batch = new RequestBatch(this._batchId++, requests, priority, success, error, progress);
    if (options.batch) {
      parent = this.getRequestBatch(options.batch);
      if (!parent) {
        throw new Error(ape.string.format("Cannot find batch with handle '{0}'", options.batch));
      }
      parent.children.push(batch);
      batch.parent = parent;
      batch.priority = parent.priority;
    }
    requests.forEach(function(request, index, arr) {
      if (this._requests[request.identifier]) {
        var existingRequest = this._requests[request.identifier];
        existingRequest.batches.push(batch);
        existingRequest.priority = Math.min(existingRequest.priority, priority);
      } else {
        request.batches = [];
        request.batches.push(batch);
        request.priority = batch.priority;
        request.sequence = this._sequence++;
        this._requests[request.identifier] = request;
        this._pending.push(request.identifier);
      }
    }, this);
    this._sort();
    this._batches.push(batch);
    this._update();
    return batch.handle;
  };
  ResourceLoader.prototype.open = function(RequestType, data, success, error, progress, options) {
    var request = new RequestType;
    return this._handlers[request.constructor.name].open(data, success, error, progress, options);
  };
  ResourceLoader.prototype.cancel = function(handle) {
    var index = 0;
    var length = this._batches.length;
    var batch;
    for (index = 0; index < length; ++index) {
      batch = this._batches[index];
      if (batch.handle == handle) {
        batch.requests.forEach(function(request, index, arr) {
          var index = this._pending.indexOf(request.identifier);
          if (index >= 0) {
            this._pending.splice(index, 1);
          }
        }, this);
      }
    }
  };
  ResourceLoader.prototype._sort = function() {
    this._pending.sort(function(a, b) {
      var s = this._requests[a].priority - this._requests[b].priority;
      if (s == 0) {
        return this._requests[a].sequence - this._requests[b].sequence;
      } else {
        return s;
      }
    }.bind(this));
  };
  ResourceLoader.prototype._update = function() {
    while (this._pending.length > 0 && this._loading.length < this._maxConcurrentRequests) {
      (function() {
        var identifier = this._pending.shift();
        var request = this._requests[identifier];
        this._loading.push(request.identifier);
        var options = {priority:request.priority, batch:request.batches[0].handle};
        var handler = this._handlers[request.constructor.name];
        handler.load(request.identifier, function(response, options) {
          delete this._requests[identifier];
          this._loading.splice(this._loading.indexOf(request.identifier), 1);
          request.batches.forEach(function(batch, index, arr) {
            var resource = handler.open(response, options);
            handler.postOpen(resource, function(resource) {
              var complete = batch.addResource(request.identifier, resource);
              if (complete) {
                this._batches.splice(this._batches.indexOf(batch), 1);
              }
            }.bind(this), function(errors) {
              if (batch.error) {
                batch.error(errors);
              }
            }, function(progress) {
              if (batch.progress) {
                batch.progress(progress);
              }
            }, options);
          }, this);
          this._update();
        }.bind(this), function(errors) {
          request.batches.forEach(function(batch, index, arr) {
            if (batch.error) {
              batch.error(errors);
            }
          }, this);
        }, function(progress) {
          request.batches.forEach(function(batch, index, arr) {
            if (batch.progress) {
              batch.progress(progress);
            }
          }, this);
        }, options);
      }).call(this);
    }
  };
  ResourceLoader.prototype.getRequestBatch = function(handle) {
    var i;
    var length = this._batches.length;
    for (i = 0; i < length; ++i) {
      if (this._batches[i].handle == handle) {
        return this._batches[i];
      }
    }
    return null;
  };
  var ResourceHandler = function() {
  };
  ResourceHandler.prototype.setLoader = function(loader) {
    this._loader = loader;
  };
  ResourceHandler.prototype.load = function(identifier, success, error, progress, options) {
    throw Error("Not implemented");
  };
  ResourceHandler.prototype.open = function(data, options) {
    throw Error("Not implemented");
  };
  ResourceHandler.prototype.postOpen = function(resource, success, error, progress, options) {
    success(resource);
  };
  var RequestBatch = function(handle, requests, priority, success, error, progress) {
    this.handle = handle;
    this.requests = requests;
    this.count = 0;
    this.resources = {};
    this.parent = null;
    this.children = [];
    this.priority = priority;
    this.success = success;
    this.error = error;
    this.progress = progress;
    this.completed = false;
  };
  RequestBatch.prototype.addResource = function(identifier, resource) {
    this.resources[identifier] = resource;
    this.count += 1;
    return this._update();
  };
  RequestBatch.prototype.getProgress = function() {
    return 100 * this._getCount() / this._getTotal();
  };
  RequestBatch.prototype.isComplete = function() {
    var i;
    var length = this.children.length;
    for (i = 0; i < length; ++i) {
      if (!this.children[i].isComplete()) {
        return false;
      }
    }
    return this.count == this.requests.length;
  };
  RequestBatch.prototype._updateProgress = function() {
    if (this.progress) {
      this.progress(this.getProgress());
    }
  };
  RequestBatch.prototype._update = function() {
    this._updateProgress();
    if (this.isComplete()) {
      this.completed = true;
      if (this.success) {
        this.success(this.resources);
      }
      if (this.parent && !this.parent.completed) {
        this.parent._update();
      }
      return true;
    }
    return false;
  };
  RequestBatch.prototype._getCount = function() {
    var count = this.count;
    var i;
    var length = this.children.length;
    for (i = 0; i < length; ++i) {
      count += this.children[i]._getCount();
    }
    return count;
  };
  RequestBatch.prototype._getTotal = function() {
    var total = this.requests.length;
    var i;
    var length = this.children.length;
    for (i = 0; i < length; ++i) {
      total += this.children[i]._getTotal();
    }
    return total;
  };
  var ResourceRequest = function ResourceRequest(identifier) {
    this.identifier = identifier;
  };
  var LoaderManager = function() {
  };
  LoaderManager.prototype.register = function(name, loader) {
    this[name] = loader;
  };
  return {ResourceLoader:ResourceLoader, ResourceHandler:ResourceHandler, ResourceRequest:ResourceRequest, LoaderManager:LoaderManager};
}();
Object.assign(ape.resources, function() {
  var ImageResourceHandler = function() {
  };
  ImageResourceHandler.prototype = Object.create(ape.resources.ResourceHandler);
  ImageResourceHandler.prototype.constructor = ImageResourceHandler;
  ImageResourceHandler.prototype.load = function(identifier, success, error, progress, options) {
    var image = new Image;
    var self = this;
    image.onload = function() {
      success(image);
    };
    image.onerror = function(event) {
      var element = event.srcElement;
      error(ape.string.format("Error loading Image from: '{0}'", element.src));
    };
    image.src = identifier;
  };
  ImageResourceHandler.prototype.open = function(data, options) {
    return data;
  };
  var ImageRequest = function ImageRequest(identifier) {
  };
  ImageRequest.prototype = Object.create(ape.resources.ResourceRequest);
  ImageRequest.prototype.constructor = ImageRequest;
  ImageRequest.prototype.type = "image";
  return {ImageResourceHandler:ImageResourceHandler, ImageRequest:ImageRequest};
}());
Object.assign(ape.resources, function() {
  var AssetResourceHandler = function(depot) {
    this._depot = depot;
  };
  AssetResourceHandler.prototype = Object.create(ape.resources.ResourceHandler);
  AssetResourceHandler.prototype.constructor = AssetResourceHandler;
  AssetResourceHandler.prototype.load = function(identifier, success, error, progress, options) {
    var guid = identifier;
    if (guid in ape.content.data) {
      success(ape.content.data[guid], options);
    } else {
      this._depot.assets.getOne(guid, function(asset) {
        success(asset, options);
      }.bind(this));
    }
  };
  AssetResourceHandler.prototype.open = function(data, options) {
    return new ape.fw.Asset(data);
  };
  var AssetRequest = function AssetRequest(identifier) {
  };
  AssetRequest.prototype = Object.create(ape.resources.ResourceRequest);
  AssetRequest.prototype.constructor = AssetRequest;
  return {AssetRequest:AssetRequest, AssetResourceHandler:AssetResourceHandler};
}());
Object.assign(ape.resources, function() {
  var EntityResourceHandler = function(registry, depot) {
    this._registry = registry;
    this._depot = depot;
  };
  EntityResourceHandler.prototype = Object.create(ape.resources.ResourceHandler);
  EntityResourceHandler.prototype.constructor = EntityResourceHandler;
  EntityResourceHandler.prototype.load = function(identifier, success, error, progress, options) {
    options = options || {};
    var guid = identifier;
    if (guid in ape.content.data) {
      success(ape.content.data[guid], options);
    } else {
      this._depot.entities.getOne(guid, function(entity) {
        success(entity, options);
      }.bind(this), function(errors) {
        error(errors);
      });
    }
  };
  EntityResourceHandler.prototype.open = function(data, options) {
    var guid = data.resource_id;
    options = options || {};
    options.priority = options.priority || 1;
    options.batch = options.batch || null;
    logINFO("Open: " + guid);
    var entity = new ape.fw.Entity;
    entity.setName(data.name);
    entity.setGuid(guid);
    entity.setLocalTransform(ape.math.mat4.clone(data.transform));
    data.labels.forEach(function(label) {
      entity.addLabel(label);
    });
    entity.__parent = data.parent;
    entity.__children = data.children;
    entity._rev = data._rev;
    entity.version = data.version;
    entity.name = data.name;
    entity.template = data.template;
    entity.setRequestBatch(options.batch);
    for (name in data.components) {
      if (data.components.hasOwnProperty(name)) {
        if (this._registry[name]) {
          component = this._registry[name].createComponent(entity, data.components[name]);
        } else {
          logWARNING(name + " Component does not exist.");
        }
      }
    }
    entity.setRequestBatch(null);
    return entity;
  };
  EntityResourceHandler.prototype.postOpen = function(entity, success, error, progress, options) {
    if (entity.__children.length) {
      var requests = [];
      entity.__children.forEach(function(guid, index, arr) {
        requests.push(new ape.resources.EntityRequest(guid));
      });
      entity.setRequestBatch(options.batch);
      this._loader.request(requests, options.priority, function(resources) {
        this.patchChildren(entity, resources);
        success(entity);
      }.bind(this), function(errors) {
        error(errors);
      }, function(pcnt) {
        progress(pcnt);
      }, options);
      entity.setRequestBatch(null);
    } else {
      success(entity);
    }
  };
  EntityResourceHandler.prototype.patchChildren = function(entity, children) {
    var child;
    for (i = 0; i < entity.__children.length; ++i) {
      child = children[entity.__children[i]];
      entity.addChild(child);
    }
    delete entity.__children;
  };
  EntityResourceHandler.prototype.patchChildren2 = function(entity, children) {
    var i;
    var child;
    function _get(guid) {
      var result = null;
      children.forEach(function(child) {
        if (child.getGuid() == guid) {
          result = child;
        }
      }, this);
      return result;
    }
    for (i = 0; i < entity.__children.length; ++i) {
      child = _get(entity.__children[i]);
      entity.addChild(child);
    }
  };
  var EntityRequest = function EntityRequest(identifier) {
  };
  EntityRequest.prototype = Object.create(ape.resources.ResourceRequest);
  EntityRequest.prototype.constructor = EntityRequest;
  return {EntityResourceHandler:EntityResourceHandler, EntityRequest:EntityRequest};
}());
ape.scene.LightType = {DIRECTIONAL:1, POINT:2, SPOT:4};
Object.assign(ape.scene, function() {
  var _activeLightsChanged = false;
  var _activeLights = [];
  _activeLights[ape.scene.LightType.DIRECTIONAL] = [];
  _activeLights[ape.scene.LightType.POINT] = [];
  _activeLights[ape.scene.LightType.SPOT] = [];
  var _globalAmbient = [0.0, 0.0, 0.0];
  var LightNode = function LightNode() {
    this._type = ape.scene.LightType.DIRECTIONAL;
    this._color = [0.8, 0.8, 0.8];
    this._radius = 1.0;
    this._coneAngle = Math.PI * 0.5;
    this._enabled = false;
  };
  LightNode.prototype = Object.create(ape.scene.GraphNode);
  LightNode.prototype.constructor = LightNode;
  LightNode.prototype.clone = function() {
    var clone = new ape.scene.LightNode;
    clone.setName(this.getName());
    clone.setLocalTransform(ape.Mat4.clone(this.getLocalTransform()));
    clone._graphId = this._graphId;
    clone.setType(this.getType());
    clone.setColor(this.getColor().splice(0));
    clone.setRadius(this.getRadius());
    return clone;
  };
  LightNode.prototype.enable = function(enable) {
    if (enable && !this._enabled) {
      switch(this._type) {
        case ape.scene.LightType.DIRECTIONAL:
        case ape.scene.LightType.POINT:
        case ape.scene.LightType.SPOT:
          _activeLights[this._type].push(this);
          _activeLights.dirty = true;
          break;
      }
      this._enabled = true;
    } else {
      if (!enable && this._enabled) {
        switch(this._type) {
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
    }
  };
  LightNode.prototype.getColor = function() {
    return this._color;
  };
  LightNode.prototype.getRadius = function() {
    return this._radius;
  };
  LightNode.prototype.getType = function() {
    return this._type;
  };
  LightNode.prototype.setColor = function(color) {
    this._color = color;
  };
  LightNode.prototype.setRadius = function(radius) {
    this._radius = radius;
  };
  LightNode.prototype.setType = function(type) {
    this._type = type;
  };
  LightNode.getGlobalAmbient = function() {
    return _globalAmbient;
  };
  LightNode.setGlobalAmbient = function(color) {
    _globalAmbient = color;
  };
  LightNode.dispatch = function() {
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
  LightNode.getNumEnabled = function(type) {
    if (type === undefined) {
      return _activeLights[ape.scene.LightType.DIRECTIONAL].length + _activeLights[ape.scene.LightType.POINT].length + _activeLights[ape.scene.LightType.SPOT].length;
    } else {
      return _activeLights[type].length;
    }
  };
  return {LightNode:LightNode};
}());
ape.extend(ape.resources, function() {
  var ScriptResourceHandler = function(context, prefix) {
    this._context = context;
    this._prefix = prefix || "";
    this._queue = [];
    this._pending = [];
    this._loaded = {};
    this._loading = null;
    ape.script.bind("created", this._onScriptCreated.bind(this));
  };
  ScriptResourceHandler.prototype.load = function(identifier, success, error, progress, options) {
    options = options || {};
    options.timeout = options.timeout || 10000;
    var url = new ape.URI(identifier);
    url.path = ape.path.join(this._prefix, url.path);
    url = url.toString();
    if (this._loaded[url]) {
      if (this._loaded[url] !== true) {
        success(this._loaded[url]);
      } else {
      }
    } else {
      if (this._loading) {
        this._queue.push({url:url.toString(), success:success, error:error, progress:progress});
      } else {
        this._addScriptTag(url.toString(), success, error, progress);
      }
    }
    if (options.timeout) {
      (function() {
        setTimeout(function() {
          if (!this._loaded[url]) {
            error(ape.string.format("Loading script {0} timed out after {1}s", url, options.timeout / 1000));
          }
        }.bind(this), options.timeout);
      }).call(this);
    }
  };
  ScriptResourceHandler.prototype.open = function(data, options) {
    return data;
  };
  ScriptResourceHandler.prototype._onScriptCreated = function(name, callback) {
    this._pending.push({name:name, callback:callback});
  };
  ScriptResourceHandler.prototype._addScriptTag = function(url, success, error, progress) {
    var self = this;
    var head = document.getElementsByTagName("head")[0];
    var element = document.createElement("script");
    this._loading = element;
    element.addEventListener("error", function(e) {
      error(ape.string.format("Error loading script from '{0}'", e.target.src));
    });
    element.onload = element.onreadystatechange = function() {
      if (!this.readyState || (this.readyState == "loaded" || this.readyState == "complete")) {
        var script = self._pending.shift();
        if (script) {
          var ScriptType = script.callback(self._context);
          if (ScriptType._pcScriptName) {
            throw Error("Attribute _pcScriptName is reserved on ScriptTypes for ResourceLoader use");
          }
          ScriptType._pcScriptName = script.name;
          self._loaded[url] = ScriptType;
          success(ScriptType);
        } else {
          self._loaded[url] = true;
        }
        self._loading = null;
        if (self._queue.length) {
          var loadable = self._queue.shift();
          self._addScriptTag(loadable.url, loadable.success, loadable.error, loadable.progress);
        }
      }
    };
    element.src = url;
    head.appendChild(element);
  };
  var ScriptRequest = function ScriptRequest() {
  };
  return {ScriptResourceHandler:ScriptResourceHandler, ScriptRequest:ScriptRequest};
}());
ape.script = function() {
  var _main = null;
  var _loader = null;
  var script = {main:function(callback) {
    if (_main) {
      throw new Error("'main' Object already registered");
    }
    _main = callback;
  }, setLoader:function(loader) {
    if (loader && _loader) {
      throw new Error("ape.script already has loader object");
    }
    _loader = loader;
  }, create:function(name, callback) {
    this.fire("created", name, callback);
  }, start:function() {
    _main();
  }};
  ape.extend(script, ape.events);
  return script;
}();
ape.shape = function() {
  var Shape = function Shape() {
  };
  Shape.prototype = {containsPoint:function(point) {
    throw new Error("Shape hasn't implemented containsPoint");
  }};
  return {Shape:Shape, Type:{CONE:"Cone", CYLINDER:"Cylinder"}};
}();
Object.assign(ape.shape, function() {
  var Frustum = function Frustum(projectionMatrix, viewMatrix) {
    projectionMatrix = projectionMatrix || ape.math.mat4.makePerspective(90.0, 16 / 9, 0.1, 1000.0);
    viewMatrix = viewMatrix || ape.math.mat4.create();
    var viewProj = ape.math.mat4.multiply(projectionMatrix, viewMatrix);
    this.planes = [];
    this.planes[0] = [];
    this.planes[0][0] = viewProj[3] - viewProj[0];
    this.planes[0][1] = viewProj[7] - viewProj[4];
    this.planes[0][2] = viewProj[11] - viewProj[8];
    this.planes[0][3] = viewProj[15] - viewProj[12];
    t = Math.sqrt(this.planes[0][0] * this.planes[0][0] + this.planes[0][1] * this.planes[0][1] + this.planes[0][2] * this.planes[0][2]);
    this.planes[0][0] /= t;
    this.planes[0][1] /= t;
    this.planes[0][2] /= t;
    this.planes[0][3] /= t;
    this.planes[1] = [];
    this.planes[1][0] = viewProj[3] + viewProj[0];
    this.planes[1][1] = viewProj[7] + viewProj[4];
    this.planes[1][2] = viewProj[11] + viewProj[8];
    this.planes[1][3] = viewProj[15] + viewProj[12];
    t = Math.sqrt(this.planes[1][0] * this.planes[1][0] + this.planes[1][1] * this.planes[1][1] + this.planes[1][2] * this.planes[1][2]);
    this.planes[1][0] /= t;
    this.planes[1][1] /= t;
    this.planes[1][2] /= t;
    this.planes[1][3] /= t;
    this.planes[2] = [];
    this.planes[2][0] = viewProj[3] + viewProj[1];
    this.planes[2][1] = viewProj[7] + viewProj[5];
    this.planes[2][2] = viewProj[11] + viewProj[9];
    this.planes[2][3] = viewProj[15] + viewProj[13];
    t = Math.sqrt(this.planes[2][0] * this.planes[2][0] + this.planes[2][1] * this.planes[2][1] + this.planes[2][2] * this.planes[2][2]);
    this.planes[2][0] /= t;
    this.planes[2][1] /= t;
    this.planes[2][2] /= t;
    this.planes[2][3] /= t;
    this.planes[3] = [];
    this.planes[3][0] = viewProj[3] - viewProj[1];
    this.planes[3][1] = viewProj[7] - viewProj[5];
    this.planes[3][2] = viewProj[11] - viewProj[9];
    this.planes[3][3] = viewProj[15] - viewProj[13];
    t = Math.sqrt(this.planes[3][0] * this.planes[3][0] + this.planes[3][1] * this.planes[3][1] + this.planes[3][2] * this.planes[3][2]);
    this.planes[3][0] /= t;
    this.planes[3][1] /= t;
    this.planes[3][2] /= t;
    this.planes[3][3] /= t;
    this.planes[4] = [];
    this.planes[4][0] = viewProj[3] - viewProj[2];
    this.planes[4][1] = viewProj[7] - viewProj[6];
    this.planes[4][2] = viewProj[11] - viewProj[10];
    this.planes[4][3] = viewProj[15] - viewProj[14];
    t = Math.sqrt(this.planes[4][0] * this.planes[4][0] + this.planes[4][1] * this.planes[4][1] + this.planes[4][2] * this.planes[4][2]);
    this.planes[4][0] /= t;
    this.planes[4][1] /= t;
    this.planes[4][2] /= t;
    this.planes[4][3] /= t;
    this.planes[5] = [];
    this.planes[5][0] = viewProj[3] + viewProj[2];
    this.planes[5][1] = viewProj[7] + viewProj[6];
    this.planes[5][2] = viewProj[11] + viewProj[10];
    this.planes[5][3] = viewProj[15] + viewProj[14];
    t = Math.sqrt(this.planes[5][0] * this.planes[5][0] + this.planes[5][1] * this.planes[5][1] + this.planes[5][2] * this.planes[5][2]);
    this.planes[5][0] /= t;
    this.planes[5][1] /= t;
    this.planes[5][2] /= t;
    this.planes[5][3] /= t;
  };
  Frustum.prototype = Object.create(ape.shape.Shape);
  Frustum.prototype.constructor = Frustum;
  Frustum.prototype.containsPoint = function(point) {
    for (var p = 0; p < 6; p++) {
      if (this.planes[p][0] * point[0] + this.planes[p][1] * point[1] + this.planes[p][2] * point[2] + this.planes[p][3] <= 0) {
        return false;
      }
    }
    return true;
  };
  Frustum.prototype.containsSphere = function(sphere) {
    var c = 0;
    var d;
    for (p = 0; p < 6; p++) {
      d = this.planes[p][0] * sphere.center[0] + this.planes[p][1] * sphere.center[1] + this.planes[p][2] * sphere.center[2] + this.planes[p][3];
      if (d <= -sphere.radius) {
        return 0;
      }
      if (d > sphere.radius) {
        c++;
      }
    }
    return c === 6 ? 2 : 1;
  };
  return {Frustum:Frustum};
}());
Object.assign(ape.shape, function() {
  var Sphere = function Sphere(center, radius) {
    this.center = center || ape.math.vec3.create(0, 0, 0);
    this.radius = radius || 1;
  };
  Sphere.prototype = Object.create(ape.shape.Shape);
  Sphere.prototype.constructor = Sphere;
  ape.shape.Type.SPHERE = "Sphere";
  Sphere.prototype.containsPoint = function(point) {
    var offset = ape.math.vec3.create();
    ape.math.vec3.subtract(point, this.center, offset);
    var length = ape.math.vec3.length(offset);
    return length < this.radius;
  };
  Sphere.prototype.compute = function(vertices) {
    var i;
    var numVerts = vertices.length / 3;
    var vertex = ape.math.vec3.create(0, 0, 0);
    var avgVertex = ape.math.vec3.create(0, 0, 0);
    var sum = ape.math.vec3.create(0, 0, 0);
    for (i = 0; i < numVerts; i++) {
      ape.math.vec3.set(vertex, vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
      ape.math.vec3.add(sum, vertex, sum);
      if (i % 100 === 0) {
        ape.math.vec3.scale(sum, 1.0 / numVerts, sum);
        ape.math.vec3.add(avgVertex, sum, avgVertex);
        ape.math.vec3.set(sum, 0.0, 0.0, 0.0);
      }
    }
    ape.math.vec3.scale(sum, 1.0 / numVerts, sum);
    ape.math.vec3.add(avgVertex, sum, avgVertex);
    ape.math.vec3.set(sum, 0.0, 0.0, 0.0);
    this.center = avgVertex;
    var maxDistSq = 0.0;
    var centerToVert = ape.math.vec3.create(0, 0, 0);
    for (i = 0; i < numVerts; i++) {
      ape.math.vec3.set(vertex, vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
      ape.math.vec3.subtract(vertex, this.center, centerToVert);
      var distSq = ape.math.vec3.dot(centerToVert, centerToVert);
      if (distSq > maxDistSq) {
        maxDistSq = distSq;
      }
    }
    this.radius = Math.sqrt(maxDistSq);
  };
  return {Sphere:Sphere};
}());
ape.content = function() {
  return {source:"", assets:null, data:{}, username:null, project:null};
}();
Object.assign(ape, function() {
  function EntityReference(parentComponent, entityPropertyName, eventConfig) {
  }
  Object.assign(EntityReference.prototype, {onParentComponentEnable:function() {
  }, hasComponent:function() {
  }, _configureEventListeners:function(externalEventConfig, internalEventConfig) {
  }, _parseEventListenerConfig:function(eventConfig, prefix, scope) {
  }, _toggleLifecycleListeners:function(onOrOff) {
  }, _onSetEntity:function(name, oldValue, newValue) {
  }, _onPostInitialize:function() {
  }});
  Object.defineProperty(EntityReference.prototype, "entity", {get:function() {
    return this._entity;
  }});
  return {EntityReference:EntityReference};
}());
Object.assign(ape, function() {
  var json = {parse:function(value, revier) {
    return JSON.parse(value, reviver);
  }, stringify:function(value, replacer, space) {
    return JSON.stringify(value, function(key, value) {
      if (this[key] instanceof Float32Array) {
        value = ape.makeArray(this[key]);
      }
      return replacer ? replacer(key, value) : value;
    }, space);
  }};
  return {json:json};
}());
Object.assign(ape, function() {
  var SortedLoopArray = function(args) {
    this._sortBy = args.sortBy;
    this.items = [];
    this.length = 0;
    this.loopIndex = -1;
    this._sortHandler = this._doSort.bind(this);
  };
  SortedLoopArray.prototype._binarySearch = function(item) {
    var left = 0;
    var right = this.items.length - 1;
    var search = item[this._sortBy];
    var middle;
    var current;
    while (left <= right) {
      middle = Math.floor((left + right) / 2);
      current = this.items[middle][this._sortBy];
      if (current <= search) {
        left = middle + 1;
      } else {
        if (current > search) {
          right = middle - 1;
        }
      }
    }
    return left;
  };
  SortedLoopArray.prototype._doSort = function(a, b) {
    var sortBy = this._sortBy;
    return a[sortBy] - b[sortBy];
  };
  SortedLoopArray.prototype.insert = function(item) {
    var index = this._binarySearch(item);
    this.items.splice(index, 0, item);
    this.length++;
    if (this.loopIndex >= index) {
      this.loopIndex++;
    }
  };
  SortedLoopArray.prototype.append = function(item) {
    this.items.push(item);
    this.length++;
  };
  SortedLoopArray.prototype.remove = function(item) {
    var idx = this.items.indexOf(item);
    if (idx < 0) {
      return;
    }
    this.items.splice(idx, 1);
    this.length--;
    if (this.loopIndex >= idx) {
      this.loopIndex--;
    }
  };
  SortedLoopArray.prototype.sort = function() {
    var current = this.loopIndex >= 0 ? this.items[this.loopIndex] : null;
    this.items.sort(this._sortHandler);
    if (current !== null) {
      this.loopIndex = this.items.indexOf(current);
    }
  };
  return {SortedLoopArray:SortedLoopArray};
}());
(function() {
  var enums = {ACTION_MOUSE:"mouse", ACTION_KEYBOARD:"keyboard", ACTION_GAMEPAD:"gamepad", AXIS_MOUSE_X:"mousex", AXIS_MOUSE_Y:"mousey", AXIS_PAD_L_X:"padlx", AXIS_PAD_L_Y:"padly", AXIS_PAD_R_X:"padrx", AXIS_PAD_R_Y:"padry", AXIS_KEY:"key", EVENT_KEYDOWN:"keydown", EVENT_KEYUP:"keyup", EVENT_MOUSEDOWN:"mousedown", EVENT_MOUSEMOVE:"mousemove", EVENT_MOUSEUP:"mouseup", EVENT_MOUSEWHEEL:"mousewheel", EVENT_TOUCHSTART:"touchstart", EVENT_TOUCHEND:"touchend", EVENT_TOUCHMOVE:"touchmove", EVENT_TOUCHCANCEL:"touchcancel", 
  KEY_BACKSPACE:8, KEY_TAB:9, KEY_RETURN:13, KEY_ENTER:13, KEY_SHIFT:16, KEY_CONTROL:17, KEY_ALT:18, KEY_PAUSE:19, KEY_CAPS_LOCK:20, KEY_ESCAPE:27, KEY_SPACE:32, KEY_PAGE_UP:33, KEY_PAGE_DOWN:34, KEY_END:35, KEY_HOME:36, KEY_LEFT:37, KEY_UP:38, KEY_RIGHT:39, KEY_DOWN:40, KEY_PRINT_SCREEN:44, KEY_INSERT:45, KEY_DELETE:46, KEY_0:48, KEY_1:49, KEY_2:50, KEY_3:51, KEY_4:52, KEY_5:53, KEY_6:54, KEY_7:55, KEY_8:56, KEY_9:57, KEY_SEMICOLON:59, KEY_EQUAL:61, KEY_A:65, KEY_B:66, KEY_C:67, KEY_D:68, KEY_E:69, 
  KEY_F:70, KEY_G:71, KEY_H:72, KEY_I:73, KEY_J:74, KEY_K:75, KEY_L:76, KEY_M:77, KEY_N:78, KEY_O:79, KEY_P:80, KEY_Q:81, KEY_R:82, KEY_S:83, KEY_T:84, KEY_U:85, KEY_V:86, KEY_W:87, KEY_X:88, KEY_Y:89, KEY_Z:90, KEY_WINDOWS:91, KEY_CONTEXT_MENU:93, KEY_NUMPAD_0:96, KEY_NUMPAD_1:97, KEY_NUMPAD_2:98, KEY_NUMPAD_3:99, KEY_NUMPAD_4:100, KEY_NUMPAD_5:101, KEY_NUMPAD_6:102, KEY_NUMPAD_7:103, KEY_NUMPAD_8:104, KEY_NUMPAD_9:105, KEY_MULTIPLY:106, KEY_ADD:107, KEY_SEPARATOR:108, KEY_SUBTRACT:109, KEY_DECIMAL:110, 
  KEY_DIVIDE:111, KEY_F1:112, KEY_F2:113, KEY_F3:114, KEY_F4:115, KEY_F5:116, KEY_F6:117, KEY_F7:118, KEY_F8:119, KEY_F9:120, KEY_F10:121, KEY_F11:122, KEY_F12:123, KEY_COMMA:188, KEY_PERIOD:190, KEY_SLASH:191, KEY_OPEN_BRACKET:219, KEY_BACK_SLASH:220, KEY_CLOSE_BRACKET:221, KEY_META:224, MOUSEBUTTON_NONE:-1, MOUSEBUTTON_LEFT:0, MOUSEBUTTON_MIDDLE:1, MOUSEBUTTON_RIGHT:2, PAD_1:0, PAD_2:1, PAD_3:2, PAD_4:3, PAD_FACE_1:0, PAD_FACE_2:1, PAD_FACE_3:2, PAD_FACE_4:3, PAD_L_SHOULDER_1:4, PAD_R_SHOULDER_1:5, 
  PAD_L_SHOULDER_2:6, PAD_R_SHOULDER_2:7, PAD_SELECT:8, PAD_START:9, PAD_L_STICK_BUTTON:10, PAD_R_STICK_BUTTON:11, PAD_UP:12, PAD_DOWN:13, PAD_LEFT:14, PAD_RIGHT:15, PAD_VENDOR:16, PAD_L_STICK_X:0, PAD_L_STICK_Y:1, PAD_R_STICK_X:2, PAD_R_STICK_Y:3};
  Object.assign(ape, enums);
})();
Object.assign(ape, function() {
  var MouseEvent = function(mouse, event) {
    var coords = {x:0, y:0};
    if (event) {
      if (event instanceof MouseEvent) {
        throw Error("Expected MouseEvent");
      }
      coords = mouse._getTargetCoords(event);
    } else {
      event = {};
    }
    if (coords) {
      this.x = coords.x;
      this.y = coords.y;
    } else {
      if (ape.Mouse.isPointerLocked()) {
        this.x = 0;
        this.y = 0;
      } else {
        return;
      }
    }
    if (event.detail) {
      this.wheel = -1 * event.detail;
    } else {
      if (event.wheelDelta) {
        this.wheel = event.wheelDelta / 120;
      } else {
        this.wheel = 0;
      }
    }
    if (ape.Mouse.isPointerLocked()) {
      this.dx = event.movementX || event.webkitMovementX || event.mozMovementX || 0;
      this.dy = event.movementY || event.webkitMovementY || event.mozMovementY || 0;
    } else {
      this.dx = this.x - mouse._lastX;
      this.dy = this.y - mouse._lastY;
    }
    if (event.type === "mousedown" || event.type === "mouseup") {
      this.button = event.button;
    } else {
      this.button = ape.MOUSEBUTTON_NONE;
    }
    this.buttons = mouse._buttons.slice(0);
    this.element = event.target;
    this.ctrlKey = event.ctrlKey || false;
    this.altKey = event.altKey || false;
    this.shiftKey = event.shiftKey || false;
    this.metaKey = event.metaKey || false;
    this.event = event;
  };
  "use strict";
  var Mouse = function(element) {
    this._lastX = 0;
    this._lastY = 0;
    this._buttons = [false, false, false];
    this._lastbuttons = [false, false, false];
    this._upHandler = this._handleUp.bind(this);
    this._downHandler = this._handleDown.bind(this);
    this._moveHandler = this._handleMove.bind(this);
    this._wheelHandler = this._handleWheel.bind(this);
    this._contextMenuHandler = function(event) {
      event.preventDefault();
    };
    this._target = null;
    this._attached = false;
    this.attach(element);
    ape.events.attach(this);
  };
  Mouse.isPointerLocked = function() {
    return !!(document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement);
  };
  Object.assign(Mouse.prototype, {attach:function(element) {
    this._target = element;
    if (this._attached) {
      return;
    }
    this._attached = true;
    window.addEventListener("mouseup", this._upHandler, false);
    window.addEventListener("mousedown", this._downHandler, false);
    window.addEventListener("mousemove", this._moveHandler, false);
    window.addEventListener("mousewheel", this._wheelHandler, false);
    window.addEventListener("DOMMouseScroll", this._wheelHandler, false);
  }, detach:function() {
    if (!this._attached) {
      return;
    }
    this._attached = false;
    this._target = null;
    window.removeEventListener("mouseup", this._upHandler);
    window.removeEventListener("mousedown", this._downHandler);
    window.removeEventListener("mousemove", this._moveHandler);
    window.removeEventListener("mousewheel", this._wheelHandler);
    window.removeEventListener("DOMMouseScroll", this._wheelHandler);
  }, disableContextMenu:function() {
    if (!this._target) {
      return;
    }
    this._target.addEventListener("contextmenu", this._contextMenuHandler);
  }, enableContextMenu:function() {
    if (!this._target) {
      return;
    }
    this._target.removeEventListener("contextmenu", this._contextMenuHandler);
  }, enablePointerLock:function(success, error) {
    if (!document.body.requestPointerLock) {
      if (error) {
        error();
      }
      return;
    }
    var s = function() {
      success();
      document.removeEventListener("pointerlockchange", s);
    };
    var e = function() {
      error();
      document.removeEventListener("pointerlockerror", e);
    };
    if (success) {
      document.addEventListener("pointerlockchange", s, false);
    }
    if (error) {
      document.addEventListener("pointerlockerror", e, false);
    }
    document.body.requestPointerLock();
  }, disablePointerLock:function(success) {
    if (!document.exitPointerLock) {
      return;
    }
    var s = function() {
      success();
      document.removeEventListener("pointerlockchange", s);
    };
    if (success) {
      document.addEventListener("pointerlockchange", s, false);
    }
    document.exitPointerLock();
  }, update:function() {
    this._lastbuttons[0] = this._buttons[0];
    this._lastbuttons[1] = this._buttons[1];
    this._lastbuttons[2] = this._buttons[2];
  }, isPressed:function(button) {
    return this._buttons[button];
  }, wasPressed:function(button) {
    return this._buttons[button] && !this._lastbuttons[button];
  }, wasReleased:function(button) {
    return !this._buttons[button] && this._lastbuttons[button];
  }, _handleUp:function(event) {
    this._buttons[event.button] = false;
    var e = new MouseEvent(this, event);
    if (!e.event) {
      return;
    }
    this.fire(ape.EVENT_MOUSEUP, e);
  }, _handleDown:function(event) {
    this._buttons[event.button] = true;
    var e = new MouseEvent(this, event);
    if (!e.event) {
      return;
    }
    this.fire(ape.EVENT_MOUSEDOWN, e);
  }, _handleMove:function(event) {
    var e = new MouseEvent(this, event);
    if (!e.event) {
      return;
    }
    this.fire(ape.EVENT_MOUSEMOVE, e);
    this._lastX = e.x;
    this._lastY = e.y;
  }, _handleWheel:function(event) {
    var e = new MouseEvent(this, event);
    if (!e.event) {
      return;
    }
    this.fire(ape.EVENT_MOUSEWHEEL, e);
  }, _getTargetCoords:function(event) {
    var rect = this._target.getBoundingClientRect();
    var left = Math.floor(rect.left);
    var top = Math.floor(rect.top);
    if (event.clientX < left || event.clientX >= left + this._target.clientWidth || event.clientY < top || event.clientY >= top + this._target.clientHeight) {
      return null;
    }
    return {x:event.clientX - left, y:event.clientY - top};
  }});
  return {Mouse:Mouse, MouseEvent:MouseEvent};
}());
Object.assign(ape, function() {
  var KeyboardEvent = function(keyboard, event) {
    if (event) {
      this.key = event.keyCode;
      this.element = event.target;
      this.event = event;
    } else {
      this.key = null;
      this.element = null;
      this.event = null;
    }
  };
  var _keyboardEvent = new KeyboardEvent;
  function makeKeyboardEvent(event) {
    _keyboardEvent.key = event.keyCode;
    _keyboardEvent.element = event.target;
    _keyboardEvent.event = event;
    return _keyboardEvent;
  }
  function toKeyCode(s) {
    if (typeof s === "string") {
      return s.toUpperCase().charCodeAt(0);
    }
    return s;
  }
  var _keyCodeToKeyIdentifier = {9:"Tab", 13:"Enter", 16:"Shift", 17:"Control", 18:"Alt", 27:"Escape", 37:"Left", 38:"Up", 39:"Right", 40:"Down", 46:"Delete", 91:"Win"};
  var Keyboard = function(element, options) {
    options = options || {};
    this._element = null;
    this._keyDownHandler = this._handleKeyDown.bind(this);
    this._keyUpHandler = this._handleKeyUp.bind(this);
    this._keyPressHandler = this._handleKeyPress.bind(this);
    ape.events.attach(this);
    this._keymap = {};
    this._lastmap = {};
    if (element) {
      this.attach(element);
    }
    this.preventDefault = options.preventDefault || false;
    this.stopPropagation = options.stopPropagation || false;
  };
  Keyboard.prototype.attach = function(element) {
    if (this._element) {
      this.detach();
    }
    this._element = element;
    this._element.addEventListener("keydown", this._keyDownHandler, false);
    this._element.addEventListener("keypress", this._keyPressHandler, false);
    this._element.addEventListener("keyup", this._keyUpHandler, false);
  };
  Keyboard.prototype.detach = function() {
    this._element.removeEventListener("keydown", this._keyDownHandler);
    this._element.removeEventListener("keypress", this._keyPressHandler);
    this._element.removeEventListener("keyup", this._keyUpHandler);
    this._element = null;
  };
  Keyboard.prototype.toKeyIdentifier = function(keyCode) {
    keyCode = toKeyCode(keyCode);
    var count;
    var hex;
    var length;
    var id = _keyCodeToKeyIdentifier[keyCode.toString()];
    if (id) {
      return id;
    }
    hex = keyCode.toString(16).toUpperCase();
    length = hex.length;
    for (count = 0; count < 4 - length; count++) {
      hex = "0" + hex;
    }
    return "U+" + hex;
  };
  Keyboard.prototype._handleKeyDown = function(event) {
    var code = event.keyCode || event.charCode;
    if (code === undefined) {
      return;
    }
    var id = this.toKeyIdentifier(code);
    this._keymap[id] = true;
    this.fire("keydown", makeKeyboardEvent(event));
    if (this.preventDefault) {
      event.preventDefault();
    }
    if (this.stopPropagation) {
      event.stopPropagation();
    }
  };
  Keyboard.prototype._handleKeyUp = function(event) {
    var code = event.keyCode || event.charCode;
    if (code === undefined) {
      return;
    }
    var id = this.toKeyIdentifier(code);
    delete this._keymap[id];
    this.fire("keyup", makeKeyboardEvent(event));
    if (this.preventDefault) {
      event.preventDefault();
    }
    if (this.stopPropagation) {
      event.stopPropagation();
    }
  };
  Keyboard.prototype._handleKeyPress = function(event) {
    this.fire("keypress", makeKeyboardEvent(event));
    if (this.preventDefault) {
      event.preventDefault();
    }
    if (this.stopPropagation) {
      event.stopPropagation();
    }
  };
  Keyboard.prototype.update = function() {
    var prop;
    for (prop in this._lastmap) {
      delete this._lastmap[prop];
    }
    for (prop in this._keymap) {
      if (this._keymap.hasOwnProperty(prop)) {
        this._lastmap[prop] = this._keymap[prop];
      }
    }
  };
  Keyboard.prototype.isPressed = function(key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);
    return !!this._keymap[id];
  };
  Keyboard.prototype.wasPressed = function(key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);
    return !!this._keymap[id] && !!!this._lastmap[id];
  };
  Keyboard.prototype.wasReleased = function(key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);
    return !!!this._keymap[id] && !!this._lastmap[id];
  };
  return {Keyboard:Keyboard, KeyboardEvent:KeyboardEvent};
}());
Object.assign(ape, function() {
  var GamePads = function() {
    this.gamepadsSupported = !!navigator.getGamepads || !!navigator.webkitGetGamepads;
    this.current = [];
    this.previous = [];
    this.deadZone = 0.25;
  };
  var MAPS = {DEFAULT:{buttons:["PAD_FACE_1", "PAD_FACE_2", "PAD_FACE_3", "PAD_FACE_4", "PAD_L_SHOULDER_1", "PAD_R_SHOULDER_1", "PAD_L_SHOULDER_2", "PAD_R_SHOULDER_2", "PAD_SELECT", "PAD_START", "PAD_L_STICK_BUTTON", "PAD_R_STICK_BUTTON", "PAD_UP", "PAD_DOWN", "PAD_LEFT", "PAD_RIGHT", "PAD_VENDOR"], axes:["PAD_L_STICK_X", "PAD_L_STICK_Y", "PAD_R_STICK_X", "PAD_R_STICK_Y"]}, PS3:{buttons:["PAD_FACE_1", "PAD_FACE_2", "PAD_FACE_4", "PAD_FACE_3", "PAD_L_SHOULDER_1", "PAD_R_SHOULDER_1", "PAD_L_SHOULDER_2", 
  "PAD_R_SHOULDER_2", "PAD_SELECT", "PAD_START", "PAD_L_STICK_BUTTON", "PAD_R_STICK_BUTTON", "PAD_UP", "PAD_DOWN", "PAD_LEFT", "PAD_RIGHT", "PAD_VENDOR"], axes:["PAD_L_STICK_X", "PAD_L_STICK_Y", "PAD_R_STICK_X", "PAD_R_STICK_Y"]}};
  var PRODUCT_CODES = {"Product: 0268":"PS3"};
  Object.assign(GamePads.prototype, {update:function() {
    var i, j, l;
    var buttons, buttonsLen;
    for (i = 0, l = this.current.length; i < l; i++) {
      buttons = this.current[i].pad.buttons;
      buttonsLen = buttons.length;
      for (j = 0; j < buttonsLen; j++) {
        if (this.previous[i] === undefined) {
          this.previous[i] = [];
        }
        this.previous[i][j] = buttons[j].pressed;
      }
    }
    var pads = this.poll();
    for (i = 0, l = pads.length; i < l; i++) {
      this.current[i] = pads[i];
    }
  }, poll:function() {
    var pads = [];
    if (this.gamepadsSupported) {
      var padDevices = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads();
      var i, len = padDevices.length;
      for (i = 0; i < len; i++) {
        if (padDevices[i]) {
          pads.push({map:this.getMap(padDevices[i]), pad:padDevices[i]});
        }
      }
    }
    return pads;
  }, getMap:function(pad) {
    for (var code in PRODUCT_CODES) {
      if (pad.id.indexOf(code) >= 0) {
        return MAPS[PRODUCT_CODES[code]];
      }
    }
    return MAPS.DEFAULT;
  }, isPressed:function(index, button) {
    if (!this.current[index]) {
      return false;
    }
    var key = this.current[index].map.buttons[button];
    return this.current[index].pad.buttons[ape[key]].pressed;
  }, wasPressed:function(index, button) {
    if (!this.current[index]) {
      return false;
    }
    var key = this.current[index].map.buttons[button];
    var i = ape[key];
    return this.current[index].pad.buttons[i].pressed && !this.previous[index][i];
  }, getAxis:function(index, axes) {
    if (!this.current[index]) {
      return false;
    }
    var key = this.current[index].map.axes[axes];
    var value = this.current[index].pad.axes[ape[key]];
    if (Math.abs(value) < this.deadZone) {
      value = 0;
    }
    return value;
  }});
  return {GamePads:GamePads};
}());
Object.assign(ape, function() {
  var Touch = function(touch) {
    var coords = ape.getTouchTargetCoords(touch);
    this.id = touch.identifier;
    this.x = coords.x;
    this.y = coords.y;
    this.target = touch.target;
    this.touch = touch;
  };
  var TouchEvent = function(device, event) {
    this.element = event.target;
    this.event = event;
    this.touches = [];
    this.changeTouches = [];
    if (event) {
      var i, l = event.touches.length;
      for (i = 0; i < l; i++) {
        this.touches.push(new Touch(event.touches[i]));
      }
      l = event.changedTouches.length;
      for (i = 0; i < l; i++) {
        this.changedTouches.push(new Touch(event.changedTouches[i]));
      }
    }
  };
  Object.assign(TouchEvent.prototype, {getTouchById:function(id, list) {
    var i, l = list.length;
    for (i = 0; i < l; i++) {
      if (list[i].id === id) {
        return list[i];
      }
    }
    return null;
  }});
  var TouchDevice = function(element) {
    this._element = null;
    this._startHandler = this._handleTouchStart.bind(this);
    this._endHandler = this._handleTouchEnd.bind(this);
    this._moveHandler = this._handleTouchMove.bind(this);
    this._cancelHandler = this._handleTouchCancel.bind(this);
    this.attach(element);
    ape.events.attach(this);
  };
  Object.assign(TouchDevice.prototype, {attach:function(element) {
    if (this._element) {
      this.detach();
    }
    this._element = element;
    this._element.addEventListener("touchstart", this._startHandler, false);
    this._element.addEventListener("touchend", this._endHandler, false);
    this._element.addEventListener("touchmove", this._moveHandler, false);
    this._element.addEventListener("touchcancel", this._cancelHandler, false);
  }, detach:function() {
    if (this._element) {
      this._element.removeEventListener("touchstart", this._startHandler, false);
      this._element.removeEventListener("touchend", this._endHandler, false);
      this._element.removeEventListener("touchmove", this._moveHandler, false);
      this._element.removeEventListener("touchcancel", this._cancelHandler, false);
    }
    this._element = null;
  }, _handleTouchStart:function(e) {
    this.fire("touchstart", new TouchEvent(this, e));
  }, _handleTouchEnd:function(e) {
    this.fire("touchend", new TouchEvent(this, e));
  }, _handleTouchMove:function(e) {
    e.preventDefault();
    this.fire("touchmove", new TouchEvent(this, e));
  }, _handleTouchCancel:function(e) {
    this.fire("touchcancel", new TouchEvent(this, e));
  }});
  return {getTouchTargetCoords:function(touch) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var target = touch.target;
    while (!(target instanceof HTMLElement)) {
      target = target.parentNode;
    }
    var currentElement = target;
    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent;
    } while (currentElement);
    return {x:touch.pageX - totalOffsetX, y:touch.pageY - totalOffsetY};
  }, TouchDevice:TouchDevice, TouchEvent:TouchEvent};
}());
Object.assign(ape, function() {
  var Controller = function(element, options) {
    options = options || {};
    this._keyboard = options.keyboard || null;
    this._mouse = options.mouse || null;
    this._gamepads = options.gamepads || null;
    this._element = null;
    this._actions = {};
    this._axes = {};
    this._axesValues = {};
    if (element) {
      this.attach(element);
    }
  };
  Controller.prototype.attach = function(element) {
    this._element = element;
    if (this._keyboard) {
      this._keyboard.attach(element);
    }
    if (this._mouse) {
      this._mouse.attach(element);
    }
  };
  Controller.prototype.detach = function() {
    if (this._keyboard) {
      this._keyboard.detach();
    }
    if (this._mouse) {
      this._mouse.detach();
    }
    this._element = null;
  };
  Controller.prototype.disableContextMenu = function() {
    if (!this._mouse) {
      this._enableMouse();
    }
    this._mouse.disableContextMenu();
  };
  Controller.prototype.enableContextMenu = function() {
    if (!this._mouse) {
      this._enableMouse();
    }
    this._mouse.enableContextMenu();
  };
  Controller.prototype.update = function(dt) {
    if (this._keyboard) {
      this._keyboard.update(dt);
    }
    if (this._mouse) {
      this._mouse.update(dt);
    }
    if (this._gamepads) {
      this._gamepads.update(dt);
    }
    this._axesValues = {};
    for (var key in this._axes) {
      this._axesValues[key] = [];
    }
  };
  Controller.prototype.registerKeys = function(action, keys) {
    if (!this._keyboard) {
      this._enableKeyboard();
    }
    if (this._actions[action]) {
      throw new Error(ape.string.format("Action: {0} already registered", action));
    }
    if (keys === undefined) {
      throw new Error("Invalid button");
    }
    if (!keys.length) {
      keys = [keys];
    }
    if (this._actions[action]) {
      this._actions[action].push({type:ape.ACTION_KEYBOARD, keys:keys});
    } else {
      this._actions[action] = [{type:ape.ACTION_KEYBOARD, keys:keys}];
    }
  };
  Controller.prototype.registerMouse = function(action, button) {
    if (!this._mouse) {
      this._enableMouse();
    }
    if (button === undefined) {
      throw new Error("Invalid button");
    }
    if (this._actions[action]) {
      this._actions[action].push({type:ape.ACTION_MOUSE, button:button});
    } else {
      this._actions[action] = [{type:ape.ACTION_MOUSE, button:-button}];
    }
  };
  Controller.prototype.registerPadButton = function(action, pad, button) {
    if (button === undefined) {
      throw new Error("Invalid button");
    }
    if (this._actions[action]) {
      this._actions[action].push({type:ape.ACTION_GAMEPAD, button:button, pad:pad});
    } else {
      this._actions[action] = [{type:ape.ACTION_GAMEPAD, button:button, pad:pad}];
    }
  };
  Controller.prototype.registerAxis = function(options) {
    var name = options.name;
    if (!this._axes[name]) {
    }
    var i = this._axes[name].push(name);
    options = option || {};
    options.pad = options.pad || ape.PAD_1;
    var bind = function(controller, source, value, key) {
      switch(source) {
        case "mousex":
          controller._mouse.on(ape.EVENT_MOUSEMOVE, function(e) {
            controller._axesValues[name][i] = e.dx / 10;
          });
          break;
        case "mousey":
          controller._mouse.on(ape.EVENT_MOUSEMOVE, function(e) {
            controller._axesValues[name][i] = e.dy / 10;
          });
          break;
        case "key":
          controller._axes[name].push(function() {
            return controller._keyboard.isPressed(key) ? value : 0;
          });
          break;
        case "padrx":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, ape.PAD_R_STICK_X);
          });
          break;
        case "padry":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, ape.PAD_R_STICK_Y);
          });
          break;
        case "padlx":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, ape.PAD_L_STICK_X);
          });
          break;
        case "padly":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, ape.PAD_L_STICK_Y);
          });
          break;
        default:
          throw new Error("Unknown axis");
      }
    };
    bind(this, options.positive, 1, options.positiveKey);
    if (options.negativeKey || options.negative !== options.positive) {
      bind(this, options.negative, -1, options.negativeKey);
    }
  };
  Controller.prototype.isPressed = function(actionName) {
    if (!this._actions[actionName]) {
      return false;
    }
    var action;
    var index = 0;
    var length = this._actions[actionName].length;
    for (index = 0; index < length; ++index) {
      action = this._actions[actionName][index];
      switch(action.type) {
        case ape.ACTION_KEYBOARD:
          if (this._keyboard) {
            var i, len = action.keys.length;
            for (i = 0; i < len; i++) {
              if (this._keyboard.isPressed(action.keys[i])) {
                return true;
              }
            }
          }
          break;
        case ape.ACTION_MOUSE:
          if (this._mouse && this._mouse.isPressed(action.button)) {
            return true;
          }
          break;
        case ape.ACTION_GAMEPAD:
          if (this._gamepads && this._gamepads.isPressed(action.pad, action.button)) {
            return true;
          }
          break;
      }
    }
    return false;
  };
  Controller.prototype.wasPressed = function(actionName) {
    if (!this._actions[actionName]) {
      return false;
    }
    var index = 0;
    var length = this._actions[actionName].length;
    for (index = 0; index < length; ++index) {
      var action = this._actions[actionName][index];
      switch(action.type) {
        case ape.ACTION_KEYBOARD:
          if (this._keyboard) {
            var i, len = action.keys.length;
            for (i = 0; i < len; i++) {
              if (this._keyboard.wasPressed(action.keys[i])) {
                return true;
              }
            }
          }
          break;
        case ape.ACTION_MOUSE:
          if (this._mouse && this._mouse.wasPressed(action.button)) {
            return true;
          }
          break;
        case ape.ACTION_GAMEPAD:
          if (this._gamepads && this._gamepads.wasPressed(action.pad, action.button)) {
            return true;
          }
          break;
      }
    }
    return false;
  };
  Controller.prototype.getAxis = function(name) {
    var value = 0;
    if (this._axes[name]) {
      var i, len = this._axes[name].length;
      for (i = 0; i < len; i++) {
        if (ape.type(this._axes[name][i]) === "function") {
          var v = this._axes[name][i]();
          if (Math.abs(v) > Math.abs(value)) {
            value = v;
          }
        } else {
          if (this._axesValues[name]) {
            if (Math.abs(this._axesValues[name][i]) > Math.abs(value)) {
              value = this._axesValues[name][i];
            }
          }
        }
      }
    }
    return value;
  };
  Controller.prototype._enableMouse = function() {
    this._mouse = new ape.Mouse;
    if (!this._element) {
      throw new Error("Controller must be attached to an Element");
    }
    this._mouse.attach(this._element);
  };
  Controller.prototype._enableKeyboard = function() {
    this._keyboard = new ape.Keyboard;
    if (!this._element) {
      throw new Error("Controller must be attached to an Element");
    }
    this._keyboard.attach(this._element);
  };
  return {Controller:Controller};
}());
Object.assign(ape, function() {
  var targetX, targetY;
  var vecA = new ape.Vec3;
  var vecB = new ape.Vec3;
  var _pq = new ape.Vec3;
  var _pa = new ape.Vec3;
  var _pb = new ape.Vec3;
  var _pc = new ape.Vec3;
  var _pd = new ape.Vec3;
  var _m = new ape.Vec3;
  var _sct = new ape.Vec3;
  var _accumulatedScale = new ape.Vec2;
  var _paddingTop = new ape.Vec3;
  var _paddingBottom = new ape.Vec3;
  var _paddingLeft = new ape.Vec3;
  var _paddingRight = new ape.Vec3;
  var _cornerBottomLeft = new ape.Vec3;
  var _cornerBottomRight = new ape.Vec3;
  var _cornerTopRight = new ape.Vec3;
  var _cornerTopLeft = new ape.Vec3;
  var ZERO_VEC4 = new ape.Vec4;
  var scalarTriple = function(p1, p2, p3) {
    return _sct.cross(p1, p2).dot(p3);
  };
  var intersectLineQuad = function(p, q, corners) {
    _pq.sub2(q, p);
    _pa.sub2(corners[0], p);
    _pb.sub2(corners[1], p);
    _pc.sub2(corners[2], p);
    _m.cross(_pc, _pq);
    var v = _pa.dot(_m);
    if (v >= 0) {
      if (-_pb.dot(_m) < 0) {
        return false;
      }
      if (scalarTriple(_pq, _pb, _pa) < 0) {
        return false;
      }
    } else {
      _pd.sub2(corners[3], p);
      if (_pd.dot(_m) < 0) {
        return false;
      }
      if (scalarTriple(_pq, _pa, _pd) < 0) {
        return false;
      }
    }
    if (_pq.sub2(corners[0], corners[2]).lengthSq() < 0.0001 * 0.0001) {
      return false;
    }
    if (_pq.sub2(corners[1], corners[3]).lengthSq() < 0.0001 * 0.0001) {
      return false;
    }
    return true;
  };
  var ElementInputEvent = function(event, element, camera) {
    this.event = event;
    this.element = element;
    this.camera = camera;
    this._stopPropagation = false;
  };
  Object.assign(ElementInputEvent.prototype, {stopPropagation:function() {
    this._stopPropagation = true;
    this.event.stopImmediatePropagation();
    this.event.stopPropagation();
  }});
  var ElementMouseEvent = function(event, element, camera, x, y, lastX, lastY) {
    ElementInputEvent.call(this, event, element, camera);
    this.x = x;
    this.y = y;
    this.ctrlKey = event.ctrlKey || false;
    this.altKey = event.altKey || false;
    this.shiftKey = event.shiftKey || false;
    this.metaKey = event.metaKey || false;
    this.button = event.button;
    if (ape.Mouse.isPointerLocked()) {
      this.dx = event.movementX || event.webkitMovementX || event.mozMovementX || 0;
      this.dy = event.movementY || event.webkitMovementY || event.mozMovementY || 0;
    } else {
      this.dx = x - lastX;
      this.dy = y - lastY;
    }
    if (event.detail) {
      this.wheel = -1 * event.detail;
    } else {
      if (event.wheelDelta) {
        this.wheel = event.wheelDelta / 120;
      } else {
        this.wheel = 0;
      }
    }
  };
  ElementMouseEvent.prototype = Object.create(ElementInputEvent.prototype);
  ElementMouseEvent.prototype.constructor = ElementMouseEvent;
  var ElementTouchEvent = function(event, element, camera, x, y, input) {
    ElementInputEvent.call(this, event, element, camera);
    this.touches = event.touches;
    this.changedTouches = event.changedTouches;
    this.x = x;
    this.y = y;
  };
  ElementTouchEvent.prototype = Object.create(ElementInputEvent.prototype);
  ElementTouchEvent.prototype.constructor = ElementTouchEvent;
  var ElementInput = function(domElement, options) {
    this._app = null;
    this._attached = false;
    this._target = null;
    this._enabled = true;
    this._lastX = 0;
    this._lastY = 0;
    this._upHandler = this._handleUp.bind(this);
    this._downHandler = this._handleDown.bind(this);
    this._moveHandler = this._handleMove.bind(this);
    this._wheelHandler = this._handleWheel.bind(this);
    this._touchstartHandler = this._handleTouchStart.bind(this);
    this._touchendHandler = this._handleTouchEnd.bind(this);
    this._touchcancelHandler = this._touchendHandler;
    this._touchmoveHandler = this._handleTouchMove.bind(this);
    this._sortHandler = this._sortElements.bind(this);
    this._elements = [];
    this._hoveredElement = null;
    this._pressedElement = null;
    this._touchedElements = {};
    this._touchesForWhichTouchLeaveHasFired = {};
    this._useMouse = !options || options.useMouse !== false;
    this._useTouch = !options || options.useTouch !== false;
    if (ape.platform.touch) {
      this._clickedEntities = {};
    }
    this.attach(domElement, options);
  };
  Object.assign(ElementInput.prototype, {attach:function(domElement) {
    if (this._attached) {
      this._attached = false;
      this.detach();
    }
    this._target = domElement;
    this._attached = true;
    if (this._useMouse) {
      window.addEventListener("mouseup", this._upHandler, {passive:true});
      window.addEventListener("mousedown", this._downHandler, {passive:true});
      window.addEventListener("mousemove", this._moveHandler, {passive:true});
      window.addEventListener("mousewheel", this._wheelHandler, {passive:true});
      window.addEventListener("DOMMouseScroll", this._wheelHandler, {passive:true});
    }
    if (this._useTouch && ape.platform.touch) {
      this._target.addEventListener("touchstart", this._touchstartHandler, {passive:true});
      this._target.addEventListener("touchend", this._touchendHandler, false);
      this._target.addEventListener("touchmove", this._touchmoveHandler, false);
      this._target.addEventListener("touchcancel", this._touchcancelHandler, false);
    }
  }, detach:function() {
    if (!this._attached) {
      return;
    }
    this._attached = false;
    if (this._useMouse) {
      window.removeEventListener("mouseup", this._upHandler, false);
      window.removeEventListener("mousedown", this._downHandler, false);
      window.removeEventListener("mousemove", this._moveHandler, false);
      window.removeEventListener("mousewheel", this._wheelHandler, false);
      window.removeEventListener("DOMMouseScroll", this._wheelHandler, false);
    }
    if (this._useTouch) {
      this._target.removeEventListener("touchstart", this._touchstartHandler, false);
      this._target.removeEventListener("touchend", this._touchendHandler, false);
      this._target.removeEventListener("touchmove", this._touchmoveHandler, false);
      this._target.removeEventListener("touchcancel", this._touchcancelHandler, false);
    }
    this._target = null;
  }, addElement:function(element) {
    if (this._elements.indexOf(element) === -1) {
      this._elements.push(element);
    }
  }, removeElement:function(element) {
    var idx = this._elements.indexOf(element);
    if (idx !== -1) {
      this._element.splice(idx, 1);
    }
  }, _handleUp:function(event) {
    if (!this._enabled) {
      return;
    }
    if (ape.Mouse.isPointerLocked()) {
      return;
    }
    this._calcMouseCoords(event);
    if (targetX === null) {
      return;
    }
    this._onElementMouseEvent(event);
  }, _handleDown:function(event) {
    if (!this._enabled) {
      return;
    }
    if (ape.Mouse.isPointerLocked()) {
      return;
    }
    this._calcMouseCoords(event);
    if (targetX === null) {
      return;
    }
    this._onElementMouseEvent(event);
  }, _handleMove:function(event) {
    if (!this._enabled) {
      return;
    }
    this._calcMouseCoords(event);
    if (targetX === null) {
      return;
    }
    this._onElementMouseEvent(event);
    this._lastX = targetX;
    this._lastY = targetY;
  }, _handleWheel:function(event) {
    if (!this._enabled) {
      return;
    }
    this._calcMouseCoords(event);
    if (targetX === null) {
      return;
    }
    this._onElementMouseEvent(event);
  }, _determineTouchedElement:function(event) {
    var touchedElements = {};
    var cameras = this.app.systems.camera.cameras;
    var i, j, len;
    for (i = cameras.length - 1; i >= 0; i--) {
      var camera = cameras[i];
      var done = 0;
      for (j = 0, len = event.changedTouches.length; j < len; j++) {
        if (touchedElements[event.changedTouches[j].identifier]) {
          done++;
          continue;
        }
        var coords = this._calcTouchCoords(event.changedTouches[j]);
        var element = this._getTargetElement(camera, coords.x, coords.y);
        if (element) {
          done++;
          touchedElements[event.changedTouches[j].identifier] = {element:element, camera:camera, x:coords.x, y:coords.y};
        }
      }
      if (done === len) {
        break;
      }
    }
    return touchedElements;
  }, _handleTouchStart:function(event) {
    if (!this._enabled) {
      return;
    }
    var newTouchedElements = this._determineTouchedElements(event);
    for (var i = 0, len = event.changedTouches.length; i < len; i++) {
      var touch = event.changedTouches[i];
      var newTouchInfo = newTouchedElements[touch.identifier];
      var oldTouchInfo = this._touchedElements[touch.identifier];
      if (newTouchInfo && (!oldTouchInfo || newTouchInfo.element !== oldTouchInfo.element)) {
        this._fireEvent(event.type, new ElementTouchEvent(event, newTouchInfo.element, newTouchInfo.camera, newTouchInfo.x, newTouchInfo.y, this));
        this._touchesForWhichTouchLeaveHasFired[touch.identifier] = false;
      }
    }
    for (var touchId in newTouchedElements) {
      this._touchedElements[touchId] = newTouchedElements[touchId];
    }
  }, _handleTouchEnd:function(event) {
    if (!this._enabled) {
      return;
    }
    var cameras = this.app.systems.camera.cameras;
    for (var key in this._clickedEntities) {
      delete this._clickedEntities[key];
    }
    for (var i = 0, len = event.changedTouches.length; i < len; i++) {
      var touch = event.changedTouches[i];
      var touchInfo = this._touchedElements[touch.identifier];
      if (!touchInfo) {
        continue;
      }
      var element = touchInfo.element;
      var camera = touchInfo.camera;
      var x = touchInfo.x;
      var y = touchInfo.y;
      delete this._touchedElements[touch.identifier];
      delete this._touchesForWhichTouchLeaveHasFired[touch.identifier];
      this._fireEvent(event.type, new ElementTouchEvent(event, element, camera, x, y, this));
      if (event.touches.length === 0) {
        var coords = this._calcTouchCoords(touch);
        for (var c = cameras.length - 1; c >= 0; c--) {
          var hovered = this._getTargetElement(cameras[c], coords.x, coords.y);
          if (hovered === element) {
            if (!this._clickedEntities[element.entity.getGuid()]) {
              this._fireEvent("click", new ElementTouchEvent(event, element, camera, x, y, this));
              this._clickedEntities[element.entity.getGuid()] = true;
            }
          }
        }
      }
    }
  }, _handleTouchMove:function(event) {
    event.preventDefault();
    if (!this._enabled) {
      return;
    }
    var newTouchedElements = this._determineTouchedElements(event);
    for (var i = 0, len = event.changedTouches.length; i < len; i++) {
      var touch = event.changedTouches[i];
      var newTouchInfo = newTouchedElements[touch.identifier];
      var oldTouchInfo = this._touchedElements[touch.identifier];
      if (oldTouchInfo) {
        var coords = this._calcTouchCoords(touch);
        if ((!newTouchInfo || newTouchInfo.element !== oldTouchInfo.element) && !this._touchesForWhichTouchLeaveHasFired[touch.identifier]) {
          this._fireEvent("touchleave", new ElementTouchEvent(event, oldTouchInfo.element, oldTouchInfo.camera, coords.x, coords.y, this));
          this._touchesForWhichTouchLeaveHasFired[touch.identifier] = true;
        }
        this._fireEvent("touchmove", new ElementTouchEvent(event, oldTouchInfo.element, oldTouchInfo.camera, coords.x, coords.y, this));
      }
    }
  }, _onElementMouseEvent:function(event) {
    var element;
    var hovered = this._hoveredElement;
    this._hoveredElement = null;
    var cameras = this.app.systems.camera.cameras;
    var camera;
    for (var i = cameras.length - 1; i >= 0; i--) {
      camera = cameras[i];
      element = this._getTargetElement(camera, targetX, targetY);
      if (element) {
        break;
      }
    }
    if (element) {
      this._fireEvent(event.type, new ElementMouseEvent(event, element, camera, targetX, targetY, this._lastX, this._lastY));
      this._hoveredElement = element;
      if (event.type === ape.EVENT_MOUSEDOWN) {
        this._pressedElement = element;
      }
    }
    if (hovered !== this._hoveredElement) {
      if (hovered) {
        this._fireEvent("mouseleave", new ElementMouseEvent(event, hovered, camera, targetX, targetY, this._lastX, this._lastY));
      }
      if (this._hoveredElement) {
        this._fireEvent("mouseenter", new ElementMouseEvent(event, this._hoveredElement, camera, targetX, targetY, this._lastX, this._lastY));
      }
    }
    if (event.type === ape.EVENT_MOUSEUP && this._pressedElement) {
      if (this._pressedElement === this._hoveredElement) {
        this._pressedElement = null;
        if (!this._clickedEntities || !this._clickedEntities[this._hoveredElement.entity.getGuid()]) {
          this._fireEvent("click", new ElementMouseEvent(event, this._hoveredElement, camera, targetX, targetY, this._lastX, this._lastY));
        }
      } else {
        this._pressedElement = null;
      }
    }
  }, _fireEvent:function(name, evt) {
    var element = evt.element;
    while (true) {
      element.fire(name, evt);
      if (evt._stopPropagation) {
        break;
      }
      if (!element.entity.parent) {
        break;
      }
      element = element.entity.parent.element;
      if (!element) {
        break;
      }
    }
  }, _calcMouseCoords:function(event) {
    var rect = this._target.getBoundingClientRect();
    var left = Math.floor(rect.left);
    var top = Math.floor(rect.top);
    if (event.clientX < left || event.clientX >= left + this._target.clientWidth || event.clientY < top || event.clientY >= top + this._target.clientHeight) {
      targetX = null;
      targetY = null;
    } else {
      targetX = event.clientX - left;
      targetY = event.clientY - top;
    }
  }, _calcTouchCoords:function(touch) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var target = touch.target;
    while (!(target instanceof HTMLElement)) {
      target = target.parentNode;
    }
    var currentElement = target;
    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent;
    } while (currentElement);
    return {x:touch.pageX - totalOffsetX, y:touch.pageY - totalOffsetY};
  }, _sortElements:function(a, b) {
    var layerOrder = this.app.scene.layers.sortTransparentLayers(a.layers, b.layers);
    if (layerOrder !== 0) {
      return layerOrder;
    }
    if (a.screen && !b.screen) {
      return -1;
    }
    if (!a.screen && b.screen) {
      return 1;
    }
    if (!a.screen && !b.screen) {
      return 0;
    }
    if (a.screen.screen.screenSpace && !b.screen.screen.screenSpace) {
      return -1;
    }
    if (b.screen.screen.screenSpace && !a.screen.screen.screenSpace) {
      return 1;
    }
    return b.drawOrder - a.drawOrder;
  }, _getTargetElement:function(camera, x, y) {
    var result = null;
    this._elements.sort(this._sortHandler);
    for (var i = 0, len = this._elements.length; i < len; i++) {
      var element = this._elements[i];
      if (element.screen && element.screen.screen.screenSpace) {
        if (this._checkElement2d(x, y, element, camera)) {
          result = element;
          break;
        }
      } else {
        if (this._checkElement3d(x, y, element, camera)) {
          result = element;
          break;
        }
      }
    }
    return result;
  }, _buildHitCorners:function(element, screenOrWorldCorners, scaleX, scaleY) {
    var hitCorners = screenOrWorldCorners;
    var button = element.entity && element.entity.button;
    if (button) {
      var hitPadding = element.entity.button.bitPadding || ZERO_VEC4;
      _paddingTop.copy(element.entity.up);
      _paddingBottom.copy(_paddingTop).scale(-1);
      _paddingRight.copy(element.entity.right);
      _paddingBottom.copy(_paddingRight).scale(-1);
      _paddingTop.scale(hitPadding.w * scaleY);
      _paddingBottom.scale(hitPadding.y * scaleY);
      _paddingRight.scale(hitPadding.z * scaleX);
      _paddingLeft.scale(hitPadding.x * scaleX);
      _cornerBottomLeft.copy(hitCorners[0]).add(_paddingBottom).add(_paddingLeft);
      _cornerBottomRight.copy(hitCorners[1]).add(_paddingBottom).add(_paddingRight);
      _cornerTopRight.copy(hitCorners[2]).add(_paddingTop).add(_paddingRight);
      _cornerTopLeft.copy(hitCorners[3]).add(_paddingTop).add(_paddingLeft);
      hitCorners = [_cornerBottomLeft, _cornerBottomRight, _cornerTopRight, _cornerTopLeft];
    }
    return hitCorners;
  }, _calculateScaleToScreen:function(element) {
    var current = element.entity;
    var screenScale = element.screen.screen.scale;
    _accumulatedScale.set(screenScale, screenScale);
    while (current && !current.screen) {
      _accumulatedScale.mul(current.getLocalScale());
      current = current.parent;
    }
    return _accumulatedScale;
  }, _checkElement2d:function(x, y, element, camera) {
    if (element.maskedBy) {
      var result = this._checkElement2d(x, y, element.maskedBy.element, camera);
      if (!result) {
        return false;
      }
    }
    var sw = this.app.graphicsDevice.width;
    var sh = this.app.graphicsDevice.height;
    var cameraWidth = camera.rect.z * sw;
    var cameraHeight = camera.rect.w * sh;
    var cameraLeft = camera.rect.x * sw;
    var cameraRight = cameraLeft + cameraWidth;
    var cameraBottom = (1 - camera.rect.y) * sh;
    var cameraTop = cameraBottom - cameraHeight;
    var _x = x * sw / this._target.clientWidth;
    var _y = y * sh / this._target.clientHeight;
    if (_x >= cameraLeft && _x <= cameraRight && _y <= cameraBottom && _y >= cameraTop) {
      _x = sw * (_x - cameraLeft) / cameraWidth;
      _y = sh * (_y - cameraTop) / cameraHeight;
      _y = sh - _y;
      var scale = this._calculateScaleToScreen(element);
      var hitCorners = this._buildHitCorners(element, element.screenCorners, scale.x, scale.y);
      vecA.set(_x, _y, 1);
      vecB.set(_x, _y, -1);
      if (intersectLineQuad(vecA, vecB, hitCorners)) {
        return true;
      }
    }
    return false;
  }, _checkElement3d:function(x, y, element, camera) {
    if (element.maskedBy) {
      var result = this._checkElement3d(x, y, element.maskedBy.element, camera);
      if (!result) {
        return false;
      }
    }
    var sw = this._target.clientWidth;
    var sh = this._target.clientHeight;
    var cameraWidth = camera.rect.z * sw;
    var cameraHeight = camera.rect.w * sh;
    var cameraLeft = camera.rect.x * sw;
    var cameraRight = cameraLeft + cameraWidth;
    var cameraBottom = (1 - camera.rect.y) * sh;
    var cameraTop = cameraBottom - cameraHeight;
    var _x = x;
    var _y = y;
    if (x >= cameraLEft && x <= cameraRight && y <= cameraBottom && _y >= cameraTop) {
      _x = sw * (_x - cameraLeft) / cameraWidth;
      _y = sh * (_y - cameraTop) / cameraHeight;
      var scale = element.entity.getWorldTransform().getScale();
      var worldCorners = this._buildHitCorners(element, element.worldCorners, scale.x, scale.y);
      var start = vecA;
      var end = vecB;
      camera.screenToWorld(_x, _y, camera.nearClip, start);
      camera.screenToWorld(_x, _y, camera.farClip, end);
      if (intersectLineQuad(start, end, worldCorners)) {
        return true;
      }
    }
    return false;
  }});
  Object.defineProperty(ElementInput.prototype, "enabled", {get:function() {
    return this._enabled;
  }, set:function(value) {
    this._enabled = value;
  }});
  Object.defineProperty(ElementInput.prototype, "app", {get:function() {
    return this._app || ape.app;
  }, set:function(value) {
    this._app = value;
  }});
  return {ElementInput:ElementInput, ElementInputEvent:ElementInputEvent, ElementMouseEvent:ElementMouseEvent, ElementTouchEvent:ElementTouchEvent};
}());
Object.assign(ape.fw, function() {
  var Application = function(canvas, options) {
    this.canvas = canvas;
    this._link = new ape.fw.LiveLink(window);
    this._link.listen(ape.callback(this, this._handleMessage));
    this.graphicsDevice = new ape.gfx.GraphicsDevice(canvas);
    var programLib = new ape.gfx.ProgramLibrary;
    programLib.register("basic", ape.gfx.programlib.basic.generateVertexShader, ape.gfx.programlib.basic.generateFragmentShader, ape.gfx.programlib.basic.generateKey);
    programLib.register("phong", ape.gfx.programlib.phong.generateVertexShader, ape.gfx.programlib.phong.generateFragmentShader, ape.gfx.programlib.phong.generateKey);
    programLib.register("pick", ape.gfx.programlib.pick.generateVertexShader, ape.gfx.programlib.pick.generateFragmentShader, ape.gfx.programlib.pick.generateKey);
    this.graphicsDevice.setProgramLibrary(programLib);
    this.graphicsDevice.setCurrent();
    ape.post.initialize();
    this.graphicsDevice.enableValidation(false);
    var registry = new ape.fw.ComponentSystemRegistry;
    var loader = new ape.resources.ResourceLoader;
    this.context = new ape.fw.ApplicationContext(loader, new ape.scene.Scene, registry, null, null, null);
    var camerasys = new ape.fw.CameraComponentSystem(this.context);
    var dlightsys = new ape.fw.DirectionalLightComponentSystem(this.context);
    var plightsys = new ape.fw.PointLightComponentSystem(this.context);
    ape.extend(this, ape.events);
    this.init();
  };
  Application.prototype.start = function(entity) {
    if (entity) {
      this.context.root.addChild(entity);
    }
    this.tick();
  };
  Application.prototype.init = function() {
  };
  Application.prototype.update = function(dt) {
    var inTools = !!window.ape.apps.designer;
    var context = this.context;
    ape.fw.ComponentSystem.update(dt, context, inTools);
    this.fire("update", dt);
    if (context.controller) {
      context.controller.update(dt);
    }
    if (context.keyboard) {
      context.keyboard.update(dt);
    }
  };
  Application.prototype.render = function() {
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
  Application.prototype.tick = function() {
    var dt = 1.0 / 60.0;
    this.update(dt);
    this.render();
    requestAnimationFrame(this.tick.bind(this), this.canvas);
  };
  Application.prototype._handleMessage = function(msg) {
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
        var entity = this.context.root.findOne("getGuid", guid);
        if (entity) {
          entity.close(this.context.systems);
        }
        break;
      case ape.fw.LiveLinkMessageType.OPEN_ENTITY:
        logINFO("Rec: OPEN_ENTITY " + msg.content.id);
        var entities = {};
        msg.content.models.forEach(function(model) {
          var entity = this.context.loader.open(ape.resources.EntityRequest, model);
          entities[entity.getGuid()] = entity;
        }, this);
        var handler = new ape.resources.EntityResourceHandler;
        for (guid in entities) {
          if (entities.hasOwnProperty(guid)) {
            handler.patchChildren(entities[guid], entities);
            if (!entities[guid].getParent()) {
              this.context.root.addChild(entities[guid]);
            }
          }
        }
        break;
    }
  };
  Application.prototype._updateComponent = function(guid, componentName, attributeName, value) {
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
        entity[attributeName] = value;
      }
    }
  };
  Application.prototype._updateEntityAttribute = function(guid, accessor, value) {
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
  Application.prototype_updateEntity = function(guid, components) {
    var type;
    var entity = this.context.root.findOne("getGuid", guid);
    if (entity) {
      for (type in components) {
        if (this.context.systems.hasOwnProperty(type)) {
          if (!this.context.systems[type].hasComponent(entity)) {
            this.context.systems[type].createComponent(entity);
          }
        }
      }
      for (type in this.context.systems) {
        if (type === "gizmo" || type === "pick") {
          continue;
        }
        if (this.context.systems.hasOwnProperty(type)) {
          if (!components.hasOwnProperty(type) && this.context.systems[type].hasComponent(entity)) {
            this.context.systems[type].deleteComponent(entity);
          }
        }
      }
    }
  };
  return {Application:Application};
}());


  return ape;
}));

