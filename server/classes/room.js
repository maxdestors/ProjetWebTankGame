
var Room = function()
{
	var title;


	var gameState;
	var playersName;

	var game;
	
	/**
	 *  INITIALISATION
	 */
	var init = function (roomTitle)
	{
		title = roomTitle;
		playersName = new Array();

		game = new Jeu();
		console.log("init room : " + title);
	};


	var startGame = function () {
		game.init(playersName);
	};
	
	var stopGame = function () {
		game.stop();
	};

	var addPlayer = function (name) {
		var type = (playersName.length >= 4) ? 0 : 1;
		//var newplayer = new Player();
		//newplayer.init(name,type);
		playersName[name] = type;
		console.log(playersName.length);
		console.log('addplayer : ' + name + ' = ' + playersName[name]);
	};
	var removePlayer = function (name) {
		delete playersName[name];// .splice(indexOf(name), 1);
		game.stop();
	};


	var newMove = function (name, newMovement, state) {
		return game.newMove(name, newMovement, state);
	};

	var disp = function () {

		var strDisp = 'Room Title :' + title + ' playersName : ';
		//playersName.forEach(function(player) {
			//strDisp += player.getName() + " : " + player.getType() + ", ";
		    // console.log(player);
		//});
		console.log(strDisp);
		console.log(playersName);

	};


	//GETTER / SETTER

	var getPlayers = function () {
		return playersName;
	};


	// private 

/*
	function findPlayer (name) {
		var i = 0;
		while(i < playersName.length && playersName[i].getName() != name) {
			i++;
		}
		if (playersName[i].getName() != name) {
			console.log("name : " + name + " not found !");
			return null;
		}
		return i;
	}
*/





	// methodes publiques
	return {
		init: init,
		startGame: startGame,
		stopGame: stopGame,
		removePlayer: removePlayer,
		addPlayer: addPlayer,
		newMove: newMove,


		//getter setters
		getPlayers: getPlayers,

		disp: disp
	};
};