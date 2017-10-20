const express = require('express');
const app = express();
const path = require('path');
const getColors = require('get-image-colors');
const request = require('request');
const fs = require('fs');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');

});

app.get('/instagram', function(request, response) {
  response.render('pages/instagram');

});

app.get('/submit/:id', function(req, res) {
  var InstagramId = req.params.id;
  var url = 'https://www.instagram.com/' + InstagramId + '/media/';
  request(url, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    var data = JSON.parse(body);
    var totalLikes = 0;
    var totalComments = 0;
    var totalPics = 0;
    var totalColors = 0;
    var allColors = [];
    var fullname = data.items[0].user.full_name;
    console.log(fullname);
    totalPics=data.items.length;
    for (var i = 0; i < data.items.length; i++) {
      var imagePath = data.items[i].images.thumbnail.url;
      //console.log("likes: " + data.items[i].likes.count);
      totalLikes += data.items[i].likes.count;
      //console.log("comments: " + data.items[i].comments.count);
      totalComments += data.items[i].comments.count;
      getColors(imagePath).then(colors => {
        // `colors` is an array of color objects
        totalColors=colors.length;
        allColors.push(colors);
        if (allColors.length == data.items.length) {
          var output = {
            "fullname":fullname,
            "likes": totalLikes,
            "comments": totalComments,
            "colors": allColors
          }
          res.send(output);

        }
      });
    }

  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
