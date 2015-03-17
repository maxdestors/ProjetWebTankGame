
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

	var addplayer = function (name) {
		var type = (players.length >= 4) ? 0 : 1;
		var newplayer = new player();
		newplayer.init(name,type);
		players.push(newplayer);

	}

	// methodes publiques
	return {
		init: init
	};
};