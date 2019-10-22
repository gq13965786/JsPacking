Object.assign(ape.fw, function () {
    /**
     * @name ape.fw.LiveLinkUpdateEntityMessage
     * @constructor Create a new LiveLinkUpdateEntityMessage
     * @class An Update Entity message signals a change in the number of components in an entity
     * @param {Object} id The id of the Entity that is changed
     * @param {Object} components The full components data structure
     * @private
     */
    var LiveLinkUpdateEntityMessage = function (id, components) {
        this.type = ape.fw.LiveLinkMessageType.UPDATE_ENTITY;
        this.content = {
            id: id,
            components: components
        };
    };
    LiveLinkUpdateEntityMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
    LiveLinkUpdateEntityMessage.prototype.constructor = LiveLinkUpdateEntityMessage;
    //LiveLinkUpdateEntityMessage = LiveLinkUpdateEntityMessage.extendsFrom(ape.fw.LiveLinkMessage);
    ape.fw.LiveLinkMessage.prototype.register("UPDATE_ENTITY");


    var LiveLinkUpdateEntityAttributeMessage = function (id, accessor, value) {
        this.type = ape.fw.LiveLinkMessageType.UPDATE_ENTITY_ATTRIBUTE;
        this.content = {
            id: id,
            accessor: accessor,
            value: value
        };
    };
    LiveLinkUpdateEntityAttributeMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
    LiveLinkUpdateEntityAttributeMessage.prototype.constructor = LiveLinkUpdateEntityAttributeMessage;
    //LiveLinkUpdateEntityAttributeMessage = LiveLinkUpdateEntityAttributeMessage.extendsFrom(ape.fw.LiveLinkMessage);
    ape.fw.LiveLinkMessage.prototype.register("UPDATE_ENTITY_ATTRIBUTE");

    return {
        LiveLinkUpdateEntityMessage: LiveLinkUpdateEntityMessage,
        LiveLinkUpdateEntityAttributeMessage: LiveLinkUpdateEntityAttributeMessage
    };
}());
