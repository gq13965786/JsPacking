describe('ape.Color testing', function() {

  it('new Color()', function () {
      var c = new ape.Color();

      expect(c.r).to.equal(0);
      expect(c.g).to.equal(0);
      expect(c.b).to.equal(0);
      expect(c.a).to.equal(1);
  });

  it('new Color(1,2,3,4)', function () {
      var c = new ape.Color(1,2,3,4);

      expect(c.r).to.equal(1);
      expect(c.g).to.equal(2);
      expect(c.b).to.equal(3);
      expect(c.a).to.equal(4);
  });

  it('new Color(1,2,3)', function () {
      var c = new ape.Color(1,2,3);

      expect(c.r).to.equal(1);
      expect(c.g).to.equal(2);
      expect(c.b).to.equal(3);
      expect(c.a).to.equal(1);
  });

  it('Color.toString() ,pass toString(true) has alpha in Color ', function () {
      var c = new ape.Color(1,1,1);
      expect(c.toString()).to.equal('#ffffff');
      expect(c.toString(true)).to.equal('#ffffffff');

      var c = new ape.Color(1,0,1,0);
      expect(c.toString()).to.equal('#ff00ff');
      expect(c.toString(true)).to.equal('#ff00ff00');

      ape.debug.display(c);

      var c = new ape.Color(0.729411780834198, 0.729411780834198, 0.6941176652908325, 1);
      expect(c.toString(true)).to.equal('#babab1ff');
  });

});
