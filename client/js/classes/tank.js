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

	/* const */
	const speedForward = 70;
	const speedBackward = 40;
	const rotateSpeed = 4;



	var init = function () {
		x = 50;
		y = 50;
		angle = 0;
		color = 'black';
		isMovingForward = false;
		isMovingBackward = false;
		isRotatingLeft = false;
		isRotatingRight = false;
	}

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
		if (isMovingForward) {
			moveForward(deltaTime);
		}
		else if (isMovingBackward) {
			moveBackward(deltaTime);
		}
		if (isRotatingLeft) {
			rotateLeft(deltaTime);
		}
		if (isRotatingRight) {
			rotateRight(deltaTime);
		}

	}

	var setIsMovingForward = function (newSet) {
		isMovingForward = newSet;
	}
	var setIsMovingBackward = function (newSet) {
		isMovingBackward = newSet;
	}
	var setIsRotatingLeft = function (newSet) {
		isRotatingLeft = newSet;
	}
	var setIsRotatingRight = function (newSet) {
		isRotatingRight = newSet;
	}


	var draw = function (ctx) {
		ctx.save();
		//set pos
		ctx.translate(x,y);
		//draw tank body
		ctx.rotate(angle);
		ctx.fillStyle = color;
		ctx.fillRect(-15, -10, 30, 20)
		//draw tank weapon
		ctx.rotate(weaponAngle-angle);
		ctx.fillStyle = 'red';
		ctx.fillRect(-10, -5, 40, 10)
		// ctx.fillRect(0, 0, 1, 1)

		ctx.restore();
	}



	return {
		//set params
		setIsMovingForward: setIsMovingForward,
		setIsMovingBackward: setIsMovingBackward,
		setIsRotatingLeft: setIsRotatingLeft,
		setIsRotatingRight: setIsRotatingRight,
		//func
		init: init,
		move: move,
		draw: draw
	}

}