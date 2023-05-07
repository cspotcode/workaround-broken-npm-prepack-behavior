When you install a dependency from git, npm should run the `prepack` script.  This script is responsible for "packing"
the source code into an npm module.  git clone -> prepack to build it -> pack into a tarball

yarn and pnpm do this.  npm has a bug and does not.

As a workaround, you can add this as a dependency and call it in your prepare script. Add to your package.json:

```jsonc
  "devDependencies": {
        "workaround-broken-npm-prepack-behavior": "https://github.com/cspotcode/workaround-broken-npm-prepack-behavior#main"
        // or lock to a single commit hash. Do not use the hash shown here; use the latest commit on `main`
        "workaround-broken-npm-prepack-behavior": "https://github.com/cspotcode/workaround-broken-npm-prepack-behavior#59e32763ce19d087062b6ce287a21ee00d9a7187"
  }
  "scripts": {
    "prepack": "your prepack script here",
    "prepare": "workaround-broken-npm-prepack-behavior prepack"
  }
```

It will run prepack only when prepare is being invoked by npm to set up a git dependency, not for any
other reason, such as cloning your project and running `npm install`.

### How it works

npm sets a variety of env vars with the paths to package.json, the local package, etc.  When one of those paths is within
the npm cache directory, we assume it's a git dependency being prepared.
