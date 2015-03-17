
var Player = function()
{
	var type;
	var tank;
	var name;

	/**
	 *  INITIALISATION
	 */
	var init = function (playerName, playerType)
	{
		name = playerName;
		type = playerType;
		console.log(name + " : " + type);
	};


	// methodes publiques
	return {
		init: init
	};
};