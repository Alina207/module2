// IN SPOTIFYTEST.JS:
const SpotifyWebApi = require('spotify-web-api-node');
const spotify = new SpotifyWebApi();
spotify.searchTracks('thousand miles', {}, (err, results) => {
  if (err) {
    throw err;
  }
  console.log(results.body.tracks.items[0].name);
  console.log(results.body.tracks.items[0].preview_url);
});
console.log('LAST LINE');
const SpotifyWebApi = require('spotify-web-api-node');

 // IN APP.JS FOR SPOTIFY EXAMPLE:
app.get('/search-spotify', (req, res, next) => {
  const term = req.query.searchTerm;
  const spotify = new SpotifyWebApi();

  spotify.searchTracks(term, {}, (err, results) => {
    if (err) {
      res.send('Oh noes! Error!');
      return;
    }
    const theTrack = results.body.tracks.items[0];
    res.render('track-search', {
      track: theTrack,
      searchTerm: term
    });
  });
});

// passport.use(new FbStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: process.env.HOST_ADDRESS + '/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));
