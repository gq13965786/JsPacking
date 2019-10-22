Object.assign(ape, (function () {
    var dummySchema = [
        'enabled',
        { name: 'myEntity1', type: 'entity' },
        { name: 'myEntity2', type: 'entity' }
    ];

    var DummyComponentSystem = function DummyComponentSystem(app) {
        this.id = 'dummy';
        this.app = app;

        this.ComponentType = ape.DummyComponent;
        this.DataType = ape.DummyComponentData;
        this.schema = dummySchema;
    };
    DummyComponentSystem = ape.inherits(DummyComponentSystem, ape.ComponentSystem);

    ape.Component._buildAccessors(ape.DummyComponent.prototype, dummySchema);

    DummyComponentSystem.prototype.initializeComponentData = function(component, data, properties) {
        DummyComponentSystem._super.initializeComponentData.call(this, component, data, dummySchema);
    };

    return {
        DummyComponentSystem: DummyComponentSystem
    };
}()));
