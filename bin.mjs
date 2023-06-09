#!/usr/bin/env node
import {spawnSync} from 'child_process';
import {isAbsolute, normalize, relative} from 'path';

const scriptName = process.argv[2];
const {
    npm_config_local_prefix,
    npm_config_cache,
    npm_package_resolved,
    npm_package_json,
    npm_node_execpath,
    npm_execpath
} = process.env;

function main() {
    if(isInstallingAsGitDepInNpm()) {
        console.log(`Detected installation as git dependency; running \`npm ${scriptName}\``);
        npmRun(scriptName);
    } else {
        console.log(`Not a git dependency installation; skipping \`npm ${scriptName}\``);
    }
}

function isInstallingAsGitDepInNpm() {
    if(!npm_config_cache) return false;
    const normalizedNpmConfigCache = normalize(npm_config_cache);

    // Check if any of these paths are within npm's cache directory
    for(const path of [npm_package_json, npm_package_resolved, npm_config_local_prefix]) {
        if (!path) continue;
        // If local prefix is subdirectory of cache, assume we're being installed as
        // a git dep
        const normalized = normalize(path);
        const rel = relative(normalizedNpmConfigCache, normalized);
        if(!isAbsolute(rel) && !rel.startsWith('..')) return true;
    }
}

function npmRun(scriptName) {
    spawnSync(npm_node_execpath, [npm_execpath, 'run', scriptName], {
        stdio: 'inherit',
    });
}

main();
