import {writeFileSync} from 'fs';
import {fileUrlToPath, resolve} from 'path';

console.log('This is our prepack script. Building the module now.');
writeFileSync(resolve(fileUrlToPath(import.meta.url), '/generated.js'), 'exports.foo = "hello world"');