Object.assign(ape, function () {
  function EntityReference(parentComponent, entityPropertyName, eventConfig) {}

  Object.assign(EntityReference.prototype, {
    /**
     * Must be called from the parent component's onEnable() method in order for entity
     * references to be correctly resolved when {@link pc.Entity#clone} is called.
     */
    onParentComponentEnable: function () {},
    /**
     * Convenience method indicating whether the entity exists and has a component of the provided type.
     *
     * @param {String} componentName Name of the component.
     * @returns {Boolean} True if the entity exists and has a component of the provided type.
     */
    hasComponent: function () {},
///////////////////////////////////////////////////
    _configureEventListeners: function (externalEventConfig, internalEventConfig) {},
    _parseEventListenerConfig: function (eventConfig, prefix, scope) {},
    _toggleLifecycleListeners: function (onOrOff) {},
    _onSetEntity: function (name, oldValue, newValue) {},
    _onPostInitialize: function () {}  
  });

  Object.defineProperty(EntityReference.prototype, 'entity', {
    get: function () {
      return this._entity;
    }
  });

  return {
    EntityReference: EntityReference
  };
}());
