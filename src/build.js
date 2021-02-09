import { rmdirSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { load } from 'js-yaml';
import { dataPath, distPath } from './config.js';

rmdirSync(distPath, { recursive: true });
mkdirSync(distPath)

const files = readdirSync(dataPath, (err, files) => {
    if (err) {
        throw Error(err)
    } else {
        return files
    }
});

const filteredFiles = files.filter(file => extname(file) === '.yml')


const api = {}
api.timestamp = new Date().toISOString();
api.data = []

filteredFiles.forEach( file => {
    const item = {}
    item.id = basename(file, '.yml');
    item.data = load(readFileSync(join(dataPath, file), 'utf8'));

    api.data.push(item)
})

writeFileSync('dist/api.json', JSON.stringify(api))
