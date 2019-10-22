var fs = require('fs');
var path = require('path');

var release = process.argv.includes('--release');
var sourceFiles;

if (release) {
    console.log('Testing release build');
    sourceFiles = [path.resolve('ape-engine.js')];
} else {
    console.log('Testing unbuilt sources');
    sourceFiles = fs.readFileSync('build/dependencies.txt').toString().split('\n').map(function (value) {
        return path.resolve(value.replace('../', ''));
    });
}

module.exports = function(config) {
  config.set({
    basePath: "..",
    frameworks:['mocha'],
    files: sourceFiles.concat([
        // libraries
        'node_modules/sinon/pkg/sinon.js',
        'node_modules/chai/chai.js',

        // test environment setup
        'tests/setup.js',

        // test files - change this to a specific file in order to run a single suite
        'tests/**/test_*.js',

        // resources - list any files here that need to be loaded by tests (i.e. via XHR), or
        // need to be pre-loaded in order to provide helper functions etc.
        { pattern: 'tests/test-assets/**/*.*', included: false, served: true, watched: true, nocache: true },
        //{ pattern: 'tests/helpers/**/*.js', included: true, served: true, watched: true, nocache: true },
        { pattern: 'tests/input/simulate_event.js', included: true, served: true, watched: true, nocache: true }
    ]),
    // Serve .gz files with Content-Encoding: gzip
    customHeaders: [{
    match: '.*.gz',
    name: 'Content-Encoding',
    value: 'gzip'
    }],
    exclude:[],
    preprocessor:{},

    reporters:['spec'],
    port:9876,
    colors:true,
    logLevel:config.LOG_INFO,
    autoWatch:true,
    browsers:['Chrome'],
    singleRun: process.argv.includes('--single-run'),
    concurrency: 1
  });

};
