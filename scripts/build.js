// deno run --allow-read --allow-write --allow-net scripts/build.js

import {
  basename,
  extname,
  join,
} from "https://deno.land/std@0.87.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.87.0/encoding/yaml.ts";
import Ajv from "https://jspm.dev/ajv@7.1.1";
import { ensureDir } from "https://deno.land/std@0.88.0/fs/ensure_dir.ts";
import * as channels from "./channels.js";

const all = [];
const ajv = new Ajv.default({ allErrors: true, allowUnionTypes: true });
const schema = JSON.parse(await Deno.readTextFile("scripts/schema.json"));
const validator = ajv.compile(schema);

for await (const entry of Deno.readDir("data")) {
  if (extname(entry.name) !== ".yml") {
    continue;
  }

  const id = basename(entry.name, ".yml");
  const data = parse(await Deno.readTextFile(join("data", entry.name)));
  const valid = validator(data);

  if (!valid) {
    console.log("");
    console.log(`Error in "${entry.name}"`);
    console.log("");
    console.log(validator.errors);
    Deno.exit(1);
  }

  //Fetch channels data
  for (const [channelType, channelData] of Object.entries(data.channels)) {
    data.channels[channelType] = await channels[channelType](channelData);
  }

  all.push({ id, ...data });
}

await ensureDir("dist");

Deno.writeTextFile(
  "dist/api.json",
  JSON.stringify(
    {
      lastUpdated: new Date(),
      data: all,
    },
    null,
    2,
  ),
);
