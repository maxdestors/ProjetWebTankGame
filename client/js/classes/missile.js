var Missile = function () {
	var x, y;
	var rayon;
	var angle;
	var speed;
	var color;

    /**
     * Initialisation du missile
     * @param newX
     * @param newY
     * @param newRayon
     * @param newAngle
     * @param newSpeed
     * @param newColor
     */
	var init = function (newX, newY, newRayon, newAngle, newSpeed, newColor) {
		x = newX;
		y = newY;
		rayon = newRayon;
		angle = newAngle;
		speed = newSpeed;
		color = newColor;
	};

    /**
     * Mouvement du missile
     * @param deltaTime
     * @returns {boolean}
     */
	var move = function (deltaTime) {
		// TODO gestion colision
		if (x < 10 || y < 10 || x > 790|| y > 490) {
			return false;
		}
		x += speed*Math.cos(angle)*deltaTime;
		y += speed*Math.sin(angle)*deltaTime;
		return true;
	}

    /**
     * Mise à jour de la position
     * @param newMissile
     */
	var updateMissile = function (newMissile) {
		x = newMissile.x;
		y = newMissile.y;
		rayon = newMissile.rayon;
		angle = newMissile.angle;
		speed = newMissile.speed;
		color = newMissile.color;
	};

    /**
     * Getter
     * @returns {{x: *, y: *, rayon: *, angle: *, speed: *, color: *}}
     */
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

	var getXYR = function () {
		return {
			'x' : x,
			'y' : y,
			'r' : rayon
		}
	};

    /**
     * Dessine le missile
     * @param ctx
     */
	var draw = function (ctx) {
		ctx.save();
        ctx.shadowColor = "#111"; // color
        ctx.shadowBlur = 6;      // blur level
        ctx.shadowOffsetX = 1;    // horizontal offset
        ctx.shadowOffsetY = 1;    // vertical offset
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

    // méthodes publiques
	return {
		init: init,
		move: move,
		draw: draw,
		updateMissile: updateMissile,
		getMembers: getMembers,
		getXYR: getXYR
	}
};