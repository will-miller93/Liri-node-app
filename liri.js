// requirement variables //
require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// variables for user input //
var inputString = process.argv;
var termCommand = inputString[2];
var searchTerm = inputString[3];

// switch statement for commands //
var commands = termCommand;

switch (commands) {
    case "my-tweet" :
        return displayTweets();
        break;
    case "spotify-this-song" :
        return displaySpotifySearch();
        break;
    case "movie-this" :
        return displayMovieInfo();
        break;
    case "do-what-it-says" :
        return displayDefault();
        break;
    default :
        return displayError();
        break;
}

// function to display tweets //
function displayTweets() {
    var params = {screen_name:'Dummy_Account87', count: 20};
    // needs to print the last 20 tweets from the connected account to the console.
    console.log(" ------ Tweets ------ ");
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error && response.statusCode === 200) {
            console.log(response);
            for (var i = 0; i < 20; i++) {
                console.log("Tweet: " + tweets[i].text);
                console.log("Created at: " + tweets[i].created_at);
            }
        }
        else { console.log("Oh no! Something went wrong! Try Again!"); }
    })
} 

// function to display song info for search term //
function displaySpotifySearch(name) {
    if (searchTerm === undefined) {
        spotify.search({ type: 'track', query: 'The Sign' }, function(error, data) {
            console.log("------ The Sign ------")
            console.log("Song: The Sign");
            console.log("Artist: Ace of Base");
            console.log("Album: The Sign");
        })
    }
    else { 
        spotify.search({ type: 'track', query: "'" + searchTerm + "'" }, function(error, data) {
            console.log("------" + searchTerm + "------");
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
        });
    }
}

// function to display movie info for search term //
function displayMovieInfo(name) {
    if(searchTerm === undefined) {
        queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody&type=movie"
        request(queryUrl, function(error, response, body) {
            body = JSON.parse(body);
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMDB Rating: " + body.Ratings[0].Value);
            console.log("Rotten Tomatos Rating: " + body.Ratings[1].Value);
            console.log("Release Country: " + body.Country);
            console.log("Release Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Cast: " + body.Actors);
        })
    }
    else {
        var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + searchTerm + "&type=movie";
        request(queryUrl, function(error, response, body) {
            body = JSON.parse(body);
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMDB Rating: " + body.Ratings[0].Value);
            console.log("Rotten Tomatos Rating: " + body.Ratings[1].Value);
            console.log("Release Country: " + body.Country);
            console.log("Release Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Cast: " + body.Actors);
        });
    }

}

// function to display default info //
function displayDefault() {
    fs.readFile("./random.txt", 'utf8', function(error, data) {
        var dataArr = data.split(",");
        searchTerm = dataArr[1];
        spotify.search({type: "track", query: "'" + searchTerm + "'" }, function(err, data) {
            console.log( "------" + searchTerm + "------" );
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
        })

    });
}

// function to display error info (if no command but search term put in, or command but no search term put in) //
function displayError() {
    console.log("Aw snap! You didn't enter a valid command! Try again.");
}


