describe('ape.path', function () {
  it("path.getDirectory", function () {
    expect("folder").to.equal(ape.path.getDirectory("folder/file.txt"));
    expect("folder").to.equal(ape.path.getDirectory("folder/another"));
    expect("folder/another").to.equal(ape.path.getDirectory("folder/another/"));
    expect("").to.equal(ape.path.getDirectory(""));
    expect("").to.equal(ape.path.getDirectory("/"));
  });

  it("path.join", function () {
    expect("a/b").to.equal(ape.path.join("a", "b"));
    expect("/b").to.equal(ape.path.join("a", "/b"));
    expect("/a/b").to.equal(ape.path.join("/a", "b"));
    expect("a/b/c").to.equal(ape.path.join("a", "b/c"));
    expect("a/b/c").to.equal(ape.path.join("a/b", "c"));
    expect("a/b/").to.equal(ape.path.join("a", "b/"));
    expect("/b/").to.equal(ape.path.join("a", "/b/"));
    expect("a/b/").to.equal(ape.path.join("a", "b/"));
    expect("http://a.com/b").to.equal(ape.path.join("http://a.com", "b"));
    expect("a/b").to.equal(ape.path.join("", "a/b"));
    expect("a/b").to.equal(ape.path.join("a/b", ""));
  });

  it("path.join, more than two path sections", function () {
    expect("a/b/c").to.equal(ape.path.join("a", "b", "c"));
    expect("/b/c").to.equal(ape.path.join("a", "/b", "c"));
    expect("/a/b/c").to.equal(ape.path.join("/a", "b", "c"));
    expect("a/b/c/d").to.equal(ape.path.join("a/b", "c", "d"));
    expect("a/b/c/d").to.equal(ape.path.join("a", "b/c", "d"));
    expect("a/b/c/d").to.equal(ape.path.join("a", "b", "c/d"));
    expect("a/b/c/").to.equal(ape.path.join("a", "b", "c/"));
    expect("/b/c/").to.equal(ape.path.join("a", "/b", "c/"));
    expect("http://a.com/b/c").to.equal(ape.path.join("http://a.com", "b", "c"));
    expect("b/c/").to.equal(ape.path.join("", "b", "c/"));
    expect("b/c/").to.equal(ape.path.join("b", "c/", ""));
    expect("/").to.equal(ape.path.join("b", "c/", "/"));
    expect("a/b/c/d").to.equal(ape.path.join("a", "b", "c", "d"));
  });

  it("path.join, invaliad values", function () {
    expect(function(){
       ape.path.join("a", undefined);
    }).to.throw();
  });
})
