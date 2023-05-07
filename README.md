When you install a dependency from git, npm should run the `prepack` script.  This script is responsible for "packing"
the source code into an npm module.  git clone -> prepack to build it -> pack into a tarball

yarn and pnpm do this.  npm has a bug and does not.

As a workaround, you can add this as a dependency and then declare in package.json:

```json
  "scripts": {
    "prepack": "your prepack script here",
    "prepare": "workaround-broken-npm-prepack-behavior prepack"
  }
```

It will run prepack only when prepare is being invoked by npm to set up a git dependency, not for any
other reason, such as cloning your project and running `npm install`.

### How it works

We detect when env var npm_config_local_prefix is a subdirectory of npm_config_cache, because that'll detect the only time in git dep installation where I should run compilation.

when npm installs a git dep:
- first invocation of prepare: where npm has cloned the git repo into npm's cache and installed devDependencies <-- detect this, run compilation
- second invocation of prepare: where npm is installing the package from cache ^^ into user's node_modules <-- do not compile

when running npm ci or npm install at project root, not a git dep:
- single invocation of prepare <-- do not compile

Probably some corner cases here, but I think for me this'll be good enough
