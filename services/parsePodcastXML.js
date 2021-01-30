const parser = require("podcast-feed-parser")
const podcastsFeeds = require("../data/podcasts")

const getPodcastData = async feed => await parser.getPodcastFromURL(feed);

const customPodcastData = async feed => {
    const raw = await getPodcastData(feed);

    const data = {
        title: raw.meta.title,
        description: raw.meta.description,
        image: raw.meta.imageURL,
        lastUpdated: raw.meta.lastUpdated,
        webiste: raw.meta.link,
        author: {
            name: raw.meta.owner.name
        },
        episodes: raw.episodes[0]
    }

    return data
}

module.exports = async () => await Promise.all( podcastsFeeds.map( item => customPodcastData(item.url_feed)));
