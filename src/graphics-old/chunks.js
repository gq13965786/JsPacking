Object.assign(ape, (function () {
    'use strict';

    var shaderChunks = {};

    var attrib2Semantic = {
        vertex_position: ape.SEMANTIC_POSITION,
        vertex_normal: ape.SEMANTIC_NORMAL,
        vertex_tangent: ape.SEMANTIC_TANGENT,
        vertex_texCoord0: ape.SEMANTIC_TEXCOORD0,
        vertex_texCoord1: ape.SEMANTIC_TEXCOORD1,
        vertex_texCoord2: ape.SEMANTIC_TEXCOORD2,
        vertex_texCoord3: ape.SEMANTIC_TEXCOORD3,
        vertex_texCoord4: ape.SEMANTIC_TEXCOORD4,
        vertex_texCoord5: ape.SEMANTIC_TEXCOORD5,
        vertex_texCoord6: ape.SEMANTIC_TEXCOORD6,
        vertex_texCoord7: ape.SEMANTIC_TEXCOORD7,
        vertex_color: ape.SEMANTIC_COLOR,
        vertex_boneIndices: ape.SEMANTIC_BLENDINDICES,
        vertex_boneWeights: ape.SEMANTIC_BLENDWEIGHT
    };

    shaderChunks.collectAttribs = function (vsCode) {
        var attribs = {};
        var attrs = 0;

        var found = vsCode.indexOf("attribute");
        while (found >= 0) {
            if (found > 0 && vsCode[found - 1] === "/") break;
            var endOfLine = vsCode.indexOf(';', found);
            var startOfAttribName = vsCode.lastIndexOf(' ', endOfLine);
            var attribName = vsCode.substr(startOfAttribName + 1, endOfLine - (startOfAttribName + 1));

            var semantic = attrib2Semantic[attribName];
            if (semantic !== undefined) {
                attribs[attribName] = semantic;
            } else {
                attribs[attribName] = "ATTR" + attrs;
                attrs++;
            }

            found = vsCode.indexOf("attribute", found + 1);
        }
        return attribs;
    };


    shaderChunks.createShader = function (device, vsName, psName, useTransformFeedback) {
        var vsCode = shaderChunks[vsName];
        var psCode = ape.programlib.precisionCode(device) + "\n" + shaderChunks[psName];
        var attribs = this.collectAttribs(vsCode);

        if (device.webgl2) {
            vsCode = ape.programlib.versionCode(device) + this.gles3VS + vsCode;
            psCode = ape.programlib.versionCode(device) + this.gles3PS + psCode;
        }

        return new ape.Shader(device, {
            attributes: attribs,
            vshader: vsCode,
            fshader: psCode,
            useTransformFeedback: useTransformFeedback
        });
    };

    shaderChunks.createShaderFromCode = function (device, vsCode, psCode, uName, useTransformFeedback) {
        var shaderCache = device.programLib._cache;
        var cached = shaderCache[uName];
        if (cached !== undefined) return cached;

        psCode = ape.programlib.precisionCode(device) + "\n" + (psCode || ape.programlib.dummyFragmentCode());
        var attribs = this.collectAttribs(vsCode);

        if (device.webgl2) {
            vsCode = ape.programlib.versionCode(device) + this.gles3VS + vsCode;
            psCode = ape.programlib.versionCode(device) + this.gles3PS + psCode;
        }

        shaderCache[uName] = new ape.Shader(device, {
            attributes: attribs,
            vshader: vsCode,
            fshader: psCode,
            useTransformFeedback: useTransformFeedback
        });
        return shaderCache[uName];
    };

    return {
        shaderChunks: shaderChunks
    };
}()));
