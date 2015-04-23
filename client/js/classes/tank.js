/**
 * Created by Romain on 20/02/2015.
 */

var Tank = function ()
{
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

	var hitPoint;

	/* const */
	const speedForward = 80;
	const speedBackward = 40;
	const rotateSpeed = 3;
	const weaponRotateSpeed = 4;

	const maxHitPoint = 3;

	const lengthWeapon = 20;     // ou les missiles commence

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
		hitPoint = maxHitPoint;

		deltaDistance = 0;
		frame = 0;

		// isServeur parametre facultatif
		if (!isServeur || isServeur === false) {

			// if numCouleur == 1
			// img = orange_tank
			
	        // sprites
	        imgTank = new Image();
	        imgTourelle = new Image();


			switch (color) {
				case '#2e6b93':
			        imgTank.src = '../../img/tanks/blue_tank.png';
			        imgTourelle.src = '../../img/tanks/blue_tourelle.png';
					break;
				case '#56af15':
			        imgTank.src = '../../img/tanks/green_tank.png';
			        imgTourelle.src = '../../img/tanks/green_tourelle.png';
					break;
				case '#ec6a11':
			        imgTank.src = '../../img/tanks/orange_tank.png';
			        imgTourelle.src = '../../img/tanks/orange_tourelle.png';
					break;
				case '#891adc':
			        imgTank.src = '../../img/tanks/purple_tank.png';
			        imgTourelle.src = '../../img/tanks/purple_tourelle.png';
					break;
				default:
			        imgTank.src = '../../img/tanks/grey_tank.png';
			        imgTourelle.src = '../../img/tanks/grey_tourelle.png';
					break;
			}
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

	var hit = function() {
		hitPoint--;
	};

	var isDestroyed = function() {
		return (hitPoint > 0) ? false : true;
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

	var getXY = function () {
		return {
			'x' : x,
			'y' : y,
			'w' : 28,
			'h' : 24
		}
	};


	/**
	 * Dessine le tank
	 */
	var draw = function (ctx, username) {
		ctx.save();
		ctx.translate(x,y);       //envoie position

		ctx.beginPath();
		ctx.lineWidth="1";
		// ctx.strokeStyle="rgb(55, 183, 109)"; // couleur plus foncé
		ctx.strokeStyle="rgb(55, 55, 55)";
		ctx.rect(-15,-23,30,5);
		ctx.stroke();

		ctx.fillStyle="rgb(46, 204, 113)";
		ctx.fillRect(-15,-23,30*hitPoint/maxHitPoint,5);

        // draw :
		ctx.font = "8pt Calibri,Geneva,Arial";
	    ctx.fillStyle = "rgb(0, 0, 0)";
	    ctx.fillText(username, -15,-27);

		ctx.rotate(angle);

        ctx.save();
        ctx.shadowColor = "#222"; // color
        ctx.shadowBlur = 10;      // blur level
        ctx.shadowOffsetX = 2;    // horizontal offset
        ctx.shadowOffsetY = 2;    // vertical offset

        ctx.drawImage(
            imgTank,
            frame * 29,           // coordonnée x de départ
            0,                    // coordonnée y de départ
            28,                   // largeur du morceau d'image
            24,                   // hauteur du morceau d'image
            -14.5,                // x pos par rapport au canvas
            -12,                  // y pos par rapport au canvas
            29,                   // largeur du morceau d'image
            24);                  // hauteur du morceau d'image
		//draw tank weapon
        ctx.restore();
		ctx.rotate(weaponAngle-angle);
        ctx.drawImage(imgTourelle, -16, -7);
		ctx.restore();
	};

    // methodes publiques
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
		
		getXY: getXY,
		//func
		init: init,
		move: move,
		draw: draw,
		updateTank: updateTank,
		getMembers: getMembers,
		rotateWeapon: rotateWeapon,
		fire: fire,
		hit: hit,
		isDestroyed: isDestroyed
	}
};