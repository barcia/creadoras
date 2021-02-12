import { rmdirSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { load } from 'js-yaml';
import { dataPath, distPath } from './config.js';
import projects from './util/getAllProjects.js'

rmdirSync(distPath, { recursive: true });
mkdirSync(distPath)

const api = {}
api.timestamp = new Date().toISOString();
api.data = []

projects.forEach( project => {
    const item = {}
    item.id = basename(project, '.yml');
    item.data = load(readFileSync(join(dataPath, project), 'utf8'));

    api.data.push(item)
})

writeFileSync('dist/api.json', JSON.stringify(api))
