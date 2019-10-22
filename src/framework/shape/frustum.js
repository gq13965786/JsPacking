Object.assign(ape.shape, function () {

    var Frustum = function Frustum (projectionMatrix, viewMatrix) {
        projectionMatrix = projectionMatrix || ape.math.mat4.makePerspective(90.0, 16 / 9, 0.1, 1000.0);
        viewMatrix       = viewMatrix       || ape.math.mat4.create();

        var viewProj = ape.math.mat4.multiply(projectionMatrix, viewMatrix);

        this.planes = [];

        // Extract the numbers for the RIGHT plane
        this.planes[0] = [];
        this.planes[0][0] = viewProj[ 3] - viewProj[ 0];
        this.planes[0][1] = viewProj[ 7] - viewProj[ 4];
        this.planes[0][2] = viewProj[11] - viewProj[ 8];
        this.planes[0][3] = viewProj[15] - viewProj[12];
        // Normalize the result
        t = Math.sqrt(this.planes[0][0] * this.planes[0][0] + this.planes[0][1] * this.planes[0][1] + this.planes[0][2] * this.planes[0][2]);
        this.planes[0][0] /= t;
        this.planes[0][1] /= t;
        this.planes[0][2] /= t;
        this.planes[0][3] /= t;

        // Extract the numbers for the LEFT plane
        this.planes[1] = [];
        this.planes[1][0] = viewProj[ 3] + viewProj[ 0];
        this.planes[1][1] = viewProj[ 7] + viewProj[ 4];
        this.planes[1][2] = viewProj[11] + viewProj[ 8];
        this.planes[1][3] = viewProj[15] + viewProj[12];
        // Normalize the result
        t = Math.sqrt(this.planes[1][0] * this.planes[1][0] + this.planes[1][1] * this.planes[1][1] + this.planes[1][2] * this.planes[1][2]);
        this.planes[1][0] /= t;
        this.planes[1][1] /= t;
        this.planes[1][2] /= t;
        this.planes[1][3] /= t;

        // Extract the BOTTOM plane
        this.planes[2] = [];
        this.planes[2][0] = viewProj[ 3] + viewProj[ 1];
        this.planes[2][1] = viewProj[ 7] + viewProj[ 5];
        this.planes[2][2] = viewProj[11] + viewProj[ 9];
        this.planes[2][3] = viewProj[15] + viewProj[13];
        // Normalize the result
        t = Math.sqrt(this.planes[2][0] * this.planes[2][0] + this.planes[2][1] * this.planes[2][1] + this.planes[2][2] * this.planes[2][2] );
        this.planes[2][0] /= t;
        this.planes[2][1] /= t;
        this.planes[2][2] /= t;
        this.planes[2][3] /= t;

        // Extract the TOP plane
        this.planes[3] = [];
        this.planes[3][0] = viewProj[ 3] - viewProj[ 1];
        this.planes[3][1] = viewProj[ 7] - viewProj[ 5];
        this.planes[3][2] = viewProj[11] - viewProj[ 9];
        this.planes[3][3] = viewProj[15] - viewProj[13];
        // Normalize the result
        t = Math.sqrt(this.planes[3][0] * this.planes[3][0] + this.planes[3][1] * this.planes[3][1] + this.planes[3][2] * this.planes[3][2]);
        this.planes[3][0] /= t;
        this.planes[3][1] /= t;
        this.planes[3][2] /= t;
        this.planes[3][3] /= t;

        // Extract the FAR plane
        this.planes[4] = [];
        this.planes[4][0] = viewProj[ 3] - viewProj[ 2];
        this.planes[4][1] = viewProj[ 7] - viewProj[ 6];
        this.planes[4][2] = viewProj[11] - viewProj[10];
        this.planes[4][3] = viewProj[15] - viewProj[14];
        // Normalize the result
        t = Math.sqrt(this.planes[4][0] * this.planes[4][0] + this.planes[4][1] * this.planes[4][1] + this.planes[4][2] * this.planes[4][2]);
        this.planes[4][0] /= t;
        this.planes[4][1] /= t;
        this.planes[4][2] /= t;
        this.planes[4][3] /= t;

        // Extract the NEAR plane
        this.planes[5] = [];
        this.planes[5][0] = viewProj[ 3] + viewProj[ 2];
        this.planes[5][1] = viewProj[ 7] + viewProj[ 6];
        this.planes[5][2] = viewProj[11] + viewProj[10];
        this.planes[5][3] = viewProj[15] + viewProj[14];
        // Normalize the result
        t = Math.sqrt(this.planes[5][0] * this.planes[5][0] + this.planes[5][1] * this.planes[5][1] + this.planes[5][2] * this.planes[5][2]);
        this.planes[5][0] /= t;
        this.planes[5][1] /= t;
        this.planes[5][2] /= t;
        this.planes[5][3] /= t;
    };
    Frustum.prototype = Object.create(ape.shape.Shape);
    Frustum.prototype.constructor = Frustum;
//need fix inherits
    Frustum.prototype.containsPoint = function (point) {
        for (var p = 0; p < 6; p++)
            if (this.planes[p][0] * point[0] +
                this.planes[p][1] * point[1] +
                this.planes[p][2] * point[2] +
                this.planes[p][3] <= 0)
                return false;
        return true;
    };
    Frustum.prototype.containsSphere = function (sphere) {
        var c = 0;
        var d;
        for (p = 0; p < 6; p++) {
            d = this.planes[p][0] * sphere.center[0] +
                this.planes[p][1] * sphere.center[1] +
                this.planes[p][2] * sphere.center[2] +
                this.planes[p][3];
            if (d <= -sphere.radius)
                return 0;
            if (d > sphere.radius)
                c++;
        }
        return (c === 6) ? 2 : 1;
    }

    return {
        Frustum: Frustum
    }
}());
