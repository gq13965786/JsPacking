Object.assign(ape.fw, function () {
    /**
     * @name ape.fw.LiveLinkCloseEntityMessage
     * @constructor Create a new LiveLinkCloseEntityMessage from individual attributes
     * @class Signal that an Entity should be closed
     * @param {Object} id
     * @private
     */
    var LiveLinkCloseEntityMessage = function(id) {
        this.type = ape.fw.LiveLinkMessageType.CLOSE_ENTITY
        this.content = {
            id: id
        };
    };
    LiveLinkCloseEntityMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
    LiveLinkCloseEntityMessage.prototype.constructor = LiveLinkCloseEntityMessage;
    //LiveLinkCloseEntityMessage = LiveLinkCloseEntityMessage.extendsFrom(ape.fw.LiveLinkMessage);


    ape.fw.LiveLinkMessage.prototype.register("CLOSE_ENTITY");

    return {
        LiveLinkCloseEntityMessage: LiveLinkCloseEntityMessage
    };
}());
