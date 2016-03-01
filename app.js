var express = require('express');
var path = require('path');
var request = require('request');

var handlebars = require('express-handlebars');

var app = express();
var http = require('http')
var server = http.Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 3333)

var localport = '3333';
var localhost = 'http://localhost';

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', handlebars({ extname: 'hbs', defaultLayout: 'layout.hbs' }));
app.set('view engine', 'hbs')


app.host = app.set('host', process.env.HOST || localhost);
app.port = app.set('port', process.env.PORT || localport);


app.get('/', function(req, res) {




	res.render('index', { data: 'test data' });
});

io.on('connection', function(socket) {
  console.log('User Connected!');

  socket.on('pageLoad', function(data) {
    // Set Last.fm API Key
    var apiKey = '3e74f7586698913e408e1aa7881f9082'
    var userName = 'xxmurder'
    var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + userName + '&api_key=' + apiKey + '&format=json'

    // Fetch Last.FM API for recent tracks
    getRecentTracks(url, function(results) {

      // Make object of necessary fields, store in output
      var output = handleRecentTracks(results)

      // Search Spotify with the Artist and Track Name
      var spotifyData = getTrackURI(output.artist, output.trackName, function(results) {
          var spotifyURI = results.tracks.items[0].uri

          var playing

          // Check if song is currently playing
          if (output.nowPlaying == true) {
            playing = true;
          }

          // Build Spotify iFrame Player
          var player = buildSpotifyPlayer(spotifyURI)
          socket.emit('load', player, playing, output)
        })
    })
  })
})


// LAST.FM API
function getRecentTracks(url, callback) {
  var options = {
    url: url,
    method : 'GET'
  };
  var res = ''

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
          res = JSON.parse(body);
      }
      else {
          res = 'Not Found';
      }
      callback(res);
  })
}

function handleRecentTracks(results) {
  var nowplaying = false
  console.log(results);
  if (results.recenttracks.track[0].hasOwnProperty(['@attr'])) {
    nowplaying = true
  } else {
    nowplaying = false
  }


  var artistInfo = {
    trackName: results.recenttracks.track[0].name,
    artist: results.recenttracks.track[0].artist['#text'],
    album: results.recenttracks.track[0].album['#text'],
    nowPlaying: nowplaying,
  }

  return artistInfo
}

function getTrackURI(artist, trackName, callback) {
  var url = 'http://api.spotify.com/v1/search?q=track:' + trackName + '%20artist:' + artist + '&type=track'

  var options = {
    url: url,
    method : 'GET'
  };
  var res = ''
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
          res = JSON.parse(body);
      }
      else {
          res = 'Not Found';
      }
      callback(res);
  })
}

function buildSpotifyPlayer(trackUri) {
        if(!trackUri) return;
        return '<iframe src="https://embed.spotify.com/?uri=' + trackUri + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
    }


module.exports = app;
