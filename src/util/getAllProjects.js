import { readdirSync} from 'fs';
import { extname } from 'path';
import { dataPath } from '../config.js';

const files = readdirSync(dataPath, (err, files) => {
    if (err) {
        throw Error(err)
    } else {
        return files
    }
});

const projects = files.filter(file => extname(file) === '.yml')

export default projects;
