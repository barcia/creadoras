import {
  basename,
  extname,
  join,
} from "https://deno.land/std@0.87.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.87.0/encoding/yaml.ts";
import { deserializeFeed } from "https://deno.land/x/rss@0.3.1/mod.ts";
import Ajv from "https://jspm.dev/ajv@7.1.1";

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

  //Expand data using feed and other APIs
  if (data.channels.podcast) {
    data.channels.podcast = await loadFeed(data.channels.podcast);
  }

  if (data.channels.newsletter?.feed) {
    data.channels.newsletter = await loadFeed(data.channels.newsletter.feed);
  }

  if (data.channels.youtube) {
    data.channels.youtube = await loadYoutubeFeed(data.channels.youtube);
  }

  if (data.channels.web?.feed) {
    data.channels.web = await loadFeed(data.channels.web.feed);
  }

  all.push({ id, ...data });
}

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

async function loadFeed(url) {
  const feed = await getFeedData(url);
  const last = feed.items.shift();

  return {
    title: feed.title,
    description: feed.description,
    url: feed.home_page_url,
    feed: url,
    lastEntry: {
      id: last.id,
      title: last.title,
      summary: last.summary,
      url: last.external_url,
      date: last.date_published,
    },
  };
}

async function loadYoutubeFeed(url) {
  const pathname = new URL(url).pathname;

  //We need that the channel url includes the id (https://www.youtube.com/channel/{id})
  if (!pathname.startsWith("/channel/")) {
    return url;
  }

  const id = basename(pathname);
  const feed = `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
  const data = await loadFeed(feed);

  // Entries from youtube feed doesn't include the video url
  // but we can get it from the id value yt:video:[id]
  if (data.lastEntry) {
    const videoId = data.lastEntry.id.replace("yt:video:", "");
    data.lastEntry.url = `https://www.youtube.com/watch?v=${videoId}`;
  }

  return data;
}

async function getFeedData(url) {
  const response = await fetch(url);
  const xml = await response.text();
  const { feed } = await deserializeFeed(xml, { outputJsonFeed: true });
  return feed;
}
