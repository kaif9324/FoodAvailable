const express = require('express')
require('dotenv').config();
const db = require('./database/db') // connect to database
const food_Schema = require('./food_module/foodM') // import schema
const app = express();
const foodrouter = require('./Router/Food_router')


const cores  = require('cors')
// Allow CORS for your frontend's origin
// Allow CORS for your frontend's origin

app.use(cores())

// Serve static files from the "upload" folder
app.use('/upload', express.static('upload')); 
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Middleware to parse JSON || parses JSON data.
app.use(express.json()); 

// Middleware to parse URL-encoded data  (such as from HTML forms).
app.use(express.urlencoded({ extended: true }));
app.use('/food',foodrouter)
app.get('/',(req,resp)=>{
    resp.send('its running ')
})
const port = process.env.PORT  || 5000

app.listen(port)