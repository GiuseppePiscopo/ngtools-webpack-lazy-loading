var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpackMerge = require('webpack-merge'),
    DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin,
    AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin'),
    ngTools = require('@ngtools/webpack');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ __dirname ].concat(args));
}

function buildConfig(env) {

  const useDLL = !!(env.USE_DLL && JSON.parse(env.USE_DLL));
  const useAOT = !!(env.AOT && JSON.parse(env.AOT));

  console.log("Building DLLs: ", useDLL);
  console.log("Building AOT:  ", useAOT);
  console.log("\n");

  const aotPlugin = new ngTools.AotPlugin({
        tsConfigPath: root('src/client/tsconfig.json'),
        mainPath: root('src', 'client', 'main.ts'),
        skipCodeGeneration: !useAOT
  });

  var config = {

      target: 'web',

      resolve: {
        extensions: ['.ts', '.js'],
        modules: [
          root('node_modules'),
          root('src/client')
        ]
      },

      entry: [
        /*
        * The main Angular2 app entry point
        */
        './src/client/main.ts'
      ],

      output: {
        path: root('dist'),
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].bundle.map',
        chunkFilename: '[id].chunk.js'
      },

      devServer: {
        historyApiFallback: true
      },

      module: {
        rules: [
          /**
           * The @ngtools/webpack plugin handles typescript compilation with some
           * added features, like baked in support for template parsing and
           * AOT (Ahead-Of-Time) compilation, although AOT compilation requires
           * adding and configuring the @ngtools/webaack.AOTPlugin plugin
           */
          {
            test: /\.ts$/,
            use: '@ngtools/webpack'
          },
          /**
           * Load all of the component HTML files. We're not interested in any
           * particular pre-processing, so the raw-loader is ok. Note that
           * we're excluding the inex.html file since that is handled by the
           * HtmlWebpackPlugin, which also handles dynamically injecting script
           * and link tags into the index.html file
           */
          {
            test: /\.html$/,
            use: 'raw-loader',
            exclude: [root('src/client/index.html')]
          },
        ]
      },

      plugins: [

        /**
         * Applies some post-processing to the index.html file to inject the
         * script and styles required and generated by this project
         */
        new HtmlWebpackPlugin({
          template: './src/client/index.html',
          filename: './index.html'
        }),

        /**
         * Use the ContextReplacementPlugin to remap imports for the following
         * to the root of the application. Note that this is pretty much just
         * copied from other Angular2 build scripts, but theoretically makes
         * sense.
         */
        new webpack.ContextReplacementPlugin(
          /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
          root('src/client')
        )
      ]
  };

  if (useDLL) {
    config.plugins.push(
      /**
       * Plugin: AddAssetHtmlPlugin
       * Description: Adds the given JS or CSS file to the files
       * Webpack knows about, and put it into the list of assets
       * html-webpack-plugin injects into the generated html.
       *
       * See: https://github.com/SimenB/add-asset-html-webpack-plugin
       */
      new AddAssetHtmlPlugin([
        { filepath: root(`dist/dll/${DllBundlesPlugin.resolveFile('polyfills')}`) },
        { filepath: root(`dist/dll/${DllBundlesPlugin.resolveFile('vendor')}`) }
      ])
    );
    config.plugins.push(
      /**
       * The dll-bundles-webpack-plugin does some work of registering the
       * appropriate DLL handlers with Webpack, and allows the ability to
       * retrieve the name of generated DLLs, which is very useful when
       * the DLL name includes a hash or some other dynamic value.
       *
       * Note that oddly enough, it needs to be merged with the common config
       */
      new DllBundlesPlugin({
        bundles: require('./dll.includes.js'),
        dllDir: root('dist', 'dll'),
        webpackConfig: webpackMerge(config, {
          devtool: 'cheap-module-source-map',
          plugins: [].concat([aotPlugin, ...config.plugins])
        })
      })
    );
  }

  config.plugins.push(aotPlugin);

  return config;
}

module.exports = buildConfig;
