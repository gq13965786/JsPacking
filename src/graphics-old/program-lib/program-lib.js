ape.programlib = {
    gammaCode: function (value) {
        if (value === ape.GAMMA_SRGB || value === ape.GAMMA_SRGBFAST) {
            return ape.shaderChunks.gamma2_2PS;
        } else if (value === ape.GAMMA_SRGBHDR) {
            return "#define HDR\n" + ape.shaderChunks.gamma2_2PS;
        }
        return ape.shaderChunks.gamma1_0PS;
    },

    tonemapCode: function (value) {
        if (value === ape.TONEMAP_FILMIC) {
            return ape.shaderChunks.tonemappingFilmicPS;
        } else if (value === ape.TONEMAP_LINEAR) {
            return ape.shaderChunks.tonemappingLinearPS;
        } else if (value === ape.TONEMAP_HEJL) {
            return ape.shaderChunks.tonemappingHejlPS;
        } else if (value === ape.TONEMAP_ACES) {
            return ape.shaderChunks.tonemappingAcesPS;
        } else if (value === ape.TONEMAP_ACES2) {
            return ape.shaderChunks.tonemappingAces2PS;
        }
        return ape.shaderChunks.tonemappingNonePS;
    },

    fogCode: function (value) {
        if (value === 'linear') {
            return ape.shaderChunks.fogLinearPS;
        } else if (value === 'exp') {
            return ape.shaderChunks.fogExpPS;
        } else if (value === 'exp2') {
            return ape.shaderChunks.fogExp2PS;
        }
        return ape.shaderChunks.fogNonePS;
    },

    skinCode: function (device, chunks) {
        if (!chunks) chunks = ape.shaderChunks;
        if (device.supportsBoneTextures) {
            return chunks.skinTexVS;
        }
        return "#define BONE_LIMIT " + device.getBoneLimit() + "\n" + chunks.skinConstVS;
    },

    precisionCode: function (device) {
        var pcode = 'precision ' + device.precision + ' float;\n';
        if (device.webgl2) {
            pcode += '#ifdef GL2\nprecision ' + device.precision + ' sampler2DShadow;\n#endif\n';
        }
        return pcode;
    },

    versionCode: function (device) {
        return device.webgl2 ? "#version 300 es\n" : "";
    },

    dummyFragmentCode: function () {
        return "void main(void) {gl_FragColor = vec4(0.0);}";
    },

    begin: function () {
        return 'void main(void)\n{\n';
    },

    end: function () {
        return '}\n';
    }
};
