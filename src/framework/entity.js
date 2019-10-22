Object.assign(ape.fw, function () {

    var Entity = function(){
        this._guid = ape.guid.create(); // Globally Unique Identifier
        this._batchHandle = null; // The handle for a RequestBatch, set this if you want to Component's to load their resources using a pre-existing RequestBatch.
    };
    Entity.prototype = Object.create(ape.scene.GraphNode);
    Entity.prototype.constructor = Entity;
    //Entity = Entity.extendsFrom(ape.scene.GraphNode);

    Entity.prototype.getGuid = function () {
        return this._guid;
    };

    Entity.prototype.setGuid = function (guid) {
        this._guid = guid;
    };

	Entity.prototype.setRequestBatch = function (handle) {
		this._batchHandle = handle;
	};

	Entity.prototype.getRequestBatch = function () {
		return this._batchHandle;
	};

    Entity.prototype.addChild = function (child) {
        if(child instanceof ape.fw.Entity) {
            var _debug = true
            if(_debug) {
                var root = this.getRoot();
                var dupe = root.findOne("getGuid", child.getGuid());
                if(dupe) {
                    throw new Error("GUID already exists in graph");
                }
            }
        }

        ape.scene.GraphNode.prototype.addChild.call(this, child);
    };

    Entity.prototype.findByGuid = function (guid) {
        if (this._guid === guid) return this;

        for (var i = 0; i < this._children.length; i++) {
            if(this._children[i].findByGuid) {
                var found = this._children[i].findByGuid(guid);
                if (found !== null) return found;
            }
        }
        return null;
    };

    Entity.prototype.reparentByGuid = function(parentGuid, context) {
        if(parentGuid) {
            var parent = context.root.findOne("getGuid", parentGuid);
            if(!parent) {
                throw new Error("Parent Entity doesn't exist")
            }
        }

        var current = this.getParent();
        if(current) {
            current.removeChild(this);
        }
        if(parent) {
            parent.addChild(this);
        }
    };

    Entity.prototype.close = function (registry) {
        var parent = this.getParent();
        var childGuids;

        // Remove all components
        ape.fw.ComponentSystem.deleteComponents(entity, registry);

        // Detach from parent
        if(parent) {
            parent.removeChild(this);
        }

        this.getChildren().forEach(function (child) {
            if(child.close) {
                child.close(registry);
            }
        }, this);
    };

    Entity.deserialize = function (data) {
        var template = ape.json.parse(data.template);
        var parent = ape.json.parse(data.parent);
        var children = ape.json.parse(data.children);
        var transform = ape.json.parse(data.transform);
        var components = ape.json.parse(data.components);
        var labels = ape.json.parse(data.labels);

        var model = {
            _id: data._id,
            resource_id: data.resource_id,
            _rev: data._rev,
            name: data.name,
            labels: labels,
            template: template,
            parent: parent,
            children: children,
            transform: transform,
            components: components
        };

        return model;
    };

    Entity.serialize = function (model) {
        var data = {
            _id: model._id,
            resource_id: model.resource_id,
            name: model.name,
            labels: ape.json.stringify(model.labels),
            template: ape.json.stringify(model.template),
            parent: ape.json.stringify(model.parent),
            children: ape.json.stringify(model.children),
            transform: ape.json.stringify(model.transform),
            components: ape.json.stringify(model.components)
        };

        if(model._rev) {
            data._rev = model._rev
        }

        return data;
    };

    return {
        Entity: Entity
    }

}());
