
ape.shape = function () {

    var Shape = function Shape() {};
    Shape.prototype = {

        containsPoint: function (point) {
            throw new Error("Shape hasn't implemented containsPoint");
        }
    }
    return {
        Shape: Shape,
        Type: {
            CONE: "Cone", // TODO: this should go in shape_code.js
            CYLINDER: "Cylinder" // TODO: this should go in shape_cylinder.js
        }
    };
}();
