(function(root, factory){
	if (typeof define === 'function' && define.amd) {
		define(['three','d.js','uevent','dot/doT'], factory);//Jquery
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('three'), require('d.js'), require('uevent'), require('dot/doT'));//nodejs
	} else {
		root.PhotoSphereViewer = factory(root.THREE, root.D, root.uEvent, root.doT);
	}
}(this, function (THREE,D,uEvent,doT){
	'use strict';
	
	var PhotoSphereViewer = {version:"0.1",unpack:function() {
  console.warn("ape.unpack has been deprecated and will be removed shortly. Please update your code.");
} };
	
	//@@js
	
	return PhotoSphereViewer;
}));