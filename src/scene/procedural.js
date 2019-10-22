//procedural technique
var primitiveUv1Padding = 4.0 / 64;
var primitiveUvaPaddingScale = 1.0 - primitiveUv1Padding * 2;

ape.calculateNormals = function (positions, indices) {};
ape.calculateTangents = function (positions, normals, uvs, indices) {};
ape.createMesh = function (device, positions, opts) {};
ape.createTorus = function (device, opts) {};
ape._createConeData = function (baseRadius, peakRadius, height, heightSegments, capSegments, roundedCaps) {};
ape.createCylinder = function (device, opts) {};
ape.createCapsule = function (device, opts) {};
ape.createCone = function (device, opts) {};
ape.createSphere = function (device, opts) {};
ape.createPlane = function (device, opts) {};
ape.createBox = function (device, opts) {};
