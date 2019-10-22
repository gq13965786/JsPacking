Object.assign(ape, function () {
  'use strict';
//public interface
  var ProgramLibrary = function (device) {
    this._device = device;
    this._cache = {};
    this._generators = {};
    this._isClearingCache = false;
    this._precached = false;

    // Unique non-cached programs collection to dump and update game shaders cache
    this._programsCollection = [];
    this._defaultStdMatOption = {};
    this._defaultStdMatOptionMin = {};
    var m = new ape.StandardMaterial();
    m.shaderOptBuilder.updateRef(
        this._defaultStdMatOption, device, {}, m, null, [], ape.SHADER_FORWARD, null, null);
    m.shaderOptBuilder.updateMinRef(
        this._defaultStdMatOptionMin, device, {}, m, null, [], ape.SHADER_SHADOW, null, null);
  };

  ProgramLibrary.prototype.register = function (name, generator) {};
  ProgramLibrary.prototype.unregister = function (name) {};
  ProgramLibrary.prototype.isRegistered = function (name) {};
  ProgramLibrary.prototype.getProgram = function (name, options) {};
  ProgramLibrary.prototype.storeNewProgram = function (name, options) {};
// run ape.app.graphicsDevice.programLib.dumpPrograms(); from browser console to build shader options script
  ProgramLibrary.prototype.dumpPrograms = function () {};
  ProgramLibrary.prototype.clearCache = function () {};
  ProgramLibrary.prototype.removeFromCache = function () {};
  ProgramLibrary.prototype._getDefaultStdMatOptions = function (pass) {};
  ProgramLibrary.prototype.precompile = function (cache) {

  };

  return {
    ProgramLibrary: ProgramLibrary
  };
}());
