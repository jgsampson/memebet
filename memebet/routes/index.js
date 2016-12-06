var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Meme = mongoose.model('Meme');
var Bet = mongoose.model('Bet');
var Data = mongoose.model('Data');


var initNums = {"users": 100, "memes": 100, "bets":3000};

//var memeData;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MemeBet Data Shell' });
});

router.get('/bets/init', function(req, res, next) {
	Bet.find({}, function(cer, cres, ccnt) {
		var numRes = cres.length;
		for (var i=0;i<initNums.bets;i++) {
			var memeID = Math.floor(Math.random() * (initNums.memes - 1 + 1)) + 1;
			var userID = Math.floor(Math.random() * (initNums.users - 1 + 1)) + 1;
			var betAmt = Math.floor(Math.random() * (1000000 - 100 + 1)) + 100;
			var trend = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
			new Bet({ id: numRes+i+1, meme: memeID, user: userID, amount: betAmt, trend: trend, time: new Date().getTime() }).save(function(err, result, count){
				//
			});	
		}
	});
		res.redirect("/");

});

router.get('/bets/clear', function(req, res, next) {
	Bet.remove({}, function(cer, cres, ccnt) {
		res.redirect("/");
	});
	
});

router.get('/data/init', function(req, res, next) { // create random users and memes
	// users
	Meme.remove({}, function(cer, cres, ccnt) {
		User.remove({}, function(uer, ucres, uccnt) {
			for (var i=0;i<initNums.users;i++) {

				var nlen = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
				var nameChars = [];
				for (var j=0;j<nlen;j++) {
					nameChars.push(Math.floor(Math.random() * (122 - 97 + 1)) + 97);		  
				}
				var uName = "";
				for (var k=0;k<nameChars.length;k++) {
					uName += String.fromCharCode(nameChars[k]);
				}
			
				new User({ id: i+1, username: uName }).save(function(err, result, count){
					//
				});	
			}
			
			for (var l=0;l<initNums.users;l++) {
				var mlen = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
				var memeChars = [];
				for (var j=0;j<mlen;j++) {
					memeChars.push(Math.floor(Math.random() * (90 - 65 + 1)) + 65);		  
				}
				var mName = "";
				for (var k=0;k<memeChars.length;k++) {
					mName += String.fromCharCode(memeChars[k]);
				}
			
				new Meme({ id: l+1, name: mName }).save(function(err, result, count){
					//
				});	

			}


			res.redirect("/");
		});
	});


});

router.get('/poll/data', function(req, res, next) { // create random users and memes
	var memeData = [];
	Meme.find({}, function(mer, mres, mcnt) {
		
		for (var i=0;i<mres.length;i++) {
			
			var dataObj = {'id': mres[i].id, 'name': mres[i].name, 'numBets' : 0, 'trendUP' : 0, 'trendDOWN' : 0, 'trendNET' : 0, 'betTOTAL': 0, 'betAVG': 0};
			memeData.push(dataObj);

			Bet.find({'meme':mres[i].id}, function(ber, bres, bcnt) {	
					
				for (var k=0;k<bres.length;k++) {
					memeData[(bres[k].meme-1)].numBets++;
					memeData[(bres[k].meme-1)].betTOTAL += bres[k].amount;
					if (bres[k].trend == 2) {
						memeData[(bres[k].meme-1)].trendUP++;
						memeData[(bres[k].meme-1)].trendNET++;
					}
					else if (bres[k].trend == 1) {
						memeData[(bres[k].meme-1)].trendDOWN++;
						memeData[(bres[k].meme-1)].trendNET--;
					}
					memeData[(bres[k].meme-1)].betAVG = Math.floor(memeData[(bres[k].meme-1)].betTOTAL / memeData[(bres[k].meme-1)].numBets);
				}
			});
		}

		setTimeout(function() {
			res.render('dataMemes', {memeData: memeData});
		}, 5000);
		
	});
});

module.exports = router;
