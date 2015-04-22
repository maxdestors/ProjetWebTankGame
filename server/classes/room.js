
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
	};


	var startGame = function () {
		game.init(playersName);
	};
	
	var stopGame = function () {
		game.stop();
	};

	var addPlayer = function (name) {
		var type = (playersName.length >= 4) ? 0 : 1;
		playersName[name] = type;
		// console.log(playersName.length);
		//console.log('addplayer : ' + name + ' = ' + playersName[name]);
	};
	var removePlayer = function (name) {
		delete playersName[name];
	};


	var newMove = function (name, newMovement, state) {
		return game.newMove(name, newMovement, state);
	};

	var addNewMissile = function (newMissile) {
		game.addNewMissile(newMissile);
	};


	var disp = function () {
		console.log('Room Title :' + title + ' playersName : ');
		console.log(playersName);
	};


	//GETTER / SETTER

	var getPlayers = function () {
		return playersName;
	};
	var getIsGameRunning = function () {
		return game.getIsGameRunning();
	};





	// methodes publiques
	return {
		init: init,
		startGame: startGame,
		stopGame: stopGame,
		removePlayer: removePlayer,
		addPlayer: addPlayer,
		newMove: newMove,
		addNewMissile: addNewMissile,


		//getter setters
		getPlayers: getPlayers,
		getIsGameRunning: getIsGameRunning,

		disp: disp
	};
};