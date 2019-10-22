Object.assign(ape.fw, function () {
  var ApplicationContext = function (loader, scene, registry, controller, keyboard, mouse) {
      this.loader = loader;
      this.scence = scene;
      this.root = new ape.scene.GraphNode();

      this.systems = registry;
      this.controller = controller;
      this.keyboard = keyboard;
      this.mouse = mouse;
  }
  return {
    ApplicationContext: ApplicationContext
  }
}());
