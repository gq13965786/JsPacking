Object.assign(ape.fw, function () {
    /**
     * @name ape.fw.LiveLinkUpdateComponentMessage
     * @constructor Create a new LiveLinkUpdateComponentMessage from individual attributes
     * @class The update component message signals a change in an individual component value.
     * @param {Object} id
     * @param {Object} component
     * @param {Object} attribute
     * @param {Object} value
     * @private
     */
    var LiveLinkUpdateComponentMessage = function(id, component, attribute, value) {
        this.type = ape.fw.LiveLinkMessageType.UPDATE_COMPONENT
        this.content = {
            id: id,
            component: component,
            attribute: attribute,
            value: value
        };
    };
    LiveLinkUpdateComponentMessage.prototype = Object.create(ape.fw.LiveLinkMessage.prototype);
    LiveLinkUpdateComponentMessage.prototype.constructor = LiveLinkUpdateComponentMessage;
    //LiveLinkUpdateComponentMessage = LiveLinkUpdateComponentMessage.extendsFrom(ape.fw.LiveLinkMessage);

    ape.fw.LiveLinkMessage.prototype.register("UPDATE_COMPONENT");

    return {
        LiveLinkUpdateComponentMessage: LiveLinkUpdateComponentMessage
    };
}());
