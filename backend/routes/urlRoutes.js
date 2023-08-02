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
                res.status(200).json('success!')
            } catch (error) {
                // error replacing
                res.status(400).json(error.message);
            }
    

        } else {
            // throw error, url already exists in database
            res.status(400).json('url already exists')
        }
    } else {
        // does not exist in database yet, can create
        try {
            await Urls.create(url)
            res.status(200).json('success!')
        } catch (error) {
            res.status(400).json(error.message);
        }
        
    }

})

module.exports = router;