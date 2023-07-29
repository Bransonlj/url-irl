const express = require('express');
const Urls = require('../models/urlModel');

const router = express.Router();

const YEAR_IN_MILISECONDS = 1000 * 60 * 60 * 24 * 365;


router.get('/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await Urls.findOne({ shortURL: name });
        if (result) {
            res.status(200).json(result);
            // update last used date
            await Urls.updateOne({ shortURL: name }, { lastUse: new Date() })
        } else {
            // no url found
            res.status(400).json("no such url found");
        }
    } catch (error) {
        res.status(400).json(error.message);
    }


})

router.post('/', async (req, res) => {
    const url = req.body;
    console.log(url);
    url.lastUse = new Date()    
    // check if shortUrl exists in database
    const matchingShortUrls = await Urls.find({ shortURL: url.shortURL })
    if (matchingShortUrls.length > 0) {
        // already exists, check last use date
        const timeSinceLastUse = new Date().getTime() - Date.parse(matchingShortUrls[0].lastUse);
        if (timeSinceLastUse > YEAR_IN_MILISECONDS) {
            // stale url, we can replace it
            try {
                const result = await Urls.replaceOne({ shortURL: url.shortURL }, url);
            } catch (error) {
                res.status(400).json(error.message);
            }
    
            res.status(200).json('success!')

        } else {
            res.status(400).json('url already exists')
        }
    } else {
        try {
            await Urls.create(url)
        } catch {
            res.status(400).json(err.message);
        }

        res.status(200).json('success!')

    }

})

module.exports = router;