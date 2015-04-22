
var Player = function()
{
	var type;
	var tank;
	var name;

	/**
	 *  Initialisation du joueur
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
	 * Getters et setters
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

    // mise a jour position
	var newMove = function (newMovement, state) {
		switch (newMovement) {
			case 'isMovingForward':
				if (state === 'true') {
					tank.setIsMovingForward(true);
				} else {
					tank.setIsMovingForward(false);
				}
				break;
			case 'isMovingBackward':
				if (state === 'true') {
					tank.setIsMovingBackward(true);
				} else {
					tank.setIsMovingBackward(false);
				}
				break;
			case 'isRotatingLeft':
				if (state === 'true') {
					tank.setIsRotatingLeft(true);
				} else {
					tank.setIsRotatingLeft(false);
				}
				break;
			case 'isRotatingRight':
				if (state === 'true') {
					tank.setIsRotatingRight(true);
				} else {
					tank.setIsRotatingRight(false);
				}
				break;
			case 'mousePos':
				if (!state.x || !state.y) {

				} else {
					tank.rotateWeapon(state.x, state.y);
				}
				break;
			default:
				return false;
				break;
		}
		return tank.getMembers();
	};

    // mouvement du tank
	var moveTank = function (deltaTime) {
		tank.move(deltaTime);
	};

    // mise a jour du tank
	var updateTank = function (newtank) {
		tank.updateTank(newtank);
	};

    // dessine tank
	var drawTank = function (ctx, username) {
		tank.draw(ctx, username);
	};

    // le tank tire
	var fireTank = function () {
		return tank.fire();
	};

    // rotation de la tourelle du tank
	var rotateWeaponTank = function (mousePosX, mousePosY) {
		tank.rotateWeapon(mousePosX, mousePosY);
	};

    // mouvements tanks :
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