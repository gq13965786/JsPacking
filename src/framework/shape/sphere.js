Object.assign(ape.shape, function () {

    var Sphere = function Sphere(center, radius) {
        this.center = center || ape.math.vec3.create(0, 0, 0);
        this.radius = radius || 1;
    };
    Sphere.prototype = Object.create(ape.shape.Shape);
    Sphere.prototype.constructor = Sphere;
    // Add to the enumeration of types
    ape.shape.Type.SPHERE = "Sphere";

    Sphere.prototype.containsPoint = function (point) {
        var offset = ape.math.vec3.create();
        ape.math.vec3.subtract(point, this.center, offset);
        var length = ape.math.vec3.length(offset);

        return (length < this.radius);
    };
    Sphere.prototype.compute = function (vertices) {
        var i;
        var numVerts = vertices.length / 3;

        var vertex = ape.math.vec3.create(0, 0, 0);

        // FIRST PASS:
        // Find the "average vertex", which is the sphere's center...
        var avgVertex = ape.math.vec3.create(0, 0, 0);
        var sum = ape.math.vec3.create(0, 0, 0);

        for (i = 0; i < numVerts; i++) {
            ape.math.vec3.set(vertex, vertices[i*3], vertices[i*3+1], vertices[i*3+2]);
            ape.math.vec3.add(sum, vertex, sum);

            // apply a part-result to avoid float-overflows
            if (i % 100 === 0) {
                ape.math.vec3.scale(sum, 1.0 / numVerts, sum);
                ape.math.vec3.add(avgVertex, sum, avgVertex);
                ape.math.vec3.set(sum, 0.0, 0.0, 0.0);
            }
        }

        ape.math.vec3.scale(sum, 1.0 / numVerts, sum);
        ape.math.vec3.add(avgVertex, sum, avgVertex);
        ape.math.vec3.set(sum, 0.0, 0.0, 0.0);

        this.center = avgVertex;

        // SECOND PASS:
        // Find the maximum (squared) distance of all vertices to the center...
        var maxDistSq = 0.0;
        var centerToVert = ape.math.vec3.create(0, 0, 0);

        for (i = 0; i < numVerts; i++) {
            ape.math.vec3.set(vertex, vertices[i*3], vertices[i*3+1], vertices[i*3+2]);

            ape.math.vec3.subtract(vertex, this.center, centerToVert);
            var distSq = ape.math.vec3.dot(centerToVert, centerToVert);
            if (distSq > maxDistSq)
                maxDistSq = distSq;
        }

        this.radius = Math.sqrt(maxDistSq);
    }

    return {
        Sphere: Sphere
    };

}());
