
var Player = function()
{
	var type;
	var tank;
	var name;

	/**
	 *  INITIALISATION
	 */
	var init = function (playerName, playerType, isServeur)
	{
		// parametre facultatif : isServeur
		if (!isServeur || isServeur === false) {
			isServeur = false;
		}


		name = playerName;
		type = playerType;
		tank = new Tank();
		tank.init(100, 100, 1, 'blue', isServeur);
	};


	/* 
	 * GETTERs/ SETTERS
	 */

	var getType = function () {
		return type;
	};
	var setType = function (newType) {
		type = newType;
	};

	var getName = function () {
		return name;
	};
	var setName = function (newName) {
		name = newName;
	};

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
	};


	var moveTank = function (deltaTime) {
		tank.move(deltaTime);
	};

	var updateTank = function (newtank) {
		tank.updateTank(newtank);
	};

	var drawTank = function (ctx) {
		tank.draw(ctx);
	};

	var fireTank = function () {
		return tank.fire();
	};

	var rotateWeaponTank = function (mousePosX, mousePosY) {
		tank.rotateWeapon(mousePosX, mousePosY);
	};

	var getIsRotatingLeftTank = function () {
		return tank.getIsRotatingLeft();
	};

	var getIsMovingForwardTank = function () {
		return tank.getIsMovingForward();
	};

	var getIsRotatingRightTank = function () {
		return tank.getIsRotatingRight();
	};

	var getIsMovingBackwardTank = function () {
		return tank.getIsMovingBackward();
	};




	// methodes publiques
	return {
		// get / set
		getType: getType,
		setType: setType,
		getName: getName,
		setName: setName,


		newMove: newMove,
		updateTank: updateTank,

		moveTank: moveTank,
		drawTank: drawTank,
		fireTank: fireTank,
		rotateWeaponTank: rotateWeaponTank,
		getIsRotatingLeftTank: getIsRotatingLeftTank,
		getIsMovingForwardTank: getIsMovingForwardTank,
		getIsRotatingRightTank: getIsRotatingRightTank,
		getIsMovingBackwardTank: getIsMovingBackwardTank,

		init: init
	};
};