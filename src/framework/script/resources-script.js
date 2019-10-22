ape.extend(ape.resources, function () {
  var ScriptResourceHandler = function (context, prefix) {
    this._context = context;

    this._prefix = prefix || "";
    this._queue = [];
    this._pending = [];
    this._loaded = {};
    this._loading = null;

    ape.script.bind("created", this._onScriptCreated.bind(this));
  };
  //inherits implenment later
  //ScriptResourceHandler = ScriptResourceHandler.

  ScriptResourceHandler.prototype.load = function (identifier, success, error, progress, options) {
    options = options || {};
    options.timeout = options.timeout || 10000; // default 10 second timeout

    var url = new ape.URI(identifier);
    url.path = ape.path.join(this._prefix, url.path);
    url = url.toString();

    if(this._loaded[url]) {
        if (this._loaded[url] !== true) {
            success(this._loaded[url]);
        } else {
            // regular js script, no need to call success callback
        }
    } else {
        if (this._loading) {
            this._queue.push({
                url: url.toString(),
                success: success,
                error: error,
                progress: progress
            });
        } else {
            this._addScriptTag(url.toString(), success, error, progress);
        }
    }

    if(options.timeout) {
        (function () {
            setTimeout(function () {
                if (!this._loaded[url]) {
                    error(ape.string.format("Loading script {0} timed out after {1}s", url, options.timeout / 1000));
                }
            }.bind(this), options.timeout);
        }).call(this);
    }
  };
  ScriptResourceHandler.prototype.open = function (data, options) {
    return data;
  };
  ScriptResourceHandler.prototype._onScriptCreated = function (name, callback) {
    this._pending.push({
      name: name,
      callback: callback
    });
  };
  ScriptResourceHandler.prototype._addScriptTag = function (url, success, error, progress) {
    var self = this;
    var head = document.getElementsByTagName("head")[0];
    var element = document.createElement("script");
    this._loading = element;

    element.addEventListener("error", function (e) {
        error(ape.string.format("Error loading script from '{0}'", e.target.src));
    });

    element.onload = element.onreadystatechange = function () {
        if(!this.readyState || (this.readyState == "loaded" || this.readyState == "complete")) {
            var script = self._pending.shift();
            if (script) {
                var ScriptType = script.callback(self._context);
                if (ScriptType._pcScriptName) {
                    throw Error("Attribute _pcScriptName is reserved on ScriptTypes for ResourceLoader use");
                }
                ScriptType._pcScriptName = script.name; // store name in script object
                self._loaded[url] = ScriptType; //{name: script.name, ScriptType: ScriptType};
                success(ScriptType);
            } else {
                // loaded a regular javascript script, so no ScriptType to instanciate.
                // However, we still need to register that we've loaded it in case there is a timeout
                self._loaded[url] = true;
            }
            self._loading = null;
            // Load next one in the queue
            if (self._queue.length) {
               var loadable = self._queue.shift();
               self._addScriptTag(loadable.url, loadable.success, loadable.error, loadable.progress);
            }
        }
    };
    // set the src attribute after the onload callback is set, to avoid an instant loading failing to fire the callback
    element.src = url;

    head.appendChild(element);
  };

  var ScriptRequest = function ScriptRequest() {};
  //inherits
  //ScriptRequest = ScriptRequest
  return {
    ScriptResourceHandler: ScriptResourceHandler,
    ScriptRequest: ScriptRequest
  };
}());
