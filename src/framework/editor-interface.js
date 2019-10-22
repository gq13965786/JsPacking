var editor = editor || {};
Object.assign(editor, function () {
    var LinkInterface = function () {
        this.exposed = {};
        this.added = {};
        this.scripts =  {};
        this.systems = [];
    };

    /**
     * Expose a Component
     * @param {Object} name
     */
    LinkInterface.prototype.addComponentType = function(name) {
        if (this.systems.indexOf(name) < 0) {
            this.systems.push(name);
        }

        if (!this.exposed[name]) {
            this.exposed[name] = {};
        }
    };


    /**
     * Expose a property of an object to the editor. This property will appear in the attribute editor control
     * @param {Object} details
     */
    LinkInterface.prototype.expose = function (details) {
        if(!details.system) {
            throw new Error("Missing option 'system'");
        }

        if(!details.variable) {
            throw new Error("Missing option 'variable'");
        }

        // Add default values
        details.options = details.options || {};


        if (!this.exposed[details.system][details.variable]) {
            this.exposed[details.system][details.variable] = {};
        }

        this.exposed[details.system][details.variable] = details;
    };

    /**
     * Add a property to the added list. Added properties are created in the viewmodels and can be used internally.
     * They are never visible in the Designer
     * @param {Object} details
     */
    LinkInterface.prototype.add = function (details) {
        logASSERT(details.system, "Missing option: 'system'");
        logASSERT(details.variable, "Missing option: 'variable'");

        if(!this.added[details.system]) {
            this.added[details.system] = {};
        }
        if(!this.added[details.system][details.variable]) {
            this.added[details.system][details.variable] = {};
        }
        this.added[details.system][details.variable] = details;
    };

    LinkInterface.prototype.scriptexpose = function (details) {
        this.scripts[details.script] = details;
    };

    return {
        LinkInterface: LinkInterface,
        link: new LinkInterface()
    }
}());
Object.assign(editor, function () {
    var LinkInterface = function () {
        this.exposed = {};
        this.added = {};
        this.scripts = {};
        this.systems = [];
    };

    LinkInterface.prototype = {
        addComponentType: function () {},
        expose: function () {},
        add: function () {},
        scriptexpose: function () {}
    };

    return {
        LinkInterface: LinkInterface,
        link: new LinkInterface()
    }
}());
