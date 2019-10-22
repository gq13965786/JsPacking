Object.assign(ape, function () {
  'use strict';

  function VertexIteratorAccessor(buffer, vertexElement) {
    this.index = 0;

    switch (vertexElement.dataType) {
      case ape.TYPE_INT8:
          this.array = new Int8Array(buffer, vertexElement.offset);
          break;
      case ape.TYPE_UINT8:
          this.array = new Uint8Array(buffer, vertexElement.offset);
          break;
      case ape.TYPE_INT16:
          this.array = new Int16Array(buffer, vertexElement.offset);
          break;
      case ape.TYPE_UINT16:
          this.array = new Uint16Array(buffer, vertexElement.offset);
          break;
      case ape.TYPE_INT32:
          this.array = new Int32Array(buffer, vertexElement.offset);
          break;
      case ape.TYPE_UINT32:
          this.array = new Uint32Array(buffer, vertexElement.offset);
          break;
      case ape.TYPE_FLOAT32:
          this.array = new Float32Array(buffer, vertexElement.offset);
          break;
    }
    //Methods
    switch (vertexElement.numComponents) {
      case 1: this.set = VertexIteratorAccessor_set1; break;
      case 2: this.set = VertexIteratorAccessor_set2; break;
      case 3: this.set = VertexIteratorAccessor_set3; break;
      case 4: this.set = VertexIteratorAccessor_set4; break;
    }
  }

  VertexIteratorAccessor.prototype.get = function (offset) {
    return this.array[this.index + offset];
  };
  function VertexIteratorAccessor_set1(a) {
    this.array[this.index] = a;
  }
  function VertexIteratorAccessor_set2(a, b) {
    this.array[this.index] =a;
    this.array[this.index + 1] = b;
  }
  function VertexIteratorAccessor_set3(a, b, c) {
    this.array[this.index] = a;
    this.array[this.index + 1] = b;
    this.array[this.index + 2] = c;
  }
  function VertexIteratorAccessor_set4(a, b, c, d) {
    this.array[this.index] = a;
    this.array[this.index + 1] = b;
    this.array[this.index + 2] = c;
    this.array[this.index + 3] = d;
  }

  function VertexIterator(vertexBuffer) {
    //store the vertex buffer
    this.vertexBuffer = vertexBuffer;
    //lock the vertex buffer
    this.buffer = this.vertexBuffer.lock();
    //create an empty list
    this.accessors = [];
    this.element = {};

    //Add a new 'setter' function for each element
    var vertexFormat = this.vertexBuffer.getFormat();
    for (var i = 0; i < vertexFormat.elements.length; i++) {
      var vertexElement = vertexFormat.elements[i];
      this.accessors[i] = new VertexIteratorAccessor(this.buffer, vertexElement);
      this.element[vertexElement.name] = this.accessors[i];
    }
  }
  Object.assign(VertexIterator.prototype, {
    next: function (count) {
      if (count === undefined) count = 1;

      var i = 0;
      var accessors = this.accessors;
      var numAccessors = this.accessors.length;
      var vertexFormat = this.vertexBuffer.getFormat();
      while (i < numAccessors) {
        var accessor = accessors[i++];
        accessor.index += (count* vertexFormat.size/accessor.array.constructor.BYTES_PER_ELEMENT);
      }
    },
    end: function () {
      //unlock the vertex buffer
      this.vertexBuffer.unlock();
    }
  });

  return {
    VertexIterator: VertexIterator
  };
}());
