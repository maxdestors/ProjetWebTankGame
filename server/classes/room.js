
var Room = function()
{
	var title;


	var gameState;
	var players;
	
	/**
	 *  INITIALISATION
	 */
	var init = function (roomTitle)
	{
		title = roomTitle;
		players = new Array();

		console.log("init room");
	};

	var addPlayer = function (name) {
		var type = (players.length >= 4) ? 0 : 1;
		var newplayer = new Player();
		newplayer.init(name,type);
		players[name] = newplayer;
	};
	var removePlayer = function (name) {
		players.splice(indexOf(players[name]), 1);
	};


	var newMove = function (name, newMovement, state) {
		return players[name].newMove(newMovement, state);
	};

	var disp = function (name) {

		var strDisp = 'players : ';
		for (var i = players.length - 1; i >= 0; i--) {
			strDisp += players[i].getName() + " : " + players[i].getType() + ", ";
		}
		console.log(strDisp);
	};


	//GETTER / SETTER

	var getPlayers = function () {
		return players;
	};


	// private 


	function findPlayer (name) {
		var i = 0;
		while(i < players.length && players[i].getName() != name) {
			i++;
		}
		if (players[i].getName() != name) {
			console.log("name : " + name + " not found !");
			return null;
		}
		return i;
	}






	// methodes publiques
	return {
		init: init,
		removePlayer: removePlayer,
		addPlayer: addPlayer,
		newMove: newMove,


		//getter setters
		getPlayers: getPlayers,

		disp: disp
	};
};