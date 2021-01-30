const podcasts = require('../../services/parsePodcastXML')

export default async (req, res) => {
    await res.status(200).json(await podcasts())
}
