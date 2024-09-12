//https://www.youtube.com/watch?v=mbsmsi7l3r4

require('dotenv').config(); //load environment variables

const express = require('express');
const app = express();
const PORT = 8080;
const jwt = require('jsonwebtoken');

app.use(express.json()); //inbuilt middleware to parse JSON

const posts = [
    { username:"adnan", title: 'Post 1' },
    { username:"thor", title: 'Post 2' },
    { username:"loki", title: 'Post 3' },
    // { username:"shaba", title: 'Post 3' },
]

app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.username === req.user.name)); //filter posts by username
})


function authenticateToken(req, res, next) { //middleware to authenticate token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //extract token from header
    if(token == null)  return res.sendStatus(401); ; //if token is null, return unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403); //if token is invalid, return forbidden
        req.user = user; //set user object in request
        next(); //call next middleware
    })
}

app.listen(PORT, () => console.log("Server is running on port " + PORT));