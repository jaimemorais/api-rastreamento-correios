const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes')
const cors = require('cors');

const app = express();

/*mongoose.connect(process.env.MONGODB_CONNECTION,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    ssl: false
});*/


app.use(cors());

// express json body
app.use(express.json())

app.use(routes);

app.listen(3333);