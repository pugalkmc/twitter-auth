const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/auth/twitter', (req, res) => {
  const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  const authenticationUrl = 'https://api.twitter.com/oauth/authenticate';
  const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';

  request.post({ url: requestTokenUrl, oauth: {
    consumer_key: 'wiiQJic6TmCAQmqwiqi2ZFZjU',
    consumer_secret: 'PlATDkSZS7gPKY6ROUPbUKaaztkp3TXVuj9dsLO69XjpfH6GL0',
    callback: 'http://localhost:3000/auth/twitter/callback'
  }}, (err, response, body) => {
    const requestToken = body.split('&')[0].split('=')[1];
    res.redirect(`${authenticationUrl}?oauth_token=${requestToken}`);
  });
});

app.get('/auth/twitter/callback', (req, res) => {
  const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  const requestToken = req.query.oauth_token;
  const verifier = req.query.oauth_verifier;

  request.post({ url: accessTokenUrl, oauth: {
    consumer_key: 'wiiQJic6TmCAQmqwiqi2ZFZjU',
    consumer_secret: 'PlATDkSZS7gPKY6ROUPbUKaaztkp3TXVuj9dsLO69XjpfH6GL0',
    token: requestToken,
    verifier: verifier
  }}, (err, response, body) => {
    const accessToken = body.split('&')[0].split('=')[1];
    const accessTokenSecret = body.split('&')[1].split('=')[1];

    // You can now use the accessToken and accessTokenSecret to make API requests on behalf of the user
    res.send(`Access Token: ${accessToken}<br>Access Token Secret: ${accessTokenSecret}`);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
