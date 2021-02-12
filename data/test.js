import projects from '../src/util/getAllProjects.js'
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { dataPath } from '../src/config.js';
import Ajv from "ajv"

const ajv = new Ajv.default({ allErrors: true });
const schema = JSON.parse( readFileSync(join(dataPath, 'schema.json'), 'utf8') )
const validator = ajv.compile(schema)

projects.forEach( project => {
    const item = load(readFileSync(join(dataPath, project), 'utf8'));
    const isValid = validator(item)
    test(project, () => expect(isValid).toBe(true));
})
