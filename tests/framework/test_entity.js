describe("ape.Entity", function () {


  var createSubtree = function () {
    //Naming indicates path within the tree, with underscores separating levels
    var a = new ape.Entity('a', app);
    var a_a = new ape.Entity('a_a', app);
    var a_b = new ape.Entity('a_b', app);
    var a_a_a = new ape.Entity('a_a_a', app);
    var a_a_b = new ape.Entity('a_a_b', app);

    a.addChild(a_a);
    a.addChild(a_b);

    a_a.addChild(a_a_a);
    a_a.addChild(a_a_b);


    return {
      a: a,
      a_a: a_a,
      a_b: a_b,
      a_a_a: a_a_a,
      a_a_b: a_a_b,
    };
  };
  var cloneSubtree = function (subtree) {
    var a = subree.a.clone();
    var a_a = a.children[0];
    var a_b = a.children[1];
    var a_a_a = a_a.children[0];
    var a_a_b = a_a.children[1];

    return {
      a: a,
      a_a: a_a,
      a_b: a_b,
      a_a_a: a_a_a,
      a_a_b: a_a_b,
    };
  };

  it("clone() returns a deep clone of the entity's subtree, including all component", function () {});
  it("clone() resolves entity property references that refer to entities within the duplicated subtree", function () {});
  it("clone() resolves entity property references that refer to the cloned entity itself", function () {});
  it("clone() does not attempt to resolve entity property references that refer to entities outside of the duplicated subtree", function () {});
  it("clone() ignores null and undefined entity property references", function () {});
  it("clone() resolves entity script attributes that refer to entities within the duplicated subtree", function () {});
  it("clone() resolves entity script attributes that refer to entities within the duplicated subtree after preloading has finished", function () {});
  it("clone() does not attempt to resolves entity script attributes that refer to entities outside of the duplicated subtree", function () {});
  it("clone() does not resolve entity script attributes that refer to entities within the duplicated subtree if ape.useLegacyScriptAttributeCloning is true", function () {});
  it("findByGuid() returns same entity", function () {});
  it("findByGuid() returns direct child entity", function () {});
  it("findByGuid() returns child of child entity", function () {});
  it("findByGuid() does not return parent", function () {});
  it("findByGuid() does not return destroy entity", function () {});
  it("findByGuid() does not return entity that was removed from hierarchy", function () {});
  it("findByGuid() does not return entity that does not exist", function () {});

});
