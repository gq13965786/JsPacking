var app = new ape.fw.Application(document.querySelector("#application-canvas"));
var entity = new ape.fw.Entity();

app.context.root.addChild(entity);

app.start();


//var canvas = document.getElementById("application-canvas");
//var graphicsDevice = new  ape.gfx.GraphicsDevice(canvas);
//var programLib = new ape.gfx.ProgramLibrary();

//graphicsDevice.setCurrent();
//graphicsDevice.setProgramLibrary(programLib);
//var p = new ape.fw.picking.Picker(canvas,null,null);

//console.log(p);
