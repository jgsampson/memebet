// db.js
var mongoose = require('mongoose');

var Meme = new mongoose.Schema({
	id: Number,
	name: String,
	keywords: Array,
	tags: Array
});

var User = new mongoose.Schema({
	id: Number,
	username: String,
	password: String,
	salt: String,
	credits: Number,
	team: Number
});

var Bet = new mongoose.Schema({
	id: Number,
	user: Number,
	meme: Number,
	trend: Number,
	time: Number,
	amount: Number
	
});

var Data = new mongoose.Schema({
	data: Object
});


mongoose.model('User', User);
mongoose.model('Bet', Bet);
mongoose.model('Meme', Meme);
mongoose.model('Data', Data);


mongoose.connect('mongodb://localhost/memebet');


