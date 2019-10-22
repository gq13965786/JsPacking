Object.assign(ape, (function () {
    var DummyComponent = function DummyComponent() {};
    DummyComponent = ape.inherits(DummyComponent, ape.Component);

    return {
        DummyComponent: DummyComponent
    };
}()));
