import { rmdirSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import express from 'express'
import { dataPath, distPath } from './config.js';
const app = express();

const api = JSON.parse(readFileSync(`${distPath}/api.json`, 'utf8'))

app.listen(process.env.PORT, () => {
 console.log("Servidor correndo no porto 3000");
});

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('API funcionando en /api');
    res.end();
  });

app.get("/api", (req, res) => res.json(api));
