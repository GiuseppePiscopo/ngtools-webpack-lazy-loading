# @ngtools/webpack Lazy Loading

This project has a twofold purpose:

1. provide easy reproducible for demonstrating and testing issues with @ngtools/webpack building lazy-loaded modules; and
2. provide a bare-bones example of how to build an application with lazy-loaded modules using @ngtools/webpack, with both AOT and JIT compilation.

Note that this project uses Webpack ^2.2.0. The behaviors described herein may not apply to earlier versions of Webpack (such as the 1.0 family).

### NPM Build Scripts

The project has the following NPM scripts for testing building the project with different configurations:

1. vanilla build: JIT compilation and no DLL bundles/chunks

  ```bash
  npm run build
  ```

2. JIT compilation and DLL bundles

  ```bash
  npm run build-with-dll
  ```

3. vanilla AOT: AOT compilation and no DLL bundles/chunks

  ```bash
  npm run aot
  ```

4. AOT compilation and DLL bundles

  ```bash
  npm run aot-with-dll
  ```

### NPM Serve scripts

The project has the following NPM scripts for testing serving the project with different configurations (using `webpack-dev-server`):


1. vanilla build: JIT compilation and no DLL bundles/chunks

  ```bash
  npm run serve
  ```

2. JIT compilation and DLL bundles

  ```bash
  npm run serve-with-dll
  ```

3. vanilla AOT: AOT compilation and no DLL bundles/chunks

  ```bash
  npm run serve-aot
  ```

4. AOT compilation and DLL bundles

  ```bash
  npm run serve-aot-with-dll
  ```

### Issues

As of @ngtools/webpack 1.2.8, there are a few disparate issues reproducible by this project:


#### 1. Lazy Loaded Routes Won't build

Using `npm run serve`, which is the most vanilla behavior (no chunks, no DLLs), will not generate lazy loaded routes for @ngtools/webpack versions ^1.2.6. This is because the [@ngtools/webpack plugin check for @angular/core/src/linker](https://github.com/angular/angular-cli/blob/v1.0.0-beta.30/packages/%40ngtools/webpack/src/plugin.ts#L247) will never be triggered. You can debug this by navigating to `node_modules/@ngtools/webpack/src/plugin.js` and adding the following above line 229:

  ```
  console.log("ContextModuleFactory resource: " + result.resource);
  ```

#### 2. Lazy Loaded Routes Won't Build with DLL bundles

To actually test this you'll need to do one of two things:

1. revert @ngtools/webpack to version 1.2.4 (before the [@ngtools/webpack plugin check for @angular/core/src/linker](https://github.com/angular/angular-cli/blob/v1.0.0-beta.30/packages/%40ngtools/webpack/src/plugin.ts#L247)); ir
2. comment out lines 229-231 of `node_modules/@ngtools/webpack/src/plugin.js` to override the `@angular/core/src/linker` check.

Now, running `npm run serve-with-dll` will not generate lazy loaded routes, regardless of the @ngtools/webpack version. This is because:

1. the webpack compiler used by @ngtools/webpack will never parse `@angular/core/src/linker`, which just incidentally has a `System.import` call;
2. the `System.import` call would then create an `ImportContextDependency` within the Webpack compilation;
3. which would then subsequently cause the calling of a `ContextModuleFactory` instance's [#create method](https://github.com/webpack/webpack/blob/v2.2.1/lib/ContextModuleFactory.js#L21)...
4. which would trigger the ContextModuleFactory's `after-resolve` plugin event...
5. which would finally trigger [this part](https://github.com/angular/angular-cli/blob/v1.0.0-beta.30/packages/%40ngtools/webpack/src/plugin.ts#L241) of the @ngtools/webpack plugin, which actually deals with injecting lazy-loaded modules as `ContextElementDependency`s into the Webpack compilation

#### Additional Notes

###### AOT compilation with DLL bundles fails on first build!

This is a known issue **with this project's webpack config**. This project uses the [DLLBundlesPlugin](https://github.com/shlomiassaf/webpack-dll-bundles-plugin) to keep everything in a single, simple webpack configruation and allow the DLL building to happen with the builds. Building the DLL bundles and performing the AOT compilation in the same build doesn't work quite yet, but it probably doesn't need to, since it seems DLL bundles probably aren't intended for production usage anyways.

Note that if you *do* want to test AOT compilation with DLL bundles for any reason, just re-running the AOT and DLL build task (e.g. `npm run aot-with-dll` or `npm run serve-aot-with-dll`) will work, since the DLL bundles will have been created for the second run by the first run.