
module.exports = {
  polyfills: [
    /*
     * Map the core-js polyfills to the format expected by the DllBundlesPlugin.
     * See https://github.com/shlomiassaf/webpack-dll-bundles-plugin/issues/8#issuecomment-275200105
     */
    ...[
      'core-js/es6/symbol',
      'core-js/es6/object',
      'core-js/es6/function',
      'core-js/es6/parse-int',
      'core-js/es6/parse-float',
      'core-js/es6/number',
      'core-js/es6/math',
      'core-js/es6/string',
      'core-js/es6/date',
      'core-js/es6/array',
      'core-js/es6/regexp',
      'core-js/es6/map',
      'core-js/es6/set',
      'core-js/es6/reflect',

      'core-js/es6/promise',
      'core-js/client/shim',
      'core-js/es7/reflect'
    ].map((path) => { return { name: 'core-js', path: path } }),
    {
      name: 'zone.js',
      path: 'zone.js/dist/zone.js'
    }
  ],
  vendor: [
    /**
     * Angular2
     */
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/compiler',
    '@angular/router',
    '@angular/common',
    '@angular/core',

    /**
     * Rxjs
     */
    'rxjs'
  ]
}