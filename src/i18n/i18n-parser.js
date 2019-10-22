//internation 18 nation parser
Object.assign(ape, function () {
  var I18nParser = function () {};

  I18nParser.prototype._validate = function (data) {
      if (!data.header) {
          throw new Error('ape.I18n#addData: Missing "header" field');
      }
      if (!data.header.version) {
          throw new Error('ape.I18n#addData: Missing "header.version" field');
      }
      if (data.header.version !== 1) {
          throw new Error('ape.I18n#addData: Invalid "header.version" field');
      }

      if (!data.data) {
          throw new Error('ape.I18n#addData: Missing "data" field');
      } else if (!Array.isArray(data.data)) {
          throw new Error('ape.I18n#addData: "data" field must be an array');
      }

      for (var i = 0, len = data.data.length; i < len; i++) {
          var entry = data.data[i];
          if (!entry.info) {
              throw new Error('ape.I18n#addData: missing "data[' + i + '].info" field');
          }

          if (!entry.info.locale) {
              throw new Error('ape.I18n#addData: missing "data[' + i + '].info.locale" field');
          }
          if (typeof entry.info.locale !== 'string') {
              throw new Error('ape.I18n#addData: "data[' + i + '].info.locale" must be a string');
          }

          if (!entry.messages) {
              throw new Error('ape.I18n#addData: missing "data[' + i + '].messages" field');
          }
      }
  };

  I18nParser.prototype.parse = function (data) {
    //#ifdef DEBUG
    this._validate(data);
    //#endif
    //debug option hidding

    return data.data;
  };

  return {
    I18nParser: I18nParser
  };
}());
