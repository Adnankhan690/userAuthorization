require('dotenv').config(); //load environment variables

const express = require('express');
const app = express();
const PORT = 4000;
const jwt = require('jsonwebtoken');

app.use(express.json()); //inbuilt middleware to parse JSON

let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err)  return res.sendStatus(403);
        const accessToken = generateAccessToken({name:user.name});
        res.json({accessToken: accessToken});
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);//`req.body.token` is the token to be deleted
    res.sendStatus(204);
})

app.post('/login', (req, res) => {

    // Authenticate User

    const username = req.body.username;
    const user = {name: username}; //dummy user object, serialized to token 
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    refreshTokens.push(refreshToken);
    //require('crypto').randomBytes(64).toString('hex'); //generate random secret key
    res.json({accessToken: accessToken, refreshToken: refreshToken});
})


function generateAccessToken(user)  {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
}


app.listen(PORT, () => console.log("Server is running on port " + PORT));