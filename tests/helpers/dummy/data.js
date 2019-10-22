Object.assign(ape, (function () {
    var DummyComponentData = function DummyComponentData() {};
    DummyComponentData = ape.inherits(DummyComponentData, ape.ComponentData);

    return {
        DummyComponentData: DummyComponentData
    };
}()));
