describe('ape.scope and socpeId, Version, VersionObject', function () {
  beforeEach(function () {
    var testRoot = {};
    Object.assign(testRoot, function () {
      var testName = function () {

      };
      return {
        testName: testName
      };
  }());

  });
  afterEach(function () {});
  it("create the scopeNamespace", function () {
    var scope = new ape.ScopeSpace("testName");

    expect(scope.name).to.equal("testName");
  });

  it("resolve function", function () {

  });
});
