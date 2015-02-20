/**
 * Created by Romain on 19/02/2015.
 */


// GAME FRAMEWORK STARTS HERE
var GF = function(){
	// Vars relative to the canvas
	var canvas, ctx, w, h;
	var x,y;
	var mousePos;

	// vars for counting frames/s, used by the measureFPS function
	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;

	var measureFPS = function(newTime){

		// test for the very first invocation
		if(lastTime === undefined) {
			lastTime = newTime;
			return;
		}

		//calculate the difference between last & current frame
		var diffTime = newTime - lastTime;

		if (diffTime >= 1000) {
			fps = frameCount;
			frameCount = 0;
			lastTime = newTime;
		}

		//and display it in an element we appended to the
		// document in the start() function
		fpsContainer.innerHTML = 'FPS: ' + fps;
		frameCount++;
	};

	// clears the canvas content
	function clearCanvas() {
		ctx.clearRect(0, 0, w, h);
	}

	// Functions for drawing the monster and maybe other objects
	function drawMyMonster(x, y) {
		// draw a big monster !
		// head
		// save the context
		ctx.save();
		// translate the coordinate system, draw relative to it
		ctx.translate(x, y);
		// (0, 0) is the top left corner of the monster.
		ctx.strokeRect(0, 0, 100, 100);
		// eyes
		ctx.fillRect(20, 20, 10, 10);
		ctx.fillRect(65, 20, 10, 10);
		// nose
		ctx.strokeRect(45, 40, 10, 40);
		// mouth
		ctx.strokeRect(35, 84, 30, 10);
		// teeth
		ctx.fillRect(38, 84, 10, 10);
		ctx.fillRect(52, 84, 10, 10);

		// restore the context
		ctx.restore();
	}

	var mainLoop = function(time){
		//main function, called each frame
		measureFPS(time);

		// Clear the canvas
		clearCanvas();

		// draw the monster
		drawMyMonster(x, y);

		// call the animation loop every 1/60th of second
		requestAnimationFrame(mainLoop);
	};

	var start = function(){
		// adds a div for displaying the fps value
		fpsContainer = document.createElement('div');
		document.body.appendChild(fpsContainer);

		// Canvas, context etc.
		canvas = document.querySelector("#tankCanvas");

		// often useful
		w = canvas.width;
		h = canvas.height;
		x = 10;
		y = 10;

		// important, we will draw with this object
		ctx = canvas.getContext('2d');
		canvas.addEventListener("mousemove", traiteMouseMove);

		// start the animation
		requestAnimationFrame(mainLoop);
	};

	var updateXY = function (pos) {
		console.log("pos.x: "+pos.x);
		x = pos.x;
		y = pos.y;
	}
	function traiteMouseMove(evt) {
		//console.log("mousemove");
		mousePos = getMousePos(canvas, evt);
	
		// console.log("mousePos.x: "+mousePos.x);
		var pos = mousePos;
		socket.emit('sendpos', pos);				   // ENVOIE DES COORDONNES
	}
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}


	//our GameFramework returns a public API visible from outside its scope
	return {
		start: start,
		updateXY: updateXY
	};
};