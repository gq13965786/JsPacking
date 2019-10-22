ape.gfx.VertexElementType = {
  INT8: 0,
  UINT8: 1,
  INT16: 2,
  UINT16: 3,
  INT32: 4,
  UINT32: 5,
  FLOAT32: 6
};

Object.assign(ape.gfx, function () {
  var _typeSize = [];
  _typeSize[ape.gfx.VertexElementType.INT8   ] = 1;
  _typeSize[ape.gfx.VertexElementType.UINT8  ] = 1;
  _typeSize[ape.gfx.VertexElementType.INT16  ] = 2;
  _typeSize[ape.gfx.VertexElementType.UINT16 ] = 2;
  _typeSize[ape.gfx.VertexElementType.INT32  ] = 4;
  _typeSize[ape.gfx.VertexElementType.UINT32 ] = 4;
  _typeSize[ape.gfx.VertexElementType.FLOAT32] = 4;

  var VertexElement = function (name, numComponents, dataType) {
    // These will be initialized by the VertexFormat constructor
    this.offset = 0;
    this.stride = 0;

    // This is used by the graphics device to tag the associated stream
    this.stream = -1;

    // Resolve the ScopeId for the element name
    var device = Device;
    this.scopeId = device.scope.resolve(name);

    // Store the data type information
    this.dataType      = dataType;
    this.numComponents = numComponents;

    // Calculate the size
    this.size = this.numComponents * _typeSize[this.dataType];//1,2,4
  }

  return {
    VertexElement: VertexElement
  };
}());
