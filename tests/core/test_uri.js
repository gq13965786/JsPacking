describe('ape.URI', function () {
  it("Parsed all sections", function () {
    var s = "http://a/b/c/d;p?q=r#l";

    var uri = new ape.URI(s);

    expect(uri.scheme).to.equal("http");
    expect(uri.authority).to.equal("a");
    expect(uri.path).to.equal("/b/c/d;p");
    expect(uri.query).to.equal("q=r");
    expect(uri.fragment).to.equal("l");
  });

  it("Parse, no schema", function () {
    var s = "//a/b/c/d;p?q=r#l";
    var uri = new ape.URI(s);
    var undef;

    expect(uri.schema).to.equal(undef);
    expect(uri.authority).to.equal("a");
    expect(uri.path).to.equal("/b/c/d;p");
    expect(uri.query).to.equal("q=r");
    expect(uri.fragment).to.equal("l");
  });

  it("Parse, no authority", function () {
    var s = "/b/c/d;p?q=r#l";
    var uri = new ape.URI(s);
    var undef;

    expect(uri.schema).to.equal(undef);
    expect(uri.authority).to.equal(undef);
    expect(uri.path).to.equal("/b/c/d;p");
    expect(uri.query).to.equal("q=r");
    expect(uri.fragment).to.equal("l");
  });

  it("Parse, no query", function () {
    var s = "/b/c/d;p#l";
    var uri = new ape.URI(s);
    var undef;

    expect(uri.schema).to.equal(undef);
    expect(uri.authority).to.equal(undef);
    expect(uri.path).to.equal("/b/c/d;p");
    expect(uri.query).to.equal(undef);
    expect(uri.fragment).to.equal("l");
  });

  it("Parse, no fragment", function () {
    var s = "/b/c/d;p";
    var uri = new ape.URI(s);
    var undef;

    expect(uri.schema).to.equal(undef);
    expect(uri.authority).to.equal(undef);
    expect(uri.path).to.equal("/b/c/d;p");
    expect(uri.query).to.equal(undef);
    expect(uri.fragment).to.equal(undef);
  });

  it("toString", function () {
    var s = "http://a/b/c/d;p?q=r#l";
    var uri = new ape.URI(s);
    var r = uri.toString();

    expect(s).to.equal(r);
  });

  it("Edit query", function () {
    var s = "http://example.com";
    var uri = new ape.URI(s);
    uri.query = "q=abc";

    expect(uri.toString()).to.equal("http://example.com?q=abc");

    uri.query = "";
    expect(uri.toString()).to.equal(s);
  });

  it("getQuery", function () {
    var s = "http://example.com/test?a=1&b=string&c=something%20spaced";
    var uri = new ape.URI(s);

    var q = uri.getQuery();

    expect(q.a).to.equal("1");
    expect(q.b).to.equal("string");
    expect(q.c).to.equal("something spaced");
  });

  it("getQuery: empty", function () {
    var s = "http://example.com/test";
    var uri = new ape.URI(s);

    var q = uri.getQuery();

    expect(Object.keys(q).length).to.equal(0);//Object.keys(q)
  });

  it("setQuery", function () {
    var uri = new ape.URI("http://example.com/test");
    var q = {
      key: "value",
      "with space": "\""
    };

    uri.setQuery(q);
    expect("key=value&with%20space=%22").to.equal(uri.query);
  });

  it("createURI", function () {
    var uri;

    uri = ape.createURI({
      scheme: "http",
      authority: "example.com",
      path: "/abc"
    });
    expect("http://example.com/abc").to.equal(uri);

    uri = ape.createURI({
      host: "http://example.com",
      path: "/abc"
    });
    expect("http://example.com/abc").to.equal(uri);

    uri = ape.createURI({
      hostpath: "http://example.com/abc"
    });
    expect("http://example.com/abc").to.equal(uri);

    uri = ape.createURI({
      hostpath: "http://example.com/abc",
      query: "a=b&c=d"
    });
    expect("http://example.com/abc?a=b&c=d").to.equal(uri);
  });

  it("createURI, exceptions", function () {
    expect(function () {
      ape.createURI({
        scheme: "http",
        host: "http://test.com"
      });
    }).to.throw();

    expect(function () {
      ape.createURI({
        authority: "http",
        host: "http://test.com"
      });
    }).to.throw();

    expect(function() {
        ape.createURI({
            scheme: "http",
            hostpath: "http://test.com"
        });
    }).to.throw();

    expect(function() {
        ape.createURI({
            authority: "http",
            hostpath: "http://test.com"
        });
    }).to.throw();

    expect(function() {
        ape.createURI({
            scheme: "http",
            authority: "e.com",
            host: "http://test.com"
        });
    }).to.throw();

    expect(function() {
        ape.createURI({
            scheme: "abc",
            authority: "http",
            hostpath: "http://test.com"
        });
    }).to.throw();

    expect(function() {
        ape.createURI({
            host: "http://test.com",
            hostpath: "http://test.com"
        });
    }).to.throw();
  });
})
