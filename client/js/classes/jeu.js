/**
 * Created by Romain on 18/02/2015.
 */

var Jeu = function()
{
	var canvas, ctx, w, h;

	var mousePos;
	var userName;
	var allPlayers = {};
	var tanks;

	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;

	//deltatime
	var prevTime;
	var deltaTime;

	//tmp
	var tank;

	/**
	 * INITIALISATION
	 */
	var init = function (newuserName)
	{
		console.log("initialisation ok");
		userName = newuserName;
		//tmp
		tank = new Tank();
		tank.init();

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
			drawAllPlayers();
			//tmp
			tank.move(deltaTime/1000);
			tank.draw(ctx);
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
		mousePos = getMousePos(canvas, evt);
		
		allPlayers[userName].x = mousePos.x;
		allPlayers[userName].y = mousePos.y;
		var pos = {'user': userName, 'pos': mousePos}
		socket.emit('sendpos', pos);				   // ENVOIE DES COORDONNES
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
			tank.setIsRotatingLeft(true);
		}
		if (evt.keyCode === 38) {
			tank.setIsMovingForward(true);
		}
		if (evt.keyCode === 39) {
			tank.setIsRotatingRight(true);
		}
		if (evt.keyCode === 40) {
			tank.setIsMovingBackward(true);
		}
	}
	function traiteKeyUp(evt) {
		// console.log("keyUp");
		if (evt.keyCode === 37) {
			tank.setIsRotatingLeft(false);
		}
		if (evt.keyCode === 38) {
			tank.setIsMovingForward(false);
		}
		if (evt.keyCode === 39) {
			tank.setIsRotatingRight(false);
		}
		if (evt.keyCode === 40) {
			tank.setIsMovingBackward(false);
		}

	}


	/**
	 * MAJ des positions de chaque joueur
	 * @param newPos
	 */
	function updatePlayerNewPos (newPos) {			  // SERT A client.JS
		allPlayers[newPos.user].x = newPos.pos.x;
		allPlayers[newPos.user].y = newPos.pos.y;
	};

	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
	};
	/**
	 * MAJ du tableau des tanks (connexion et deconnexion
	 * @param listOfTanks
	 */
	function updatePlayers (listOfTanks) {
		tanks = listOfTanks;
	};

	/**
	 * Dessine le tank du joueur
	 * @param player
	 */
	function drawPlayer(player) {
		ctx.fillStyle = 'black';
		ctx.fillRect(player.x, player.y, 30, 30)
	}

	/**
	 * Dessine tous les joueurs
	 */
	function drawAllPlayers() {
		for (var name in allPlayers) {
			drawPlayer(allPlayers[name]);
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
		updatePlayerNewPos: updatePlayerNewPos
	};
};