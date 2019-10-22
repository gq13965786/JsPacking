describe("ape.gfx.ProgramLibrary", function () {
  it("getProgram: all permutations of phong", function () {
    canvas = document.createElement("canvas");
    device = new ape.gfx.GraphicsDevice(canvas);
    device.setCurrent();
    var library = new ape.gfx.ProgramLibrary();
    ok(library);

    library.register("phong",
                     ape.gfx.programlib.phong.generateVertexShader,
                     ape.gfx.programlib.phong.generateFragmentShader,
                     ape.gfx.programlib.phong.generateKey);
    var registered = library.isRegistered("phong");
    ok(registered);

    for (var skinning = 0; skinning <= 1; skinning++) {
        for (var reflMapping = 0; reflMapping <= 2; reflMapping++) {
            for (var bumpMapping = 0; bumpMapping <= 2; bumpMapping++) {
                for (var diffuseMapping = 0; diffuseMapping <= 1; diffuseMapping++) {
                    for (var opacityMapping = 0; opacityMapping <= 1; opacityMapping++) {
                        for (var shadowMapping = 0; shadowMapping <= 1; shadowMapping++) {
                            for (var specularMapping = 0; specularMapping <= 1; specularMapping++) {
                                for (var numDirectionals = 0; numDirectionals <= 1; numDirectionals++) {
                                    for (var numPoints = 0; numPoints <= 1; numPoints++) {
                                        var options = {
                                            skinning: skinning === 1,
                                            diffuseMapping: (diffuseMapping === 1),
                                            opacityMapping: (opacityMapping === 1),
                                            specularMapping: (specularMapping === 1),
                                            sphereMapping: (reflMapping === 1),
                                            cubeMapping: (reflMapping === 2),
                                            bumpMapping: (bumpMapping === 1),
                                            normalMapping: (bumpMapping === 2),
                                            shadowMapping: (shadowMapping === 1),
                                            lightMapping: false,
                                            numDirectionals: numDirectionals,
                                            numPoints: numPoints
                                        };
                                        var program = library.getProgram("phong", options);
                                        ok(program);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  });
});
