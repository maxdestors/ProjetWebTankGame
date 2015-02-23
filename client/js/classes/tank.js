/**
 * Created by Romain on 20/02/2015.
 */

var tank = function () {
	var x, y;
	var angle;
	var weaponAngle;
	var color;


	var init = function () {
		x = 0;
		y = 0;
		angle = 0;
		color = 'black';
	}




	var draw = function (ctx) {
		ctx.save();
		//set pos
		ctx.translation(x,y);
		//draw tank body
		ctx.rotate(angle);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 20, 30)
		//draw tank weapon
		ctx.rotate(weaponAngle-angle);
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, 10, 40)

		ctx.restore();
	}



	return {
		init: init,
		draw: draw
	}

}