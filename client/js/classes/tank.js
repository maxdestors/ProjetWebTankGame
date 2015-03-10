/**
 * Created by Romain on 20/02/2015.
 */

var Tank = function () {
	var x, y;
	var angle;
	var weaponAngle;
	var color;

	var isMovingForward;
	var isMovingBackward;
	var isRotatingLeft;
	var isRotatingRight;

	var mouseX, mouseY;

	/* const */
	const speedForward = 80;
	const speedBackward = 40;
	const rotateSpeed = 4;

	const lengthWeapon = 28; // ou les missiles commence


	var init = function (newX, newY, newAngle, newColor) {
		x = newX;
		y = newY;
		angle = newAngle;
		color = newColor;
		weaponAngle = 0;
		isMovingForward = false;
		isMovingBackward = false;
		isRotatingLeft = false;
		isRotatingRight = false;
	};

	/**
	 *  Move
	 */

	function moveForward(deltaTime) {
		x += speedForward*Math.cos(angle)*deltaTime;
		y += speedForward*Math.sin(angle)*deltaTime;
	}
	function moveBackward(deltaTime) {
		x += (-speedBackward)*Math.cos(angle)*deltaTime;
		y += (-speedBackward)*Math.sin(angle)*deltaTime;
	}

	function rotateLeft(deltaTime) {
		angle -= rotateSpeed*deltaTime;
	}
	function rotateRight(deltaTime) {
		angle += rotateSpeed*deltaTime;
	}

	var move = function (deltaTime) {
		// TODO apply colision

		//console.log("x:" +x+ "y:" +y);
		if (isMovingForward) {          // && x > 30 && y > 25
			moveForward(deltaTime);
		}
		// else permet de ne pas envancer et reculer en meme temps (difference entre les deux vitesses)
		else if (isMovingBackward) {
			moveBackward(deltaTime);
		}
		if (isRotatingLeft) {
			rotateLeft(deltaTime);
		}
		if (isRotatingRight) {
			rotateRight(deltaTime);
		}
		weaponAngle = Math.atan2( mouseY - y, mouseX - x );
	};

	/**
	 *  Weapon
	 */

	var rotateWeapon = function (newMouseX, newMouseY) {
		mouseX = newMouseX;
		mouseY = newMouseY;
		weaponAngle = Math.atan2( mouseY - y, mouseX - x );
		//console.log(weaponAngle);
	};

	var fire = function () {
		var newMissile = new Missile();
		//positionne le missile au bout de la tourelle
		xMiss = x + Math.cos(weaponAngle)*lengthWeapon;
		yMiss = y + Math.sin(weaponAngle)*lengthWeapon;
		newMissile.init(xMiss, yMiss, 3, weaponAngle, 160, color);
		return newMissile;
	};

	/**
	 *  Setters
	 */
	var setIsMovingForward = function (newSet) {
		isMovingForward = newSet;
	};
	var setIsMovingBackward = function (newSet) {
		isMovingBackward = newSet;
	};
	var setIsRotatingLeft = function (newSet) {
		isRotatingLeft = newSet;
	};
	var setIsRotatingRight = function (newSet) {
		isRotatingRight = newSet;
	};

	var updateTank = function (newtank) {
		x = newtank.x;
		y = newtank.y;
		angle = newtank.angle;
		weaponAngle = newtank.weaponAngle;
		color = newtank.color;

		mouseX = newtank.mouseX,
		mouseY = newtank.mouseY,


		isMovingForward = newtank.isMovingForward;
		isMovingBackward = newtank.isMovingBackward;
		isRotatingLeft = newtank.isRotatingLeft;
		isRotatingRight = newtank.isRotatingRight;
	};

	/**
	 *  Getters
	 */
	var getIsMovingForward = function () {
		return isMovingForward;
	};
	var getIsMovingBackward = function () {
		return isMovingBackward;
	};
	var getIsRotatingLeft = function () {
		return isRotatingLeft;
	};
	var getIsRotatingRight = function () {
		return isRotatingRight;
	};


	var getMembers = function () {
		return {
			'x' : x,
			'y' : y,
			'angle' : angle,
			'weaponAngle' : weaponAngle,
			'color' : color,

			'mouseX' : mouseX,
			'mouseY' : mouseY,

			'isMovingForward' : isMovingForward,
			'isMovingBackward' : isMovingBackward,
			'isRotatingLeft' : isRotatingLeft,
			'isRotatingRight' : isRotatingRight
		}
	};


	/**
	 * Draw
	 */

	var draw = function (ctx) {
		ctx.save();
		//sent pos
		ctx.translate(x,y);
		//draw tank body
		ctx.rotate(angle);
		ctx.fillStyle = color;
		ctx.fillRect(-15, -10, 30, 20);
		//draw tank weapon
		ctx.rotate(weaponAngle-angle);
		ctx.fillStyle = 'red';
		ctx.fillRect(-10, -5, 40, 10);
		// ctx.fillRect(0, 0, 1, 1)

		ctx.restore();
	};



	return {
		//set params
		setIsMovingForward: setIsMovingForward,
		setIsMovingBackward: setIsMovingBackward,
		setIsRotatingLeft: setIsRotatingLeft,
		setIsRotatingRight: setIsRotatingRight,
		//get params
		getIsMovingForward: getIsMovingForward,
		getIsMovingBackward: getIsMovingBackward,
		getIsRotatingLeft: getIsRotatingLeft,
		getIsRotatingRight: getIsRotatingRight,
		//func
		init: init,
		move: move,
		draw: draw,
		updateTank: updateTank,
		getMembers: getMembers,
		rotateWeapon: rotateWeapon,
		fire: fire
	}

};