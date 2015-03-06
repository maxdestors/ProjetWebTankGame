/**
 * Created by Romain on 18/02/2015.
 */

var Jeu = function()
{
	var canvas, ctx, w, h;

	//var mousePos;
	var userName;
	var allPlayers = {};

	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;

	//deltatime
	var prevTime;
	var deltaTime;


	/**
	 * INITIALISATION
	 */
	var init = function (newuserName)
	{
		console.log("initialisation ok");
		userName = newuserName;
		//tmp
		//tank = new Tank();
		//tank.init();

		//canvas
		canvas = document.querySelector("#tankCanvas");
		w = canvas.width;
		h = canvas.height;
		ctx = canvas.getContext('2d');
		// affiche FPS
		showFPS();
		// Les écouteurs
		canvas.addEventListener("mousedown", traiteMouseDown);
		canvas.addEventListener("mousemove", traiteMouseMove);
		document.addEventListener('keydown', traiteKeyDown, false);
		document.addEventListener('keyup', traiteKeyUp, false);

		prevTime = new Date().getTime();
		requestAnimationFrame(mainLoop);
	};

	/**
	 * ANIMATION MAINLOOP
	 */
	function mainLoop(time)
	{
		measureFPS(time);
		manageDeltaTime(time);
		if (userName != undefined) {
			clearCanvas();
			moveAllPlayers();
			drawAllPlayers();
		}
		requestAnimationFrame(mainLoop);
	}

	/**
	 * Traitement souris
	 * @param evt
	 */
	function traiteMouseDown(evt) {
		//console.log("mousedown");
	}

	function traiteMouseMove(evt) {
		/*mousePos = getMousePos(canvas, evt);
		
		allPlayers[userName].x = mousePos.x;
		allPlayers[userName].y = mousePos.y;
		var pos = {'user': userName, 'pos': mousePos}
		socket.emit('sendpos', pos);				   // ENVOIE DES COORDONNES
		*/
	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}
	/**
	 * Traitement clavier
	 * @param evt
	 */
	function traiteKeyDown(evt) {
		// console.log("keyDown: "+evt.keyCode);
		// 37      Left arrow
		// 38      Up arrow
		// 39      Right arrow
		// 40      Down arrow
		if (evt.keyCode === 37) {
			if (!allPlayers[userName].tank.getIsRotatingLeft()) {
				allPlayers[userName].tank.setIsRotatingLeft(true);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 38) {
			if (!allPlayers[userName].tank.getIsMovingForward()) {
				allPlayers[userName].tank.setIsMovingForward(true);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 39) {
			if (!allPlayers[userName].tank.getIsRotatingRight()) {
				allPlayers[userName].tank.setIsRotatingRight(true);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 40) {
			if (!allPlayers[userName].tank.getIsMovingBackward()) {
				allPlayers[userName].tank.setIsMovingBackward(true);
				sendUpdateUserTank();
			}
		}
	}
	function traiteKeyUp(evt) {
		// console.log("keyUp");
		if (evt.keyCode === 37) {
			if (allPlayers[userName].tank.getIsRotatingLeft()) {
				allPlayers[userName].tank.setIsRotatingLeft(false);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 38) {
			if (allPlayers[userName].tank.getIsRotatingLeft()) {
				allPlayers[userName].tank.setIsMovingForward(false);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 39) {
			if (allPlayers[userName].tank.getIsRotatingLeft()) {
				allPlayers[userName].tank.setIsRotatingRight(false);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 40) {
			if (allPlayers[userName].tank.getIsRotatingLeft()) {
				allPlayers[userName].tank.setIsMovingBackward(false);
				sendUpdateUserTank();
			}
		}

	}

	function sendUpdateUserTank () {
		//var userTank = {'user': userName, 'tank': allPlayers[userName].tank}
		var test2 = allPlayers[userName].tank.getMembers();
		socket.emit('sendUpdateUserTank', test2);
		// socket.emit('sendUpdateUserTank', allPlayers[userName].tank);
	}


	/**
	 * MAJ des positions de chaque joueur
	 * @param newPos
	 */
	function updatePlayerTank (name, tank) {			  // SERT A client.JS
		// console.log(tank);
		allPlayers[name].tank.updateTank(tank);
	};

	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
		var cpt=0;
		for (var name in allPlayers) {
			cpt++;
			if(allPlayers[name].tank == null) {
				allPlayers[name].tank = new Tank();
				allPlayers[name].tank.init(100, 100, 0, 'black');
			}
		}
		console.log('updatePlayers: '+cpt);
	};

	/**
	 * Dessine le tank du joueur
	 * @param tank
	 */
	function drawTank(userTank) {
		userTank.tank.draw(ctx);
	}

	/**
	 * Dessine tous les joueurs
	 */
	function drawAllPlayers() {
		for (var name in allPlayers) {
			drawTank(allPlayers[name]);
		}
	}

	/**
	 * bouge le tank du joueur
	 * @param tank
	 */
	function moveTank(userTank) {
		userTank.tank.move(deltaTime/1000);
	}

	/**
	 * bouge tous les joueurs
	 */
	function moveAllPlayers() {
		for (var name in allPlayers) {
			//console.log(name);
			// allPlayers[name].tank.move(deltaTime/1000);
			moveTank(allPlayers[name]);
		}
	}

	/**
	 * FPS
	 * @param newTime
	 */
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
			fpsContainer.innerHTML = 'FPS: ' + fps;
		}
		frameCount++;
	};

	function showFPS() {
		fpsContainer = document.createElement('div');
		fpsContainer.setAttribute('style', 'color: red');
		document.querySelector('#game').appendChild(fpsContainer);
	}

	function manageDeltaTime() {
		var newTime = new Date().getTime();
		deltaTime = newTime - prevTime;
		prevTime = newTime;
	}

	/**
	 * Nettoie canvas, efface l'ecran
	 */
	function clearCanvas() {
		ctx.clearRect(0, 0, w, h);
	}

	// methodes publiques
	return {
		init: init,
		updatePlayers: updatePlayers,
		updatePlayerTank: updatePlayerTank
	};
};