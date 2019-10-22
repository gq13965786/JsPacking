Object.assign(ape.fw, function () {
  var Picker = function (width, height, model, pick) {
    this._width = width;
    this._height = height;
    this._model = model;
    this._pick = pick;

    var library = ape.GraphicsDevice.getCurrent().getProgramLibrary();
    var pickProgram = library.getProgram("pick", { skinning: false});

    //this._pickMaterial = new pc.scene.Material();
    //this._pickMaterial.setProgram(pickProgram);

    var pickFrameBuffer = new ape.FrameBuffer(this._width, this._height, true);
    this._offscreenRenderTarget = new ape.RenderTarget(pickFrameBuffer);
  };

  Picker.prototype.getWidth = function () {
    return this._width;
  };
  Picker.prototype.getHeight = function () {
    return this._height;
  };
  Picker.prototype.pick = function () {};

  return {
    Picker: Picker
  };
}());
