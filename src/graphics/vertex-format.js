Object.assign(ape.gfx, function () {
  var VertexFormat = function () {
    this.size = 0;
    this.numElements = 0;
    this.elements = [];
  };

  Object.assign(VertexFormat.prototype, {
    begin: function () {
      this.size = 0;
      this.numElements = 0;
      this.elements = [];
    },
    end: function () {
      var offset = 0;

      // Now we have the complete format, update the
      // offset and stride of each vertex element
      var i = 0;
      var elements = this.elements;
      var numElements = this.numElements;
      while (i < numElements) {
          var vertexElement = elements[i++];

          vertexElement.offset = offset;
          vertexElement.stride = this.size;

          offset += vertexElement.size;
      }
    },
    addElement: function (vertexElement) {
      this.size += vertexElement.size;
      this.numElements++;
      this.elements.push(vertexElement);
    }
  });

  return {
    VertexFormat: VertexFormat
  };
}());
