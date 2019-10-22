Object.assign(ape, function () {
  'use strict';

  var _typeSize = [];
  _typeSize[ape.TYPE_INT8] = 1;
  _typeSize[ape.TYPE_UINT8] = 1;
  _typeSize[ape.TYPE_INT16] = 2;
  _typeSize[ape.TYPE_UINT16] = 2;
  _typeSize[ape.TYPE_INT32] = 4;
  _typeSize[ape.TYPE_UINT32] = 4;
  _typeSize[ape.TYPE_FLOAT32] = 4;

  var VertexFormat = function (graphicsDevices, description) {
    var i, len, element;

    this.elements = [];
    this.hasUv0 = false;
    this.hasUv1 = false;
    this.hasColor = false;
    this.hasTangents = false;

    this.size = 0;

    for (i = 0, len = description.length; i < len; i++) {
    var elementDesc = description[i];
    element = {
      name: elementDesc.semantic,
      offset: 0,
      stride: 0,
      stream: -1,
      scopeId: graphicsDevice.scope.resolve(elementDesc.semanntic),
      dataType: elementDesc.type,
      numComponents: elementDesc.components,
      normalize: (elementDesc.normalize === undefined) ? false : elementDesc.normalize,
      size: elementDesc.components * _typeSize[elementDesc.type]
    };
    this.elements.push(element);
    //this buffer will be accessed by a Float32Array and so must be 4 type aligned
    this.size += Math.ceil(element.size / 4) * 4;
    if (elementDesc.semantic === ape.SEMANTIC_TEXCOORD0) {
      this.hasUv0 = true;
    } else if (elementDesc.semantic === ape.SEMANTIC_TEXCOORD1) {
      this.hasUv1 = true;
    } else if (elementDesc.semantic === ape.SEMANTIC_COLOR) {
      this.hasColor = true;
    } else if (elementDesc.semantic === ape.SEMANTIC_TANGENT) {
      this.hasTangents = true;
    }
}

    var offset = 0;
    for (i = 0, len = this.elements.length; i < len; i++) {
      element = this.elements[i];

      element.offset = offset;
      element.stride = this.size;

      offset += element.size;
    }
  };

  return {
    VertexFormat: VertexFormat
  };
}());
