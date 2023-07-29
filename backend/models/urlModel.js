const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    url: {
        $type: String,
        required: true,
    },
    shortURL: {
        $type: String,
        required: true,
    },
    lastUse: {
        $type: Date,
        required: true,
    }
}, {typeKey: '$type'})

const Urls = mongoose.model('Urls', urlSchema);

module.exports = Urls;