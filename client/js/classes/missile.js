var Missile = function () {
	var x, y;
	var rayon;
	var angle;
	var speed;
	var color;

	var init = function (newX, newY, newRayon, newAngle, newSpeed, newColor) {
		x = newX;
		y = newY;
		rayon = newRayon;
		angle = newAngle;
		speed = newSpeed;
		color = newColor;
	};


	var move = function (deltaTime) {
		// TODO gestion colision
		if (x < 10 || y < 10 || x > 790|| y > 490) {
			return false;
		}
		x += speed*Math.cos(angle)*deltaTime;
		y += speed*Math.sin(angle)*deltaTime;
		return true;
	}

	var updateMissile = function (newMissile) {
		x = newMissile.x;
		y = newMissile.y;
		rayon = newMissile.rayon;
		angle = newMissile.angle;
		speed = newMissile.speed;
		color = newMissile.color;
	};

	var getMembers = function () {
		return {
			'x' : x,
			'y' : y,
			'rayon' : rayon,
			'angle' : angle,
			'speed' : speed,
			'color' : color
		}
	};

	var draw = function (ctx) {
		ctx.save();
		//sent pos
		ctx.translate(x,y);
		//draw tank body
		ctx.rotate(angle);
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(0, 0, rayon, 0, 2 * Math.PI);
		ctx.fill();

		ctx.restore();
	};


	return {
		init: init,
		move: move,
		draw: draw,
		updateMissile: updateMissile,
		getMembers: getMembers
	}

}