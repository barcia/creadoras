import { deserializeFeed } from "https://deno.land/x/rss@0.3.1/mod.ts";

export function web(data) {
  if (data.feed) {
    return loadFeed(data.feed);
  }

  return data;
}

export async function youtube(id) {
  const feed = `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
  const data = await loadFeed(feed);

  // Entries from youtube feed doesn't include the video url
  // but we can get it from the id value yt:video:[id]
  if (data.lastEntry) {
    const videoId = data.lastEntry.id.replace("yt:video:", "");
    data.lastEntry.url = `https://www.youtube.com/watch?v=${videoId}`;
  }

  // Set the youtube channel url
  data.url = `https://www.youtube.com/channel/${id}/`;

  return data;
}

export function twitch(id) {
  const url = `https://www.twitch.tv/${id}`;
  return { url };
}

export function facebook(url) {
  return { url };
}

export function instagram(id) {
  const url = `https://instagram.com/${id}/`;
  return { url };
}

export function twitter(id) {
  const url = `https://twitter.com/${id}`;
  return { url };
}

export function tiktok(id) {
  const url = `https://www.tiktok.com/@${id}/`;
  return { url };
}

export function spotify(url) {
  return { url };
}

export function podcast(data) {
  return web(data);
}

export function newsletter(data) {
  return web(data);
}

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

async function getFeedData(url) {
  const response = await fetch(url);
  const xml = await response.text();
  const { feed } = await deserializeFeed(xml, { outputJsonFeed: true });
  return feed;
}
