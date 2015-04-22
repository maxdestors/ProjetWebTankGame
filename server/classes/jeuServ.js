/**
 * Created by Romain on 18/02/2015.
 */

var Jeu = function()
{
	var canvas, ctx, w, h;

	var isGameRunning;

	var mousePos;
	var userName;
	var allPlayers = {};

	// missiles
	var allMissiles = new Array();

	// sounds
	var soundMiss, soundNewPlayer;

	// fps
	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;

	//deltatime
	var prevTime;
	var deltaTime;

	/**
	 *  INITIALISATION
	 */
	var init = function (arrayName)
	{
		for (var name in arrayName) {
			allPlayers[name] = new Player();
			allPlayers[name].init(name, arrayName[name], true)
		}
		start();
	};

	var start = function ()
	{
		isGameRunning = true;
		prevTime = new Date().getTime();
		mainLoop();
	};

	var stop = function ()
	{
		for (var name in allPlayers) {
			delete allPlayers[name];
		}
		
		isGameRunning = false;
		console.log('game stopped');
	};

	/**
	 * ANIMATION MAINLOOP
	 */
	function mainLoop(time)
	{
		manageDeltaTime(time);
		
		//clearCanvas();

		moveAllMissiles();

		moveAllPlayers();

		checkCollision();

		if (isGameRunning) {
			//requestAnimationFrame(mainLoop);
			setTimeout(mainLoop, 50);
		}
	}


	function sendNewMove (newMove, state) {
		socket.emit('sendNewMove', newMove, state);
	}

	var newMove = function (name, newMovement, state) {
		return allPlayers[name].newMove(newMovement, state);
	};


	/**
	 * ajout d'un nouveau missile
	 * 
	 */
	function addNewMissile (newMissile) {
		var miss = new Missile();
		miss.updateMissile(newMissile);
		allMissiles.push(miss);
		//soundMiss.play();                                                   // TODO new missile sound
	}


	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion)
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
		console.log("allPlayers" + allPlayers);
	}




	/**
	 * Bouge tous les joueurs
	 */
	function moveAllPlayers() {
		for (var name in allPlayers) {
			allPlayers[name].moveTank(deltaTime/1000);
		}
	}

	/**
	 * Bouge tous les missiles et supprime
	 */
	function moveAllMissiles() {
		for (var i = allMissiles.length - 1; i >= 0; i--) {
			if (!allMissiles[i].move(deltaTime/1000)) {
				allMissiles.splice(i, 1);
			}
		}
	}


	function manageDeltaTime() {
		var newTime = new Date().getTime();
		deltaTime = newTime - prevTime;
		prevTime = newTime;
	}







	function checkCollision() {
		var xyTank;
		var xyrMissile;
		for (var name in allPlayers) {
			for (var i = allMissiles.length - 1; i >= 0; i--) {
				
				xyTank = allPlayers[name].getXYTank();
				xyrMissile = allMissiles[i].getXYR();

				if (circRectsOverlap(xyTank.x-xyTank.w/2, xyTank.y-xyTank.h/2, xyTank.w, xyTank.h, xyrMissile.x, xyrMissile.y, xyrMissile.r) ) {
					//faire la vie du tank
					//allPlayers[name].killTank();
					allMissiles.splice(i, 1);
					// a comment qu'on fait ?
					// socket.in(socket.room).emit('sendKillMissile', i);
				}
			}
			
		}
	}

	// Teste collisions entre cercles
	function circleCollide(x1, y1, r1, x2, y2, r2) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));  
	}
	// Collisions between rectangle
	function rectsOverlap(x0, y0, w0, h0, x2, y2, w2, h2) {
		if ((x0 > (x2 + w2)) || ((x0 + w0) < x2))
		    return false;

		if ((y0 > (y2 + h2)) || ((y0 + h0) < y2))
		    return false;
		return true;
	}
	// Collisions between rectangle and circle
	function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
		var testX=cx; 
		var testY=cy; 

		if (testX < x0) testX=x0; 
		if (testX > (x0+w0)) testX=(x0+w0); 
		if (testY < y0) testY=y0; 
		if (testY > (y0+h0)) testY=(y0+h0); 

		return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))<r*r); 
	}
	function testCollisionWithWalls(ball) {
		// left
		if (ball.x < ball.radius) {
		    ball.x = ball.radius;
		    ball.angle = -ball.angle + Math.PI;
		} 
		// right
		if (ball.x > w - (ball.radius)) {
		    ball.x = w - (ball.radius);
		    ball.angle = -ball.angle + Math.PI; 
		}     
		// up
		if (ball.y < ball.radius) {
		    ball.y = ball.radius;
		    ball.angle = -ball.angle;     
		}     
		// down
		if (ball.y > h - (ball.radius)) {
		    ball.y = h - (ball.radius);
		    ball.angle =-ball.angle; 
		}
	}







	// methodes publiques
	return {
		init: init,
		start: start,
		stop: stop,
		newMove: newMove,
		updatePlayers: updatePlayers,
		// updatePlayerTank: updatePlayerTank,
		addNewMissile: addNewMissile
	};
};