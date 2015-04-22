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

	var deltaDistance;
	var frame;

	/* const */
	const speedForward = 80;
	const speedBackward = 40;
	const rotateSpeed = 3;
	const weaponRotateSpeed = 4;

	const lengthWeapon = 18;     // ou les missiles commence

    // test sprite
    var imgTank = null;
    var imgTourelle = null;


	var init = function (newX, newY, newAngle, newColor, isServeur) {
		x = newX;
		y = newY;
		angle = newAngle;
		color = newColor;
		mouseX = newX;
		mouseY = newY;
		weaponAngle = 0;
		isMovingForward = false;
		isMovingBackward = false;
		isRotatingLeft = false;
		isRotatingRight = false;

		deltaDistance = 0;
		frame = 0;

		// isServeur parametre facultatif
		if (!isServeur || isServeur === false) {
	        // sprites
	        imgTank = new Image();
	        imgTank.src = '../../img/tanks/grey_tank.png';
	        imgTourelle = new Image();
	        imgTourelle.src = '../../img/tanks/grey_tourelle.png';
		}
	};

	/**
	 *  Move
	 */

	function moveForward(deltaTime) {
		var move = false;
		var moveX = speedForward*Math.cos(angle)*deltaTime;
		var moveY = speedForward*Math.sin(angle)*deltaTime;
		x += moveX;
		//rayon de 10 autour du centre du tank avec un bord de 10
		if (x < 20 || y < 20 || x > 780 || y > 480) {
			x -= moveX;
		}
		else {
			move = true;
		}
		y += moveY;
		if (x < 20 || y < 20 || x > 780 || y > 480) {
			y -= moveY;
		}
		else {
			move = true;
		}
		if (move) {
			animeTankForward(deltaTime);
		}
	}
	function moveBackward(deltaTime) {
		var move = true;
		var moveX = speedBackward*Math.cos(angle)*deltaTime;
		var moveY = speedBackward*Math.sin(angle)*deltaTime;
		x -= moveX;
		if (x < 20 || y < 20 || x > 780 || y > 480) {
			x += moveX;
		}
		else {
			move = true;
		}
		y -= moveY;
		if (x < 20 || y < 20 || x > 780 || y > 480) {
			y += moveY;
		}
		else {
			move = true;
		}
		if (move) {
			animeTankBackward(deltaTime);
		}
	}

	function rotateLeft(deltaTime) {
		angle -= rotateSpeed*deltaTime;
		weaponAngle -= rotateSpeed*deltaTime;
	}
	function rotateRight(deltaTime) {
		angle += rotateSpeed*deltaTime;
		weaponAngle += rotateSpeed*deltaTime;
	}

	function animeTankForward(deltaTime) {
		deltaDistance += speedForward*deltaTime;
		if (deltaDistance >= 4) {
			deltaDistance = 0;
			frame++;
			if (frame >= 8) {
				frame = 0;
			}
		}
	}

	function animeTankBackward(deltaTime) {
		deltaDistance += speedBackward*deltaTime;
		// 4 nb de pixels avant chagement de frame
		if (deltaDistance >= 4) {
			deltaDistance = 0;
			frame--;
			if (frame < 0) {
				frame = 7;
			}
		}
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
			//collision pour l'instant en cercle donc pas l'incidence sur la rotation
			rotateLeft(deltaTime);
		}
		if (isRotatingRight) {
			rotateRight(deltaTime);
		}
		//tourrelle n'as pas de colision
		var mouseAngle = Math.atan2( mouseY - y, mouseX - x );
		// tester si autre sens de rotation plus court
		//console.log('mouseAngle :'+mouseAngle+' weaponAngle :'+weaponAngle)
		if (mouseAngle < -Math.PI/2 && weaponAngle > Math.PI/2) {
			weaponAngle += weaponRotateSpeed*deltaTime;
			if (weaponAngle > Math.PI) {
				weaponAngle -= Math.PI*2;
			}
		}
		else if (mouseAngle > Math.PI/2 && weaponAngle < -Math.PI/2) {
			weaponAngle -= weaponRotateSpeed*deltaTime;
			if (weaponAngle < -Math.PI) {
				weaponAngle += Math.PI*2;
			}
		}
		else if (mouseAngle > weaponAngle) {
			weaponAngle += weaponRotateSpeed*deltaTime;
			//precision evite l'oscilation
			if (mouseAngle < weaponAngle) {
				weaponAngle = mouseAngle;
			}
		}
		else {
			weaponAngle -= weaponRotateSpeed*deltaTime;
			//precision evite l'oscilation
			if (mouseAngle > weaponAngle) {
				weaponAngle = mouseAngle;
			}
		}
	};

	/**
	 *  Weapon
	 */

	var rotateWeapon = function (newMouseX, newMouseY) {
		// a rename
		mouseX = newMouseX;
		mouseY = newMouseY;

		// weaponAngle = Math.atan2( mouseY - y, mouseX - x );
		//console.log(weaponAngle);
	};

	var fire = function () {
		var newMissile = new Missile();
		//positionne le missile au bout de la tourelle
		var xMiss = x + Math.cos(weaponAngle)*lengthWeapon;
		var yMiss = y + Math.sin(weaponAngle)*lengthWeapon;
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

		mouseX = newtank.mouseX;
		mouseY = newtank.mouseY;


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

	var draw = function (ctx, username) {
		ctx.save();
		//sent pos
		ctx.translate(x,y);
		//draw tank body
		ctx.rotate(angle);


		ctx.font = "8pt Calibri,Geneva,Arial";
	    ctx.fillStyle = "rgb(0,20,180)";
	    ctx.fillText(username, 0, 0);

		//ctx.fillStyle = color;
		//ctx.fillRect(-15, -10, 30, 20);
        ctx.save();
        ctx.shadowColor = "#222"; // color
        ctx.shadowBlur = 10;      // blur level
        ctx.shadowOffsetX = 2;    // horizontal offset
        ctx.shadowOffsetY = 2;    // vertical offset

        ctx.drawImage(
            imgTank,
            frame * 29,             // coordonnée x de départ
            0,                      // coordonnée y de départ
            28,                     // largeur du morceau d'image
            24,                     // hauteur du morceau d'image
            -14.5,                  // x pos par rapport au canvas
            -12,                    // y pos par rapport au canvas
            29,                     // largeur du morceau d'image
            24);                    // hauteur du morceau d'image
		//draw tank weapon
        ctx.restore();
		ctx.rotate(weaponAngle-angle);
		//ctx.fillStyle = 'red';
		//ctx.fillRect(-10, -5, 40, 10);
		// ctx.fillRect(0, 0, 1, 1)
        ctx.drawImage(imgTourelle, -16, -7);

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