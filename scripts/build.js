import {
  basename,
  extname,
  join,
} from "https://deno.land/std@0.87.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.87.0/encoding/yaml.ts";
import { deserializeFeed } from "https://deno.land/x/rss@0.3.1/mod.ts";

const all = [];

for await (const entry of Deno.readDir("data")) {
  if (extname(entry.name) !== ".yml") {
    continue;
  }

  const id = basename(entry.name, ".yml");
  const data = parse(await Deno.readTextFile(join("data", entry.name)));

  //Expand data
  if (data.channels.podcast) {
    data.channels.podcast = await loadPodcast(data.channels.podcast);
  }

  // const feed = data.channels?.web?.feed;
  // if (feed) {
  //   data.channels.web.lastEntry = await getLastEntry(feed);
  // }

  all.push({ id, ...data });
}

console.log(all[5]);

async function loadPodcast(url) {
  const feed = await getFeedData(url);
  const last = feed.items.shift();

  return {
    title: feed.title,
    description: feed.description,
    url: feed.home_page_url,
    lastEntry: {
      title: last.title,
      summary: last.summary,
      url: last.external_url,
      date: last.date_published,
    },
  };
}

async function getFeedData(url) {
  const response = await fetch(url);
  const xml = await response.text();
  const { feed } = await deserializeFeed(xml, { outputJsonFeed: true });
  return feed;
}

async function getLastEntry(url) {
  const feed = await getFeedData(url);
  const last = feed.items.shift();

  if (last) {
    return {
      title: last.title,
      url: last.external_url,
      date: last.date_published,
    };
  }
}
