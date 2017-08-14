
var twitterKeys = require("./key");
var Twitter = require("twitter");
var client = new Twitter(twitterKeys.twitterKeys);

var chalk = require('chalk');

var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: "221170c4d1f645bab7c38e4708cab898",
  secret: "b0d86fb1f7074e019d5b02ae55a99de7"
});

var request = require('request');

var nodefs = require('fs');

var weather = require("weather-js");

var command = process.argv[2];
var searchObject = process.argv[3];

liri(command, searchObject);

function tweets(){
	var screenName = {screen_name: 'JonPBer', limit: 1};
	        var limit = {limit: 1}
			client.get('statuses/user_timeline', screenName, function(error, tweets, response) {
	  		if (!error) {
	    	// console.log(tweets);
	  		}
	  		var tweetsReceived = tweets;
	  		var tweetNum = 20;

	  		if (tweetsReceived.length < tweetNum){
	  			tweetNum = tweetsReceived.length;
	  		}

	  		for (var i = 0; i < tweetNum; i++){
	  			console.log("------------------");
	  			console.log(tweetsReceived[i].text);
	  			console.log(tweetsReceived[i].created_at);
	  			nodefs.appendFile('../../log.txt', "------------\r\n" + tweetsReceived[i].text + "\r\n" + tweetsReceived[i].created_at + "\r\n", function (err) {
					if (err) throw err;
				});
	  		}
	  		
			});
}

function spotifySearch(search){
	if (search === "" || search === undefined){
		search = "The Sign";
	}
	spotify.search({ type: 'track', query: search, limit: 1}, function(err, data) {
		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
  		console.log("------------------");
  		console.log(chalk.yellow("Song Name: ") + data.tracks.items[0].name); 
		console.log(chalk.yellow("Artist: ") + data.tracks.items[0].artists[0].name); 
		console.log(chalk.yellow("Preview Link: ") + data.tracks.items[0].preview_url); 
		console.log(chalk.yellow("Album: ") + data.tracks.items[0].album.name); 
		console.log("------------------");
		nodefs.appendFile('../../log.txt', "------------\r\n" + "Song Name: " + data.tracks.items[0].name + "\r\n" 
			+ "Artist: " + data.tracks.items[0].artists[0].name + "\r\n"
			+ "Preview Link: " + data.tracks.items[0].preview_url + "\r\n"
			+ "Album: " + data.tracks.items[0].album.name + "\r\n"
			, function (err) {
				if (err) throw err;
				});

	});
}

function movie(search){
	if (search === "" || search === undefined){
		search = "Mr. Nobody";
	}

	request('https://www.omdbapi.com/?apikey=40e9cece&t=' + search, function (error, response, body) {
		var movieOjb = JSON.parse(body)

		console.log("------------------");
		if (movieOjb.Title !== undefined){
			console.log(chalk.yellow('Title: ') + movieOjb.Title); 
			console.log(chalk.yellow('Year: ') + movieOjb.Year); 
			console.log(chalk.yellow('IMDB Rating: ') + movieOjb.Ratings[0].Value); 
			console.log(chalk.yellow('Rotten Tomatoes Rating: ') + movieOjb.Ratings[1].Value); 
			console.log(chalk.yellow('Country: ') + movieOjb.Country); 
			console.log(chalk.yellow('Language: ') + movieOjb.Language); 
			console.log(chalk.yellow('Plot: ') + movieOjb.Plot); 
			console.log(chalk.yellow('Actors: ') + movieOjb.Actors); 
			nodefs.appendFile('../../log.txt', 'Title: ' + movieOjb.Title + "\r\n"
				+ 'Year: ' + movieOjb.Year + "\r\n"
				+ 'IMDB Rating: ' + movieOjb.Ratings[0].Value + "\r\n"
				+ 'Rotten Tomatoes Rating: ' + movieOjb.Ratings[1].Value + "\r\n"
				+ 'Country: ' + movieOjb.Country + "\r\n"
				+ 'Language: ' + movieOjb.Language + "\r\n"
				+ 'Plot: ' + movieOjb.Plot + "\r\n"
				+ 'Actors: ' + movieOjb.Actors + "\r\n" , function (err) {
					if (err) throw err;
			});;
		}
		else {
			console.log("Oops, that movie does not seem to be in OMBD!")
			nodefs.appendFile('../../log.txt', "Oops, that movie does not seem to be in OMBD!\r\n", function (err) {
				if (err) throw err;
			});;
		}
		console.log("------------------");
	});
}

function weatherSearch(search){
	if (search === "" || search === undefined){
		search = "San Francisco, CA";
	}
	weather.find({search: search, degreeType: 'F'}, function(err, result) {
		if(err) console.log(err);
		console.log(chalk.yellow("Location: ") + result[0].location.name);
		console.log(chalk.yellow("Current Weather: ") + result[0].current.temperature + " " + result[0].location.degreetype);
		console.log(chalk.yellow("Weather Type: ") + result[0].current.skytext);

		nodefs.appendFile('../../log.txt', "Location: " + result[0].location.name + "\r\n"
		+ "Current Weather: " + result[0].current.temperature + " " + result[0].location.degreetype + "\r\n"
		+ "Weather Type: " + result[0].current.skytext + "\r\n", function (err) {
		if (err) throw err;
		});;
	});
}

function random(){
	nodefs.readFile('../../random.txt', "utf8", function(err, data) {
	var arrayOfCommands = data.split("\r\n");
	for (var i = 0; i < arrayOfCommands.length; i++){
		var stringSplit = arrayOfCommands[i].split(",");
		// var searchable = arrayOfCommands[i].substr(arrayOfCommands[i].indexOf(",") + 1, arrayOfCommands[i].length);
		liri (stringSplit[0], stringSplit[1]);
	}
	
	});
}

function help(){
	console.log("------------------")
	console.log("Thanks for using Liri!");
	console.log("Type my-tweets to see the latest tweets by Jon Berry.");
	console.log("Type spotify-this-song followed by a song name IN QUOTES to see its Spotify info.");
	console.log("Type movie-this followed by a movie name IN QUOTES to see its IMDB info.");
	console.log("Type weather followed by a location IN QUOTES to see its weather info.");
	console.log("Type do-what-it-says to enact a set of random commands.");
	console.log("------------------")

	nodefs.appendFile('../../log.txt', "Thanks for using Liri!\r\n"
			+ "Type my-tweets to see the latest tweets by Jon Berry.\r\n"
			+ "Type spotify-this-song followed by a song name IN QUOTES to see its Spotify info.\r\n"
			+ "Type movie-this followed by a movie name IN QUOTES to see its IMDB info.\r\n"
			+ "Type weather followed by a location IN QUOTES to see its weather info.\r\n"
			+ "Type do-what-it-says to enact a set of random commands.\r\n", function (err) {
				if (err) throw err;
	});;
}

function liri (comm, searchObj){
	nodefs.appendFile('../../log.txt', " " + "\r\n", function (err) {
		if (err) throw err;
	});
	nodefs.appendFile('../../log.txt', comm + " " + searchObj + "\r\n", function (err) {
		if (err) throw err;
	});

	switch(comm) {
		case "my-tweets":
	        tweets();
			break;

		case "spotify-this-song":
			spotifySearch(searchObj);
	    	break;

		case "movie-this":
			movie(searchObj);
		    break;

		case "weather":
			weatherSearch(searchObj);
			break;

		case "do-what-it-says":
			random();
			break;

		case "help":
			help();
			break;

		default:
			console.log("command not found. Type help to see a list of available commands.");
			nodefs.appendFile('../../log.txt', "command not found. Type help to see a list of available commands.\r\n", function (err) {
				if (err) throw err;
			});
			break;
	}

}

