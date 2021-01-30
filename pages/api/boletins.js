const boletins = require('../../data/boletins')

export default async (req, res) => {
    await res.status(200).json(boletins)
}
