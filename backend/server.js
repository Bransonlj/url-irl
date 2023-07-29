const express = require("express");
const mongoose = require("mongoose");
const urlRouter = require('./routes/urlRoutes');
require('dotenv').config();

const app = express()
mongoose.connect(process.env.MONG_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected and listening');
        });
    }).catch(err => console.log(err.message))

// middleware to log to console
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}); 

app.use(express.json());



app.use('/api/url', urlRouter);
