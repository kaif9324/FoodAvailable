const express = require('express')
const db = require('./database/db') // connect to database
const food_Schema = require('./food_module/foodM') // import schema

const app = express();
const foodrouter = require('./Router/Food_router')

// Middleware to parse JSON || parses JSON data.
app.use(express.json());

// Middleware to parse URL-encoded data  (such as from HTML forms).
app.use(express.urlencoded({ extended: true }));
app.use('/food',foodrouter)
app.get('/',(req,resp)=>{
    resp.send('its running ')
})
app.listen(5000)