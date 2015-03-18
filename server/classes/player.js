
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
		tank = new Tank();
		tank.init(100, 100, 1, 'blue');
	};


	/* 
	 * GETTERs/ SETTERS
	 */

	var getType = function () {
		return type;
	}
	var setType = function (newType) {
		type = newType;
	}

	var getName = function () {
		return name;
	}
	var setName = function (newName) {
		name = newName;
	}

	var newMove = function (newMovement, state) {
		switch (newMovement) {
			case 'isMovingForward':
				if (state === true) {
					tank.setIsMovingForward(true);
				} else {
					tank.setIsMovingForward(false);
				}
				break;
			case 'isMovingBackward':
				if (state === true) {
					tank.setIsMovingBackward(true);
				} else {
					tank.setIsMovingBackward(false);
				}
				break;
			case 'isRotatingLeft':
				if (state === true) {
					tank.setIsRotatingLeft(true);
				} else {
					tank.setIsRotatingLeft(false);
				}
				break;
			case 'isRotatingRight':
				if (state === true) {
					tank.setIsRotatingRight(true);
				} else {
					tank.setIsRotatingRight(false);
				}
				break;
			default:
				return false;
				break;
		}
		return tank.getMembers();
	}




	// methodes publiques
	return {
		// get / set
		getType: getType,
		setType: setType,
		getName: getName,
		setName: setName,


		newMove: newMove,


		// membres
		tank: tank,


		init: init
	};
};