Object.assign(ape.fw, function () {
    /**
     * @name ape.fw.LiveLinkOpenEntityMessage
     * @constructor Create a new LiveLinkOpenEntityMessage from individual attributes
     * @class Signal that an Entity should be loaded and opened
     * @param {Object} id
     * @param {Object} models List of all models, first should be parent, followed by all descendants
     * @private
     */
    var LiveLinkOpenEntityMessage = function(models) {
        this.type = ape.fw.LiveLinkMessageType.OPEN_ENTITY
        this.content = {
            models: models
        };
    };
    LiveLinkOpenEntityMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
    LiveLinkOpenEntityMessage.prototype.constructor = LiveLinkOpenEntityMessage;
    //LiveLinkOpenEntityMessage = LiveLinkOpenEntityMessage.extendsFrom(ape.fw.LiveLinkMessage);


    ape.fw.LiveLinkMessage.prototype.register("OPEN_ENTITY");

    return {
        LiveLinkOpenEntityMessage: LiveLinkOpenEntityMessage
    };
}());
