import {spawnSync} from 'child_process';
import {normalize, relative} from 'path';
const scriptName = process.argv[2];
const {
    npm_config_local_prefix,
    npm_config_cache
} = process.env;

function main() {
    if(isInstallingAsGitDepInNpm()) {
        console.log('Running `npm prepare`');
        npmRun(scriptName);
    } else {
        console.log('Not running `npm prepare`');
    }
}

function isInstallingAsGitDepInNpm() {
    if(!npm_config_cache || !npm_config_local_prefix) return false;
    const normalizedNpmConfigLocalPrefix = normalize(npm_config_local_prefix);
    const normalizedNpmConfigCache = normalize(npm_config_cache);
    const rel = relative(normalizedNpmConfigCache, normalizedNpmConfigLocalPrefix);
    if(/^\.[\/\\]/.test(rel)) {
        return true;
    }
}

function npmRun(scriptName) {
    spawnSync(npm_bin, ['run', scriptName], {
        stdio: 'inherit',
    });
}

main();
