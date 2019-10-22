function VertexIteratorSetter(buffer, vertexElement) {
  this.index = 0;

  switch (vertexElement.dataType) {
      case ape.gfx.VertexElementType.INT8:
          this.array = new Int8Array(buffer, vertexElement.offset);
          break;
      case ape.gfx.VertexElementType.UINT8:
          this.array = new Uint8Array(buffer, vertexElement.offset);
          break;
      case ape.gfx.VertexElementType.INT16:
          this.array = new Int16Array(buffer, vertexElement.offset);
          break;
      case ape.gfx.VertexElementType.UINT16:
          this.array = new Uint16Array(buffer, vertexElement.offset);
          break;
      case ape.gfx.VertexElementType.INT32:
          this.array = new Int32Array(buffer, vertexElement.offset);
          break;
      case ape.gfx.VertexElementType.UINT32:
          this.array = new Uint32Array(buffer, vertexElement.offset);
          break;
      case ape.gfx.VertexElementType.FLOAT32:
          this.array = new Float32Array(buffer, vertexElement.offset);
          break;
  }
//Methods
  switch(vertexElement.numComponents) {
    case 1: this.set = VertexIteratorSetter_set1; break;
    case 2: this.set = VertexIteratorSetter_set2; break;
    case 3: this.set = VertexIteratorSetter_set3; break;
    case 4: this.set = VertexIteratorSetter_set4; break;
  }
}

function VertexIteratorSetter_set1(a) {
  this.array[this.index] = a;
}
function VertexIteratorSetter_set2(a, b) {
  this.array[this.index] = a;
  this.array[this.index + 1] = b;
}
function VertexIteratorSetter_set3(a, b, c) {
  this.array[this.index] = a;
  this.array[this.index + 1] = b;
  this.array[this.index + 2] = c;
}
function VertexIteratorSetter_set4(a, b, c, d) {
  this.array[this.index] = a;
  this.array[this.index + 1] = b;
  this.array[this.index + 2] = c;
  this.array[this.index + 3] = d;
}

ape.gfx.VertexIterator = function VertexIterator(vertexBuffer) {
  // Store the vertex buffer
  this.vertexBuffer = vertexBuffer;

  // Lock the vertex buffer
  this.buffer = this.vertexBuffer.lock();

  // Create an empty list
  this.setters = [];
  this.element = {};

  // Add a new 'setter' function for each element
  var vertexFormat = this.vertexBuffer.getFormat();
  for (var i = 0; i < vertexFormat.numElements; i++) {
      var vertexElement = vertexFormat.elements[i];
      this.setters[i] = new VertexIteratorSetter(this.buffer, vertexElement);
      this.element[vertexElement.scopeId.name] = this.setters[i];
  }
}
ape.gfx.VertexIterator.prototype.next = function () {
  var i = 0;
  var setters = this.setters;
  var numSetters = this.setters.length;
  var vertexFormat = this.vertexBuffer.getFormat();
  while (i < numSetters) {
    var setter = setters[i++];
    setter.index += vertexFormat.size / setter.array.BYTES_PER_ELEMENT;
  }
}
ape.gfx.VertexIterator.prototype.end = function () {
  //Unlock the vertex buffer
  this.vertexBuffer.unlock();
}
