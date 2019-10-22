
ape.resources = function () {

    var ResourceLoader = function (options) {
    	options = options || {};
    	options.maxConcurrentRequests = options.maxConcurrentRequests || 32;

    	this._loading = [];
        this._pending = [];
		this._batches = [];
		this._handlers = {};
		this._requests = {};
		this._sequence = 1; // internal counter for sorting based on request order

		this._batchId = 1; // internal counter for creating batch handles.
		this._maxConcurrentRequests = options.maxConcurrentRequests;
    };

    ResourceLoader.prototype.registerHandler = function (RequestType, handler) {
    	var request = new RequestType();
    	if (request.constructor.name == "") {
    		throw Error("ResourceRequests must not be anonymous functions");
    	}
    	this._handlers[request.constructor.name] = handler;
    	handler.setLoader(this);
    };

    ResourceLoader.prototype.request = function (requests, priority, success, error, progress, options) {
		var batch = null;

		// Re-jig arguments if priority has been left out.
    	if(typeof(priority) == "function") {
    		options = progress;
    		progress = error;
    		error = success;
    		success = priority;
    		priority = 1;
    	}
		options = options || {};

		// Convert single request into a list
		if (!requests.length) {
			requests = [requests]
		}

    	// Create a batch for this request
		batch = new RequestBatch(this._batchId++, requests, priority, success, error, progress);

		// If a batch handle is passed in as an option, we use it as a 'parent' to the new batch.
		// The parent batch won't be complete until all it's children are complete.
		if (options.batch) {
			parent = this.getRequestBatch(options.batch);
			if (!parent) {
				throw new Error(ape.string.format("Cannot find batch with handle '{0}'", options.batch));
			}

			parent.children.push(batch);
			batch.parent = parent;

			// overwrite priority to match parent priority
			batch.priority = parent.priority;
		}

    	// Append each request with the batch it belongs to and the priority for easy access,
    	// then push the requests into the pending list
    	requests.forEach(function (request, index, arr) {
	    	if (this._requests[request.identifier]) {
	    		// This resource has already been requested, append the existing request with this batch so it gets the callbacks
	    		var existingRequest = this._requests[request.identifier];
	    		existingRequest.batches.push(batch);
	    		// Update the priority to the highest of the two
	    		existingRequest.priority = Math.min(existingRequest.priority, priority);
	    	} else {
	    		// Add a new request
	    		request.batches = [];
	    		request.batches.push(batch);
	    		request.priority = batch.priority;
	    		request.sequence = this._sequence++;
	    		this._requests[request.identifier] = request;
	    		this._pending.push(request.identifier);
	    	}
    	}, this);

    	// sort the pending queue into priority order
    	this._sort();

    	// Store the batch
    	this._batches.push(batch);

    	this._update();

    	return batch.handle;
    };


	ResourceLoader.prototype.open = function (RequestType, data, success, error, progress, options) {
	   var request = new RequestType();
	   return this._handlers[request.constructor.name].open(data, success, error, progress, options);
	}

    ResourceLoader.prototype.cancel = function (handle) {
    	var index = 0;
    	var length = this._batches.length;
    	var batch;
    	for (index = 0; index < length; ++index) {
    		batch = this._batches[index];
    		if (batch.handle == handle) {
    			batch.requests.forEach(function (request, index, arr) {
    				// remove all requests from pending list
    				var index = this._pending.indexOf(request.identifier)
    				if(index >= 0) {
    					this._pending.splice(index, 1);
    				}
    			}, this);
    		}
    	}
    };

    ResourceLoader.prototype._sort = function () {
    	this._pending.sort(function (a,b) {
    		var s = this._requests[a].priority - this._requests[b].priority;
    		// If the priorities are the same, then sort on sequence order
    		if (s == 0) {
    			return this._requests[a].sequence - this._requests[b].sequence;
    		} else {
	    		return s;
    		}
    	}.bind(this));
    };

    ResourceLoader.prototype._update = function () {
    	while ((this._pending.length > 0) && (this._loading.length < this._maxConcurrentRequests)) {
    		(function () {
    			// remove first request from pending list and add it to loading list
	    		var identifier = this._pending.shift();
	    		var request = this._requests[identifier];
                this._loading.push(request.identifier);

	    		var options = {
	    			priority: request.priority,
	    			batch: request.batches[0].handle // pass in original batch for any sub-requests to use
	    		};
	    		var handler = this._handlers[request.constructor.name];

	    		// load using handler
	    		handler.load(request.identifier, function (response, options) {
	    			// Request is now complete, remove it from map
	    			delete this._requests[identifier];

	    			// Remove request from _loading list
	    			this._loading.splice(this._loading.indexOf(request.identifier), 1);

					// Call open() and then postOpen() to create a new resource for each batch that requires a resource.
					request.batches.forEach(function (batch, index, arr) {
					    var resource = handler.open(response, options);
					    handler.postOpen(resource, function (resource) {
					        // Add new resources to all batches that requested it, and check to see if the batch is now complete
					        var complete = batch.addResource(request.identifier, resource);
                            if (complete) {
                                // removed completed batch
                                this._batches.splice(this._batches.indexOf(batch), 1);
                            }
					    }.bind(this), function (errors) {
                            if (batch.error) {
                                batch.error(errors);
                            }
                        }, function (progress) {
                            if (batch.progress) {
                                batch.progress(progress);
                            }
                        }, options);
					}, this);

					// Make any new requests
	    			this._update();
	    		}.bind(this), function (errors) {
					request.batches.forEach(function (batch, index, arr) {
		    			if (batch.error) {
		    				batch.error(errors);
		    			}
		    		}, this);
	    		}, function (progress) {
					request.batches.forEach(function (batch, index, arr) {
		    			if (batch.progress) {
		    				batch.progress(progress);
		    			}
	    			}, this);
	    		}, options);


    		}.call(this));
    	}
    };

    ResourceLoader.prototype.getRequestBatch = function (handle) {
    	var i;
    	var length = this._batches.length;
    	for(i = 0; i < length; ++i) {
    		if(this._batches[i].handle == handle) {
    			return this._batches[i];
    		}
    	}
    	return null;
    };

    var ResourceHandler = function () {
    };

	  ResourceHandler.prototype.setLoader = function (loader) {
		  this._loader = loader;
	  };

    ResourceHandler.prototype.load = function (identifier, success, error, progress, options) {
    	throw Error("Not implemented");
    };

    ResourceHandler.prototype.open = function (data, options) {
    	throw Error("Not implemented");
    };

    ResourceHandler.prototype.postOpen = function (resource, success, error, progress, options) {
        success(resource);
    };

    var RequestBatch = function (handle, requests, priority, success, error, progress) {
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

    RequestBatch.prototype.addResource = function (identifier, resource) {
		this.resources[identifier] = resource;
		this.count += 1;

		return this._update();
    };

    RequestBatch.prototype.getProgress = function () {
    	return 100 * this._getCount() / this._getTotal();
    };

    RequestBatch.prototype.isComplete = function () {
		var i;
		var length = this.children.length;
		for (i=0;i<length;++i) {
			if(!this.children[i].isComplete()) {
				return false;
			}
		}

		return (this.count == this.requests.length);
    };

    RequestBatch.prototype._updateProgress = function () {
        if (this.progress) {
            this.progress( this.getProgress() );
        }
    };

    RequestBatch.prototype._update = function () {
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
    }

    RequestBatch.prototype._getCount = function () {
    	var count = this.count;
		var i;
		var length = this.children.length;
		for (i=0;i<length;++i) {
			count += this.children[i]._getCount()
		}

		return count;
    }

    RequestBatch.prototype._getTotal = function () {
		var total = this.requests.length;
		var i;
		var length = this.children.length;
		for (i=0;i<length;++i) {
			total += this.children[i]._getTotal()
		}

		return total;
    }

    var ResourceRequest = function ResourceRequest(identifier) {
    	this.identifier = identifier;
    };

    var LoaderManager = function () {
    };

    LoaderManager.prototype.register = function (name, loader) {
        this[name] = loader;
    };

    return {
        ResourceLoader: ResourceLoader,
        ResourceHandler: ResourceHandler,
        ResourceRequest: ResourceRequest,
        LoaderManager: LoaderManager
    };
} ();
